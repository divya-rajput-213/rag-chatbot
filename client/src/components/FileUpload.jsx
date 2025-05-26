import React from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function FileUpload({ files, setFiles, handleUpload }) {
  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        mb: 4,
        maxWidth: 600,
        mx: "auto",
        borderRadius: 4,
        bgcolor: "background.paper",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        align="center"
        sx={{
          fontWeight: "700",
          background: "linear-gradient(90deg, #2196f3, #21cbf3)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: 1,
          mb: 1,
        }}
      >
        Upload PDF Files
      </Typography>

      <Button
        variant="contained"
        component="label"
        startIcon={<UploadFileIcon />}
        sx={{
          py: 1.8,
          fontWeight: 700,
          fontSize: 16,
          textTransform: "none",
          bgcolor: "primary.main",
          boxShadow: "0 6px 15px rgba(33, 203, 243, 0.6)",
          borderRadius: 3,
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "primary.dark",
            boxShadow: "0 8px 20px rgba(25, 118, 210, 0.8)",
            transform: "scale(1.05)",
          },
        }}
        fullWidth
      >
        Select Files
        <input
          type="file"
          hidden
          multiple
          accept="application/pdf"
          onChange={(e) => setFiles(Array.from(e.target.files))}
          aria-label="Select PDF files"
        />
      </Button>

      {files.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, fontWeight: "600", color: "text.secondary" }}
          >
            Selected Files
          </Typography>

          <List
            dense
            sx={{
              maxHeight: 160,
              overflowY: "auto",
              bgcolor: "grey.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.300",
              p: 1,
              "&::-webkit-scrollbar": {
                width: 8,
                borderRadius: 8,
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#2196f3",
                borderRadius: 8,
              },
            }}
          >
            {files.map((file, idx) => (
              <ListItem
                key={idx}
                sx={{
                  px: 1,
                  borderRadius: 2,
                  transition: "background-color 0.2s ease",
                  "&:hover": { bgcolor: "primary.light" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "error.main" }}>
                  <PictureAsPdfIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: { fontWeight: 600, fontSize: 15 },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Button
        variant="outlined"
        color="primary"
        onClick={handleUpload}
        disabled={!files.length}
        fullWidth
        sx={{
          py: 1.8,
          fontWeight: 700,
          fontSize: 16,
          textTransform: "none",
          borderWidth: 2,
          borderRadius: 3,
          transition: "all 0.3s ease",
          "&:disabled": { borderColor: "grey.400", color: "grey.400" },
          "&:hover:not(:disabled)": {
            bgcolor: "primary.light",
            borderColor: "primary.main",
            boxShadow: "0 6px 12px rgba(33, 203, 243, 0.4)",
            transform: "scale(1.03)",
          },
        }}
      >
        Upload PDFs
      </Button>
    </Paper>
  );
}
