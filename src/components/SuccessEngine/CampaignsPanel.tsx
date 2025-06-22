import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Stack, List, ListItem, ListItemText } from '@mui/material';
import { Campaign, Playbook } from './types';
import { PlayCircle, AutoAwesome } from '@mui/icons-material';

const STATUS_COLORS: Record<string, string> = {
  active: '#4ade80',
  paused: '#fde047',
  completed: '#a5b4fc',
};

interface CampaignsPanelProps {
  campaigns: Campaign[];
  playbooks: Playbook[];
}

const CampaignsPanel: React.FC<CampaignsPanelProps> = ({ campaigns, playbooks }) => {
  return (
    <Card sx={{ minWidth: 320, maxWidth: 400, borderRadius: 4, boxShadow: '0 4px 24px #6366f122', bgcolor: '#fff', p: 2 }}>
      <CardContent>
        <Typography fontWeight={700} fontSize={17} mb={2}>Automated Campaigns & Playbooks</Typography>
        <Typography fontWeight={600} fontSize={15} mb={1}>Campaigns</Typography>
        <List dense>
          {campaigns.map(c => (
            <ListItem key={c.id} sx={{ borderRadius: 2, mb: 1, bgcolor: '#f3f4f6' }}>
              <PlayCircle sx={{ color: STATUS_COLORS[c.status], mr: 1 }} />
              <ListItemText
                primary={<span style={{ fontWeight: 700 }}>{c.name}</span>}
                secondary={<span style={{ color: '#888', fontSize: 13 }}>Trigger: {c.trigger} | Actions: {c.actions.join(', ')}</span>}
              />
              <Chip size="small" label={c.status.toUpperCase()} sx={{ bgcolor: STATUS_COLORS[c.status], color: '#222', fontWeight: 700, ml: 1 }} />
            </ListItem>
          ))}
        </List>
        <Typography fontWeight={600} fontSize={15} mb={1} mt={2}>Playbooks</Typography>
        <List dense>
          {playbooks.map(pb => (
            <ListItem key={pb.id} sx={{ borderRadius: 2, mb: 1, bgcolor: '#f3f4f6' }}>
              <AutoAwesome sx={{ color: '#6366f1', mr: 1 }} />
              <ListItemText
                primary={<span style={{ fontWeight: 700 }}>{pb.name}</span>}
                secondary={<span style={{ color: '#888', fontSize: 13 }}>{pb.description} | Steps: {pb.steps.join(' → ')}</span>}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default CampaignsPanel; 