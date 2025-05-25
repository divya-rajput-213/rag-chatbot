import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, CircularProgress, Paper } from '@mui/material';

export default function ChatWindow({ chat, loading }) {
  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{ height: 400, overflowY: 'auto', p: 2, mb: 2, bgcolor: '#f9f9f9' }}
    >
      {chat.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ mt: 10 }}>
          Ask a question about the uploaded PDF below...
        </Typography>
      )}
      <List>
        {chat.map((msg, i) => (
          <ListItem
            key={i}
            sx={{ justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                bgcolor: msg.type === 'user' ? 'primary.main' : 'grey.300',
                color: msg.type === 'user' ? 'primary.contrastText' : 'text.primary',
                borderRadius: 2,
                p: 1.5,
                wordBreak: 'break-word',
              }}
            >
              <ListItemText primary={msg.text} />
            </Box>
          </ListItem>
        ))}
        {loading && (
          <ListItem sx={{ justifyContent: 'flex-start' }}>
            <CircularProgress size={24} />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
