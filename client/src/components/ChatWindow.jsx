import React from "react";
import ReactMarkdown from "react-markdown";
import {
  Box,
  List,
  ListItem,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";

export default function ChatWindow({ chat, loading }) {
  return (
    <Box
      component={Paper}
      elevation={8}
      sx={{
        height: 420,
        overflowY: "auto",
        p: 3,
        mb: 3,
        bgcolor: "#f0f4ff",
        borderRadius: 3,
        boxShadow:
          "0 8px 32px 0 rgba(31, 38, 135, 0.1), 0 4px 16px 0 rgba(31, 38, 135, 0.05)",
        "&::-webkit-scrollbar": {
          width: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#90caf9",
          borderRadius: 3,
        },
      }}
    >
      {chat.length === 0 && (
        <Typography
          color="text.secondary"
          align="center"
          sx={{ mt: 14, fontStyle: "italic", fontWeight: 500, fontSize: 16 }}
        >
          Ask a question about the uploaded PDF below...
        </Typography>
      )}

      <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {chat.map((msg, i) => {
          const isUser = msg.type === "user";
          return (
            <ListItem
              key={i}
              sx={{
                justifyContent: isUser ? "flex-end" : "flex-start",
                px: 0,
              }}
            >
              <Box
                sx={{
                  maxWidth: "72%",
                  bgcolor: isUser
                    ? "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)"
                    : "rgba(220, 220, 220, 0.8)",
                  borderRadius: 3,
                  p: 2,
                  boxShadow: isUser
                    ? "0 4px 15px rgba(33, 203, 243, 0.4)"
                    : "0 2px 8px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  wordBreak: "break-word",
                  color: isUser ? "#fff" : "text.primary",
                  fontSize: 15,
                  lineHeight: 1.5,
                  fontWeight: 400,
                  fontFamily: "'Inter', sans-serif",
                  textShadow: isUser
                    ? "0 0 3px rgba(0, 0, 0, 0.6)" // subtle shadow for readability
                    : "none",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    width: 0,
                    height: 0,
                    borderStyle: "solid",
                    top: 12,
                    ...(isUser
                      ? {
                          borderWidth: "10px 0 10px 10px",
                          borderColor: `transparent transparent transparent #2196f3`,
                          right: -10,
                        }
                      : {
                          borderWidth: "10px 10px 10px 0",
                          borderColor: `transparent rgba(220,220,220,0.8) transparent transparent`,
                          left: -10,
                        }),
                  },
                  // Force all nested text and inline elements inside user bubble to white and inherit shadow:
                  "& *": {
                    color: isUser ? "black !important" : "inherit",
                    textShadow: isUser ? "0 0 3px rgba(0,0,0,0.6)" : "none",
                  },
                }}
              >
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <Typography
                        {...props}
                        sx={{ m: 0, whiteSpace: "pre-line" }}
                        component="span"
                      />
                    ),
                    code: ({ inline, ...props }) =>
                      inline ? (
                        <Box
                          component="code"
                          sx={{
                            bgcolor: isUser
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0,0,0,0.05)",
                            px: 0.7,
                            py: 0.2,
                            borderRadius: 1,
                            fontFamily: "Source Code Pro, monospace",
                            fontSize: 13,
                            color: isUser ? "#fff" : "text.primary",
                            textShadow: isUser
                              ? "0 0 3px rgba(0, 0, 0, 0.6)"
                              : "none",
                          }}
                          {...props}
                        />
                      ) : (
                        <Box
                          component="pre"
                          sx={{
                            bgcolor: isUser ? "#1976d2" : "#eee",
                            p: 1.5,
                            borderRadius: 2,
                            overflowX: "auto",
                            fontFamily: "Source Code Pro, monospace",
                            fontSize: 13,
                            color: isUser ? "#e3f2fd" : "#333",
                            mt: 1,
                            mb: 1,
                            textShadow: isUser
                              ? "0 0 3px rgba(0, 0, 0, 0.6)"
                              : "none",
                          }}
                        >
                          <code {...props} />
                        </Box>
                      ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </Box>
            </ListItem>
          );
        })}

        {loading && (
          <ListItem sx={{ justifyContent: "flex-start", px: 0 }}>
            <CircularProgress
              size={28}
              sx={{ color: "primary.main", animationDuration: "1200ms" }}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
