import React from 'react';
import { Box, Typography, Chip, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, useTheme } from '@mui/material';
import { User, Segment } from './types';

const STATUS_COLORS: Record<string, string> = {
  active: '#4ade80',
  at_risk: '#fde047',
  likely_churn: '#f472b6',
  inactive: '#d1d5db',
};

interface SidebarProps {
  users: User[];
  segments: Segment[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  selectedSegment: string;
  setSelectedSegment: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ users, segments, selectedUserId, setSelectedUserId, selectedSegment, setSelectedSegment }) => {
  const theme = useTheme();
  return (
    <Box sx={{ width: 260, minWidth: 200, bgcolor: theme.palette.background.paper, p: 2, borderRight: `1.5px solid ${theme.palette.divider}`, height: '100%', display: 'flex', flexDirection: 'column', gap: 2, boxShadow: '0 4px 24px #6366f122' }}>
      <Typography fontWeight={700} fontSize={18} mb={1}>Segments</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Chip label="All" color={selectedSegment === 'all' ? 'primary' : 'default'} onClick={() => setSelectedSegment('all')} />
        {segments.map(s => (
          <Chip
            key={s.id}
            label={<span>{s.icon} {s.name}</span>}
            sx={{ bgcolor: s.color, color: '#222', fontWeight: 700 }}
            variant={selectedSegment === s.id ? 'filled' : 'outlined'}
            onClick={() => setSelectedSegment(s.id)}
          />
        ))}
      </Box>
      <Divider sx={{ my: 1 }} />
      <Typography fontWeight={700} fontSize={18} mb={1}>Users</Typography>
      <List dense sx={{ flex: 1, overflowY: 'auto' }}>
        {users.map(user => (
          <ListItem
            key={user.id}
            button
            selected={user.id === selectedUserId}
            onClick={() => setSelectedUserId(user.id)}
            sx={{ borderRadius: 2, mb: 0.5, bgcolor: user.id === selectedUserId ? '#6366f122' : undefined }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: STATUS_COLORS[user.status], color: '#222' }}>{user.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<span style={{ fontWeight: 700 }}>{user.name}</span>}
              secondary={<span style={{ color: '#888', fontSize: 13 }}>{user.plan}</span>}
            />
            <Chip size="small" label={user.churnRisk + '%'} sx={{ bgcolor: STATUS_COLORS[user.status], color: '#222', fontWeight: 700 }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar; 