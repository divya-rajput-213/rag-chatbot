import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function FileUpload({ file, setFile, handleUpload }) {
  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{ p: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Button
        variant="contained"
        component="label"
        startIcon={<UploadFileIcon />}
        fullWidth
      >
        Select PDF File
        <input
          type="file"
          hidden
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </Button>

      {file && (
        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
          Selected file: {file.name}
        </Typography>
      )}

      <Button
        variant="outlined"
        onClick={handleUpload}
        disabled={!file}
        fullWidth
      >
        Upload PDF
      </Button>
    </Box>
  );
}
