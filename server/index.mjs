// Load environment variables from a `.env` file into process.env
import 'dotenv/config';

// Import required libraries
import express from 'express'; // Web framework for Node.js
import multer from 'multer'; // Middleware for handling file uploads
import cors from 'cors'; // Enable Cross-Origin Resource Sharing
import fs from 'fs'; // File system module

// Import LangChain modules
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'; // To load and parse PDF files
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'; // To split large texts into smaller chunks
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from '@langchain/google-genai'; // Google AI Embeddings & Chat model
import { MemoryVectorStore } from 'langchain/vectorstores/memory'; // In-memory vector store

// Initialize express app
const app = express();

// Configure multer to store uploaded files in 'uploads/' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Middlewares
app.use(cors()); // Allow requests from any origin
app.use(express.json()); // Parse JSON bodies

let retriever = null; // This will store your vector retriever

// POST /upload - Accept a PDF file, process it, and prepare for question-answering
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log("🟡 Upload received:", req.file);

    // Load and parse the uploaded PDF
    const loader = new PDFLoader(req.file.path);
    const docs = await loader.load();
    console.log("📄 PDF loaded. Pages:", docs.length);

    // Split the loaded documents into chunks
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 800, chunkOverlap: 50 });
    const splitDocs = await splitter.splitDocuments(docs);
    console.log("✂️ Documents split into chunks:", splitDocs.length);

    // Create embeddings using GoogleGenerativeAI
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    // Store the split documents into an in-memory vector store
    const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
    retriever = vectorStore.asRetriever(); // Store retriever globally
    console.log("📦 Embeddings and vector store created successfully");

    // Delete the uploaded file after processing
    fs.unlinkSync(req.file.path);

    res.send({ message: '✅ PDF uploaded and processed.' });
  } catch (err) {
    console.error("❌ Error during PDF upload processing:", err);
    res.status(500).send({ error: err.message });
  }
});

// POST /query - Accept a question and return an answer based on uploaded PDF
app.post('/query', async (req, res) => {
  const { question } = req.body;
  console.log("🔍 Question received:", question);

  if (!retriever) {
    console.warn("❌ No retriever available. Upload PDF first.");
    return res.status(400).send({ error: '❌ Upload a PDF first.' });
  }

  try {
    // Retrieve relevant documents from vector store
    const docs = await retriever.getRelevantDocuments(question);
    const context = docs.map(d => d.pageContent).join('\n');

    console.log("📚 Context gathered from PDF:", context, "...");

    if (!context || context.length < 20) {
      console.warn("⚠️ Context too short or not relevant.");
      return res.send({ answer: '❌ This query is not relevant to the uploaded PDF.' });
    }

    // Initialize the model
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: 'gemini-1.5-pro',
      temperature: 0,
    });

    // Ask the question based on context
    const response = await model.invoke([
      { role: 'system', content: 'You are a helpful assistant. Answer the question based on the context from the uploaded PDF.' },
      { role: 'user', content: `Context:\n${context}\n\nQuestion: ${question}` },
    ]);

    console.log("🟢 AI Response:", response);

    res.send({ answer: response.content });
  } catch (err) {
    console.error("❌ Error during querying:", err);
    res.status(500).send({ error: err.message });
  }
});


// Start server
app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
