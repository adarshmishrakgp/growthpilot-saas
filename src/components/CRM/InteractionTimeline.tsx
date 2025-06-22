import React from 'react';
import { Box, Typography, Tooltip, Avatar, useTheme } from '@mui/material';
import { Activity } from './types';
import { Email, Chat, Call, Language, AutoAwesome } from '@mui/icons-material';

const ICONS: Record<string, React.ReactNode> = {
  email: <Email fontSize="small" />,
  chat: <Chat fontSize="small" />,
  call: <Call fontSize="small" />,
  pageview: <Language fontSize="small" />,
  product: <Language fontSize="small" />,
  ai: <AutoAwesome fontSize="small" />,
};

const STATUS_COLORS: Record<string, string> = {
  opened: '#60a5fa',
  clicked: '#fbbf24',
  replied: '#4ade80',
  missed: '#f472b6',
  completed: '#6366f1',
};

interface InteractionTimelineProps {
  activities: Activity[];
}

const InteractionTimeline: React.FC<InteractionTimelineProps> = ({ activities }) => {
  const theme = useTheme();
  return (
    <Box sx={{ minWidth: 320, flex: 1, p: 2, bgcolor: theme.palette.background.paper, borderRadius: 4, boxShadow: '0 2px 12px #6366f122', overflowX: 'auto' }}>
      <Typography fontWeight={700} fontSize={17} mb={2}>Behavior Timeline</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, overflowX: 'auto', py: 1 }}>
        {activities.map((a, idx) => (
          <Tooltip key={a.id} title={a.summary + (a.status ? ` (${a.status})` : '')} placement="top">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
              <Avatar sx={{ bgcolor: STATUS_COLORS[a.status || 'completed'] || '#6366f1', mb: 0.5 }}>
                {ICONS[a.type] || <AutoAwesome fontSize="small" />}
              </Avatar>
              <Typography fontSize={13} fontWeight={600} color="text.secondary" sx={{ textAlign: 'center' }}>{a.summary.split(':')[0]}</Typography>
              <Typography fontSize={11} color="#888" sx={{ mt: 0.5 }}>{new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
              {idx < activities.length - 1 && (
                <Box sx={{ width: 2, height: 32, bgcolor: '#e0e7ff', mx: 'auto', my: 0.5, borderRadius: 1 }} />
              )}
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default InteractionTimeline; 