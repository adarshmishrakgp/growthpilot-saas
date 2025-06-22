import React from 'react';
import { Box, Typography, Chip, Button, Stack, useTheme, Avatar } from '@mui/material';
import { Lead } from './types';
import { AutoAwesome, ArrowUpward, ArrowDownward } from '@mui/icons-material';

const STATUS_COLORS: Record<string, string> = {
  hot: '#4ade80',
  warm: '#fde047',
  cold: '#a5b4fc',
  stale: '#d1d5db',
};

const SmartAssistantPane: React.FC<{ lead: Lead }> = ({ lead }) => {
  const theme = useTheme();
  // Mocked next actions
  const nextActions = [
    { label: 'Call this lead', icon: <ArrowUpward sx={{ color: '#4ade80' }} /> },
    { label: 'Send comparison doc', icon: <ArrowUpward sx={{ color: '#6366f1' }} /> },
    { label: 'Invite to webinar', icon: <ArrowUpward sx={{ color: '#fbbf24' }} /> },
  ];
  return (
    <Box sx={{ position: 'fixed', right: 24, bottom: 24, width: 300, bgcolor: theme.palette.background.paper, borderRadius: 4, boxShadow: '0 4px 24px #6366f122', p: 2, zIndex: 1000 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Avatar sx={{ bgcolor: STATUS_COLORS[lead.status], color: '#222' }}>{lead.name[0]}</Avatar>
        <Box>
          <Typography fontWeight={800} fontSize={17}>{lead.name}</Typography>
          <Chip label={lead.status.toUpperCase()} sx={{ bgcolor: STATUS_COLORS[lead.status], color: '#222', fontWeight: 700, ml: 1 }} />
        </Box>
      </Stack>
      <Typography fontWeight={700} fontSize={15} mb={1}>AI Next Actions</Typography>
      <Stack spacing={1} mb={2}>
        {nextActions.map((a, i) => (
          <Button key={i} variant="outlined" startIcon={a.icon} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>{a.label}</Button>
        ))}
      </Stack>
      <Typography fontWeight={700} fontSize={15} mb={1}>Manual Override</Typography>
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="contained" sx={{ bgcolor: '#4ade80', color: '#222', fontWeight: 700 }}>Tag Hot</Button>
        <Button size="small" variant="contained" sx={{ bgcolor: '#fde047', color: '#222', fontWeight: 700 }}>Tag Warm</Button>
        <Button size="small" variant="contained" sx={{ bgcolor: '#a5b4fc', color: '#222', fontWeight: 700 }}>Tag Cold</Button>
      </Stack>
    </Box>
  );
};

export default SmartAssistantPane;

export {}; 