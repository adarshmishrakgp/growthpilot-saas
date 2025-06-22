import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Chip, Stack, IconButton, Tooltip } from '@mui/material';
import { Lead, User } from './types';
import { Call, Email, Tag, Person } from '@mui/icons-material';

const STATUS_COLORS: Record<string, string> = {
  hot: '#4ade80',
  warm: '#fde047',
  cold: '#a5b4fc',
  stale: '#d1d5db',
};

interface LeadProfileProps {
  lead: Lead;
  users: User[];
}

const LeadProfile: React.FC<LeadProfileProps> = ({ lead, users }) => {
  const owner = users.find(u => u.id === lead.owner);
  return (
    <Card sx={{ minWidth: 280, maxWidth: 340, borderRadius: 4, boxShadow: '0 4px 24px #6366f122', bgcolor: '#fff', p: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar sx={{ bgcolor: STATUS_COLORS[lead.status], width: 56, height: 56, fontSize: 28 }}>{lead.name[0]}</Avatar>
          <Box>
            <Typography fontWeight={800} fontSize={20}>{lead.name}</Typography>
            <Typography color="text.secondary" fontSize={15}>{lead.company}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} mb={1}>
          <Chip label={lead.status.toUpperCase()} sx={{ bgcolor: STATUS_COLORS[lead.status], color: '#222', fontWeight: 700 }} />
          {lead.tags.map(tag => (
            <Chip key={tag} label={tag} size="small" icon={<Tag fontSize="small" />} />
          ))}
        </Stack>
        <Typography fontSize={15} mb={0.5}><Email fontSize="small" sx={{ mr: 0.5 }} /> {lead.email}</Typography>
        <Typography fontSize={15} mb={0.5}><Call fontSize="small" sx={{ mr: 0.5 }} /> {lead.phone}</Typography>
        <Typography fontSize={15} mb={1}><Person fontSize="small" sx={{ mr: 0.5 }} /> Owner: {owner ? owner.name : 'Unassigned'}</Typography>
        <Stack direction="row" spacing={1} mt={1}>
          <Tooltip title="Call Lead"><IconButton color="primary"><Call /></IconButton></Tooltip>
          <Tooltip title="Email Lead"><IconButton color="primary"><Email /></IconButton></Tooltip>
          <Tooltip title="Tag Lead"><IconButton color="primary"><Tag /></IconButton></Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default LeadProfile; 