import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, Tabs, Tab, useTheme } from '@mui/material';
import { Activity, Lead } from './types';
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

const FILTERS = [
  { label: 'Most Engaged', value: 'engaged' },
  { label: 'Recent Activity', value: 'recent' },
  { label: 'Needs Follow-up', value: 'followup' },
];

interface ActivityFeedProps {
  activities: Activity[];
  leads: Lead[];
  setSelectedLeadId: (id: string) => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, leads, setSelectedLeadId }) => {
  const theme = useTheme();
  const [filter, setFilter] = useState('engaged');
  let filtered = activities;
  if (filter === 'engaged') {
    filtered = activities.filter(a => a.status === 'clicked' || a.status === 'replied');
  } else if (filter === 'recent') {
    filtered = [...activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
  } else if (filter === 'followup') {
    filtered = activities.filter(a => a.status === 'missed');
  }
  return (
    <Box sx={{ minWidth: 320, maxWidth: 400, p: 2, bgcolor: theme.palette.background.paper, borderRadius: 4, boxShadow: '0 2px 12px #6366f122' }}>
      <Typography fontWeight={700} fontSize={17} mb={2}>Activity Feed</Typography>
      <Tabs value={filter} onChange={(_, v) => setFilter(v)} variant="fullWidth" sx={{ mb: 1 }}>
        {FILTERS.map(f => <Tab key={f.value} value={f.value} label={f.label} />)}
      </Tabs>
      <List dense>
        {filtered.map(a => {
          const lead = leads.find(l => l.id === a.leadId);
          return (
            <ListItem key={a.id} button onClick={() => setSelectedLeadId(a.leadId)} sx={{ borderRadius: 2, mb: 1, bgcolor: '#f3f4f6' }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: STATUS_COLORS[a.status || 'completed'] || '#6366f1' }}>{ICONS[a.type]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<span style={{ fontWeight: 700 }}>{lead ? lead.name : 'Unknown'}: {a.summary}</span>}
                secondary={<span style={{ color: '#888', fontSize: 13 }}>{new Date(a.timestamp).toLocaleString()}</span>}
              />
              {a.status && <Chip size="small" label={a.status} sx={{ bgcolor: STATUS_COLORS[a.status], color: '#222', fontWeight: 700 }} />}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ActivityFeed; 