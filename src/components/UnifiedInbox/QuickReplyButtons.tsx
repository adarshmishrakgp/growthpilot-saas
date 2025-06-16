import React, { useState } from 'react';
import { Box, Button, Chip, TextField, IconButton, Collapse } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const defaultQuickReplies = [
  { id: 1, text: "Thanks for reaching out! 👋", type: "greeting" },
  { id: 2, text: "I'll check and get back to you", type: "followup" },
  { id: 3, text: "Would you like to schedule a call?", type: "meeting" },
  { id: 4, text: "Here's our pricing details", type: "pricing" },
  { id: 5, text: "Let me transfer you to our support team", type: "support" }
];

interface QuickReplyButtonsProps {
  onSend?: (text: string) => void;
}

const QuickReplyButtons: React.FC<QuickReplyButtonsProps> = ({ onSend }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [quickReplies, setQuickReplies] = useState(defaultQuickReplies);

  const handleSend = () => {
    if (message.trim()) {
      onSend?.(message);
      setMessage('');
    }
  };

  const handleQuickReply = (text: string) => {
    setMessage(text);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mb: 2,
        cursor: 'pointer',
        color: '#6366F1',
        '&:hover': { opacity: 0.8 }
      }} onClick={() => setIsExpanded(!isExpanded)}>
        <KeyboardArrowDownIcon 
          sx={{ 
            transform: isExpanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease'
          }} 
        />
        Quick Replies
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1, 
          mb: 2,
          p: 2,
          background: 'rgba(99,102,241,0.05)',
          borderRadius: 2
        }}>
          {quickReplies.map((reply) => (
            <Chip
              key={reply.id}
              label={reply.text}
              onClick={() => handleQuickReply(reply.text)}
              sx={{
                background: 'white',
                border: '1px solid rgba(99,102,241,0.2)',
                '&:hover': {
                  background: 'rgba(99,102,241,0.1)',
                }
              }}
            />
          ))}
        </Box>
      </Collapse>

      <Box sx={{ 
        display: 'flex',
        gap: 1,
        background: 'white',
        p: 1,
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          variant="standard"
          sx={{
            '& .MuiInputBase-root': {
              padding: '8px 12px',
            }
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, pb: 1 }}>
          <IconButton size="small" sx={{ color: '#6B7280' }}>
            <EmojiEmotionsIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: '#6B7280' }}>
            <AttachFileIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleSend}
            sx={{ 
              color: 'white',
              background: '#6366F1',
              '&:hover': {
                background: '#4F46E5'
              }
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default QuickReplyButtons;
