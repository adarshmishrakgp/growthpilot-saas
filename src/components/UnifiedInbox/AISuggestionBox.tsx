import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress, Chip, IconButton, Tooltip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import RefreshIcon from '@mui/icons-material/Refresh';

interface AISuggestionBoxProps {
  from: string;
  text: string;
  time: string;
  confidence?: number;
  alternatives?: string[];
}

const AISuggestionBox: React.FC<AISuggestionBoxProps> = ({ 
  from, 
  text, 
  time, 
  confidence = 0.95,
  alternatives = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(text);

  const handleRegenerateResponse = () => {
    setIsGenerating(true);
    // Simulate API call to GPT-4
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        p: 2,
        borderRadius: 2,
        background: from === 'ai' ? 'rgba(99,102,241,0.05)' : 'white',
        border: '1px solid',
        borderColor: from === 'ai' ? 'rgba(99,102,241,0.1)' : 'rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: from === 'ai' ? 'translateY(-2px)' : 'none',
          boxShadow: from === 'ai' ? '0 4px 12px rgba(99,102,241,0.1)' : 'none'
        }
      }}
    >
      {from === 'ai' && (
        <Box sx={{ position: 'absolute', top: -10, right: 16, display: 'flex', gap: 1 }}>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
            label={`${Math.round(confidence * 100)}% Confidence`}
            size="small"
            sx={{
              background: 'rgba(99,102,241,0.1)',
              color: '#6366F1',
              '& .MuiChip-icon': { color: '#6366F1' }
            }}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: from === 'ai' ? '#6366F1' : '#1F2937',
            fontWeight: 600 
          }}
        >
          {from === 'ai' ? 'AI Assistant' : 'User'}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            ml: 1,
            color: '#6B7280'
          }}
        >
          {time}
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ color: '#1F2937', whiteSpace: 'pre-wrap' }}>
        {selectedResponse}
      </Typography>

      {from === 'ai' && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Tooltip title="Edit Response">
            <IconButton 
              size="small" 
              onClick={() => setIsEditing(!isEditing)}
              sx={{ color: '#6366F1' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Regenerate Response">
            <IconButton 
              size="small" 
              onClick={handleRegenerateResponse}
              sx={{ color: '#6366F1' }}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <CircularProgress size={20} thickness={4} />
              ) : (
                <RefreshIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Approve & Send">
            <IconButton 
              size="small"
              sx={{ color: '#10B981' }}
            >
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject Response">
            <IconButton 
              size="small"
              sx={{ color: '#EF4444' }}
            >
              <BlockIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {from === 'ai' && alternatives.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', mb: 1 }}>
            Alternative Responses:
          </Typography>
          {alternatives.map((alt, idx) => (
            <Button
              key={idx}
              variant="text"
              size="small"
              onClick={() => setSelectedResponse(alt)}
              sx={{
                mr: 1,
                mb: 1,
                color: '#6366F1',
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(99,102,241,0.05)'
                }
              }}
            >
              Option {idx + 1}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AISuggestionBox;
