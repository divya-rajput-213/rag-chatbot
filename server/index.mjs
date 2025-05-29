// Load environment variables from a `.env` file into process.env
import 'dotenv/config';

// Import required libraries
import express from 'express'; // Web framework for Node.js
import multer from 'multer'; // Middleware for handling file uploads
import cors from 'cors'; // Enable Cross-Origin Resource Sharing
import fs from 'fs'; // File system module
import path from 'path';

// Import LangChain modules
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'; // To load and parse PDF files
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'; // To split large texts into smaller chunks
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from '@langchain/google-genai'; // Google AI Embeddings & Chat model
import { MemoryVectorStore } from 'langchain/vectorstores/memory'; // In-memory vector store

// Initialize express app
const app = express();

// Create uploads folder if missing
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('Created uploads directory');
}
// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middlewares
app.use(cors()); // Allow requests from any origin
app.use(express.json()); // Parse JSON bodies

let retriever = null; // This will store your vector retriever

// Retry helper function with exponential backoff for 429 errors
async function invokeWithRetry(model, messages, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.invoke(messages);
    } catch (err) {
      if (err.statusCode === 429) {
        const waitTime = (2 ** i) * 1000; // 1s, 2s, 4s backoff
        console.warn(`429 Too Many Requests. Retrying after ${waitTime}ms... (Attempt ${i + 1} of ${retries})`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        throw err; // rethrow other errors
      }
    }
  }
  throw new Error('Max retries reached due to repeated 429 errors.');
}

// POST /upload - Accept a PDF file, process it, and prepare for question-answering
app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).send({ error: 'No files uploaded.' });
    }

    console.log(`🟡 ${files.length} files uploaded`);

    const allDocs = [];

    for (const file of files) {
      console.log("📄 Processing file:", file.originalname);

      const loader = new PDFLoader(file.path);
      const docs = await loader.load();
      allDocs.push(...docs);

      // Delete file after processing
      fs.unlinkSync(file.path);
    }

    console.log("📄 Total pages loaded:", allDocs.length);

    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 800, chunkOverlap: 50 });
    const splitDocs = await splitter.splitDocuments(allDocs);

    console.log("✂️ Documents split into chunks:", splitDocs.length);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
    retriever = vectorStore.asRetriever();

    console.log("📦 Embeddings and vector store created successfully");
    res.send({ message: '✅ PDFs uploaded and processed.' });
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
      model: 'gemini-2.0-flash',
      temperature: 0,
    });

    // Use retry helper to invoke the model with exponential backoff on 429
    const response = await invokeWithRetry(model, [
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
