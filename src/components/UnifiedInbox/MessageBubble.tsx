import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface MessageProps {
  message: {
    from: 'user' | 'ai';
    text: string;
    time: string;
    attachments?: Array<{
      type: string;
      url: string;
      label: string;
    }>;
  };
  isAI: boolean;
}

const MessageBubble: React.FC<MessageProps> = ({ message, isAI }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isAI ? 'flex-start' : 'flex-end',
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: '80%',
          p: 2,
          bgcolor: isAI ? 'primary.light' : 'secondary.light',
          borderRadius: 2,
          color: isAI ? 'primary.contrastText' : 'secondary.contrastText',
        }}
      >
        <Typography variant="body1">{message.text}</Typography>
        {message.attachments && message.attachments.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {message.attachments.map((attachment, index) => (
              <Button
                key={index}
                href={attachment.url}
                target="_blank"
                variant="contained"
                size="small"
                sx={{ mr: 1, mt: 1 }}
              >
                {attachment.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 0.5, px: 1 }}
      >
        {message.time}
      </Typography>
    </Box>
  );
};

export default MessageBubble;
