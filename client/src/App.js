import React, { useState } from 'react';
import { Container, CssBaseline, Typography } from '@mui/material';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import ChatWindow from './components/ChatWindow';
import QuestionInput from './components/QuestionInput';


function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      alert(res.data.message);
    } catch {
      alert('Upload failed');
    }
  };

  const handleQuery = async () => {
    if (!question.trim()) return;
    setChat((prev) => [...prev, { type: 'user', text: question }]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/query', { question });
      const botAnswer = res.data.answer || 'Sorry, no answer found.';
      setChat((prev) => [...prev, { type: 'bot', text: botAnswer }]);
    } catch {
      setChat((prev) => [...prev, { type: 'bot', text: 'Error: Could not get answer.' }]);
    }

    setLoading(false);
    setQuestion('');
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          📄 PDF Chatbot (RAG with Gemini)
        </Typography>

        <FileUpload file={file} setFile={setFile} handleUpload={handleUpload} />

        <ChatWindow chat={chat} loading={loading} />

        <QuestionInput
          question={question}
          setQuestion={setQuestion}
          handleQuery={handleQuery}
          loading={loading}
        />
      </Container>
    </>
  );
}

export default App;
