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
  conversionProbability?: number; // 0-1
  conversionTips?: string[];
  avoidTips?: string[];
  churnTips?: string[];
  alternatives?: string[];
  onSend: (suggestion: string) => void;
}

const AISuggestionBox: React.FC<AISuggestionBoxProps> = ({ 
  from, 
  text, 
  time, 
  confidence = 0.95,
  conversionProbability = 0.78,
  conversionTips = [
    'Personalize your response with the user\'s name.',
    'Offer a limited-time incentive.',
    'Ask a direct question to prompt a reply.'
  ],
  avoidTips = [
    'Don\'t ignore the user\'s main question.',
    'Avoid sounding too pushy or salesy.',
    'Don\'t use jargon or technical terms.'
  ],
  churnTips = [
    'Follow up if the user doesn\'t reply in 2 days.',
    'Offer support proactively if user seems confused.',
    'Thank the user for their interest.'
  ],
  alternatives = [],
  onSend
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(text);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState('friendly');

  const handleRegenerateResponse = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const handleToneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTone(event.target.value);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSelectedResponse(e.target.value);
  };

  const handleSend = () => {
    onSend(selectedResponse);
    setIsEditing(false);
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
          sx={{ ml: 1, color: '#6B7280' }}
        >
          {time}
        </Typography>
      </Box>

      {/* Conversion Probability */}
      {from === 'ai' && (
        <Box sx={{ mb: 1 }}>
          <Chip
            label={`AI estimates ${Math.round(conversionProbability * 100)}% chance of conversion`}
            size="small"
            sx={{ background: '#e0e7ff', color: '#234567', fontWeight: 700 }}
          />
        </Box>
      )}

      {/* Editable AI Message */}
      {isEditing ? (
        <textarea
          value={selectedResponse}
          onChange={handleEditChange}
          style={{ width: '100%', minHeight: 60, fontSize: 16, padding: 8, borderRadius: 6, border: '1px solid #e0e7ff', marginBottom: 8 }}
        />
      ) : (
        <Typography variant="body1" sx={{ color: '#1F2937', whiteSpace: 'pre-wrap' }}>
          {selectedResponse}
        </Typography>
      )}

      {/* Tone Selector */}
      <Box sx={{ mt: 2, mb: 1 }}>
        <label htmlFor="tone" style={{ fontWeight: 600, color: '#6366F1', marginRight: 8 }}>Select Tone:</label>
        <select id="tone" value={selectedTone} onChange={handleToneChange} style={{ fontWeight: 600, borderRadius: 4, padding: '2px 8px' }}>
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
          <option value="concise">Concise</option>
        </select>
      </Box>

      {/* Approve/Send, Edit, Regenerate, Reject Buttons */}
      {from === 'ai' && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Tooltip title={isEditing ? 'Save' : 'Edit Response'}>
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
              onClick={handleSend}
            >
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject Response">
            <IconButton 
              size="small"
              sx={{ color: '#EF4444' }}
              onClick={() => setIsEditing(false)}
            >
              <BlockIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Conversion Tips */}
      {from === 'ai' && conversionTips.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#6366F1', fontWeight: 700, mb: 0.5 }}>AI Tips to Increase Conversion:</Typography>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {conversionTips.map((tip, idx) => (
              <li key={idx} style={{ color: '#234567', fontSize: 15 }}>{tip}</li>
            ))}
          </ul>
        </Box>
      )}

      {/* Avoid Tips */}
      {from === 'ai' && avoidTips.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#EF4444', fontWeight: 700, mb: 0.5 }}>What to Avoid:</Typography>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {avoidTips.map((tip, idx) => (
              <li key={idx} style={{ color: '#EF4444', fontSize: 15 }}>{tip}</li>
            ))}
          </ul>
        </Box>
      )}

      {/* Churn Tips */}
      {from === 'ai' && churnTips.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#00B8A9', fontWeight: 700, mb: 0.5 }}>Churn Avoidance Tips:</Typography>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {churnTips.map((tip, idx) => (
              <li key={idx} style={{ color: '#00B8A9', fontSize: 15 }}>{tip}</li>
            ))}
          </ul>
        </Box>
      )}

      {/* Alternatives */}
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
