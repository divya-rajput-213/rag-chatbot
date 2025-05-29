import React, { useState } from "react";
import { CssBaseline, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import ChatWindow from "./components/ChatWindow";
import QuestionInput from "./components/QuestionInput";
import "./App.css"; // import the CSS here

export default function App() {
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleUpload = async () => {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, formData);
      alert(res.data.message);
    } catch {
      alert("Upload failed");
    }
  };

  const handleQuery = async () => {
    if (!question.trim()) return;
    setChat((prev) => [...prev, { type: "user", text: question }]);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/query`, { question });
      const botAnswer = res.data.answer || "Sorry, no answer found.";
      setChat((prev) => [...prev, { type: "bot", text: botAnswer }]);
    } catch {
      setChat((prev) => [
        ...prev,
        { type: "bot", text: "Error: Could not get answer." },
      ]);
    }

    setLoading(false);
    setQuestion("");
  };

  return (
    <>
      <CssBaseline />
      <div className="appContainer">
        {/* Left side - File Upload */}
        <div className="uploadSection">
          <Typography variant="h4" className="title">
            Upload PDFs
          </Typography>
          <FileUpload
            files={files}
            setFiles={setFiles}
            handleUpload={handleUpload}
          />
        </div>

        {/* Right side - Chat */}
        <div className="chatSection">
          <Typography variant="h4" className="title">
            Ask Questions
          </Typography>

          {/* <div className="chatWindowWrapper"> */}
            <ChatWindow chat={chat} loading={loading} />
          {/* </div> */}

          <QuestionInput
            question={question}
            setQuestion={setQuestion}
            handleQuery={handleQuery}
            loading={loading}
          />

          {loading && (
            <div className="loadingSpinner">
              <CircularProgress color="primary" size={30} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
