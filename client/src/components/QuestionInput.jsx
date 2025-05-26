import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function QuestionInput({ question, setQuestion, handleQuery, loading }) {
  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleQuery();
      }}
      sx={{
        display: 'flex',
        gap: 1.5,
        mt: 2,
      }}
    >
      <TextField
        label="Ask a question..."
        variant="outlined"
        fullWidth
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={loading}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '25px',
            bgcolor: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            '& fieldset': {
              borderColor: '#ddd',
            },
            '&:hover fieldset': {
              borderColor: '#2196f3',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2196f3',
              boxShadow: '0 0 8px rgba(33, 150, 243, 0.4)',
            },
          },
          '& input': {
            fontSize: '1rem',
            padding: '12.5px 14px',
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        endIcon={<SendIcon />}
        disabled={!question.trim() || loading}
        sx={{
          borderRadius: '25px',
          px: 4,
          bgcolor: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
          boxShadow: '0 4px 15px rgba(33,203,243,0.5)',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          transition: 'background 0.3s ease',
          '&:hover': {
            bgcolor: 'linear-gradient(45deg, #1976d2 30%, #1e88e5 90%)',
            boxShadow: '0 6px 20px rgba(25, 118, 210, 0.6)',
          },
          '& .MuiSvgIcon-root': {
            color: '#fff',
          },
        }}
      >
        Send
      </Button>
    </Box>
  );
}
