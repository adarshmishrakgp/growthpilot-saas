import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Chip, Stack, LinearProgress, Tooltip } from '@mui/material';
import { User } from './types';

const STATUS_COLORS: Record<string, string> = {
  active: '#4ade80',
  at_risk: '#fde047',
  likely_churn: '#f472b6',
  inactive: '#d1d5db',
};

interface UserProfilePanelProps {
  user: User;
}

const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ user }) => {
  return (
    <Card sx={{ minWidth: 280, maxWidth: 340, borderRadius: 4, boxShadow: '0 4px 24px #6366f122', bgcolor: '#fff', p: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar sx={{ bgcolor: STATUS_COLORS[user.status], width: 56, height: 56, fontSize: 28 }}>{user.name[0]}</Avatar>
          <Box>
            <Typography fontWeight={800} fontSize={20}>{user.name}</Typography>
            <Typography color="text.secondary" fontSize={15}>{user.email}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} mb={1}>
          <Chip label={user.plan} sx={{ bgcolor: '#6366f1', color: '#fff', fontWeight: 700 }} />
          {user.tags.map(tag => (
            <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#fbbf24', color: '#222', fontWeight: 700 }} />
          ))}
        </Stack>
        <Typography fontSize={15} mb={0.5}><b>Last Login:</b> {new Date(user.lastLogin).toLocaleDateString()}</Typography>
        <Typography fontSize={15} mb={0.5}><b>Lifetime Value:</b> ${user.lifetimeValue}</Typography>
        <Typography fontSize={15} mb={1}><b>Churn Risk:</b> <Chip label={user.churnRisk + '%'} sx={{ bgcolor: STATUS_COLORS[user.status], color: '#222', fontWeight: 700 }} /></Typography>
        <Box mb={1}>
          <Typography fontSize={15} mb={0.5}><b>Feature Adoption</b></Typography>
          <Tooltip title={user.featureAdoption + '%'}>
            <LinearProgress variant="determinate" value={user.featureAdoption} sx={{ height: 10, borderRadius: 4, bgcolor: '#e0e7ff', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }} />
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfilePanel; 