import React, { useState } from 'react';
import { Box, Typography, Chip, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, useTheme } from '@mui/material';
import { Lead, PipelineStage, LeadStatus } from './types';

const STATUS_COLORS: Record<LeadStatus, string> = {
  hot: '#4ade80',
  warm: '#fde047',
  cold: '#a5b4fc',
  stale: '#d1d5db',
};

interface SidebarProps {
  leads: Lead[];
  pipeline: PipelineStage[];
  selectedLeadId: string;
  setSelectedLeadId: (id: string) => void;
}

const SEGMENTS: { label: string; value: LeadStatus }[] = [
  { label: 'Hot', value: 'hot' },
  { label: 'Warm', value: 'warm' },
  { label: 'Cold', value: 'cold' },
  { label: 'Stale', value: 'stale' },
];

const Sidebar: React.FC<SidebarProps> = ({ leads, pipeline, selectedLeadId, setSelectedLeadId }) => {
  const theme = useTheme();
  const [segment, setSegment] = useState<LeadStatus | 'all'>('all');
  const filteredLeads = segment === 'all' ? leads : leads.filter(l => l.status === segment);

  return (
    <Box sx={{ width: 260, minWidth: 200, bgcolor: theme.palette.background.paper, p: 2, borderRight: `1.5px solid ${theme.palette.divider}`, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography fontWeight={700} fontSize={18} mb={1}>Segments</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Chip label="All" color={segment === 'all' ? 'primary' : 'default'} onClick={() => setSegment('all')} />
        {SEGMENTS.map(s => (
          <Chip
            key={s.value}
            label={s.label}
            sx={{ bgcolor: STATUS_COLORS[s.value], color: '#222', fontWeight: 700 }}
            variant={segment === s.value ? 'filled' : 'outlined'}
            onClick={() => setSegment(s.value)}
          />
        ))}
      </Box>
      <Typography fontWeight={700} fontSize={18} mb={1}>Pipeline</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        {pipeline.map(stage => (
          <Chip key={stage.id} label={stage.name} sx={{ bgcolor: stage.color, color: '#222', fontWeight: 700 }} />
        ))}
      </Box>
      <Divider sx={{ my: 1 }} />
      <Typography fontWeight={700} fontSize={18} mb={1}>Leads</Typography>
      <List dense sx={{ flex: 1, overflowY: 'auto' }}>
        {filteredLeads.map(lead => (
          <ListItem
            key={lead.id}
            button
            selected={lead.id === selectedLeadId}
            onClick={() => setSelectedLeadId(lead.id)}
            sx={{ borderRadius: 2, mb: 0.5, bgcolor: lead.id === selectedLeadId ? '#6366f122' : undefined }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: STATUS_COLORS[lead.status], color: '#222' }}>{lead.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<span style={{ fontWeight: 700 }}>{lead.name}</span>}
              secondary={<span style={{ color: '#888', fontSize: 13 }}>{lead.company}</span>}
            />
            <Chip size="small" label={lead.status.toUpperCase()} sx={{ bgcolor: STATUS_COLORS[lead.status], color: '#222', fontWeight: 700 }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar; 