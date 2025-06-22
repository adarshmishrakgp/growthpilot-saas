import React from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, useTheme } from '@mui/material';
import { Activity } from './types';
import { Email, Chat, Call } from '@mui/icons-material';

const ICONS: Record<string, React.ReactNode> = {
  email: <Email fontSize="small" />,
  chat: <Chat fontSize="small" />,
  call: <Call fontSize="small" />,
};

const STATUS_COLORS: Record<string, string> = {
  opened: '#60a5fa',
  clicked: '#fbbf24',
  replied: '#4ade80',
  missed: '#f472b6',
  completed: '#6366f1',
};

interface CommunicationHistoryProps {
  activities: Activity[];
}

const CommunicationHistory: React.FC<CommunicationHistoryProps> = ({ activities }) => {
  const theme = useTheme();
  const comms = activities.filter(a => a.type === 'email' || a.type === 'chat' || a.type === 'call');
  return (
    <Box sx={{ minWidth: 320, maxWidth: 400, p: 2, bgcolor: theme.palette.background.paper, borderRadius: 4, boxShadow: '0 2px 12px #6366f122' }}>
      <Typography fontWeight={700} fontSize={17} mb={2}>Communication History</Typography>
      <List dense>
        {comms.map(a => (
          <ListItem key={a.id} sx={{ borderRadius: 2, mb: 1, bgcolor: '#f3f4f6' }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: STATUS_COLORS[a.status || 'completed'] || '#6366f1' }}>{ICONS[a.type]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<span style={{ fontWeight: 700 }}>{a.summary}</span>}
              secondary={<span style={{ color: '#888', fontSize: 13 }}>{new Date(a.timestamp).toLocaleString()}</span>}
            />
            {a.status && <Chip size="small" label={a.status} sx={{ bgcolor: STATUS_COLORS[a.status], color: '#222', fontWeight: 700 }} />}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CommunicationHistory; 