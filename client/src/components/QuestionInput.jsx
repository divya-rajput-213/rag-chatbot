import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function QuestionInput({ question, setQuestion, handleQuery, loading }) {
  return (
    <Box
      sx={{ display: 'flex', gap: 1 }}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleQuery();
      }}
    >
      <TextField
        label="Ask a question..."
        variant="outlined"
        fullWidth
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={loading}
      />
      <Button
        type="submit"
        variant="contained"
        endIcon={<SendIcon />}
        disabled={!question.trim() || loading}
      >
        Send
      </Button>
    </Box>
  );
}
