import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  from: 'user' | 'ai' | 'agent';
  text: string;
  time: string;
}

const MessageBubble: React.FC<Props> = ({ from, text, time }) => (
  <Box sx={{
    mb: 1,
    textAlign: from === 'user' ? 'left' : 'right'
  }}>
    <Typography
      sx={{
        display: 'inline-block',
        px: 2, py: 1,
        borderRadius: 2,
        background: from === 'user' ? '#f3f4f6' : 'linear-gradient(90deg,#6366f1,#fbbf24)',
        color: from === 'user' ? '#222' : '#fff',
        fontWeight: 500
      }}
    >
      {text}
    </Typography>
    <Typography variant="caption" sx={{ ml: 1 }}>{time}</Typography>
  </Box>
);

export default MessageBubble;
