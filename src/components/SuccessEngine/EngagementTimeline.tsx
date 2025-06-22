import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Tooltip, useTheme } from '@mui/material';
import { UserAction } from './types';
import { Login, TrendingUp, SupportAgent, Payment, Extension } from '@mui/icons-material';

const ACTION_ICONS: Record<string, React.ReactNode> = {
  login: <Login fontSize="small" />,
  plan_change: <TrendingUp fontSize="small" />,
  support: <SupportAgent fontSize="small" />,
  payment: <Payment fontSize="small" />,
  feature_use: <Extension fontSize="small" />,
};

interface EngagementTimelineProps {
  actions: UserAction[];
}

const EngagementTimeline: React.FC<EngagementTimelineProps> = ({ actions }) => {
  const theme = useTheme();
  return (
    <Card sx={{ minWidth: 320, flex: 1, borderRadius: 4, boxShadow: '0 2px 12px #6366f122', bgcolor: '#fff', p: 2 }}>
      <CardContent>
        <Typography fontWeight={700} fontSize={17} mb={2}>Engagement Timeline</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, overflowX: 'auto', py: 1 }}>
          {actions.map((a, idx) => (
            <Tooltip key={a.id} title={a.summary} placement="top">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
                <Avatar sx={{ bgcolor: '#6366f1', mb: 0.5 }}>{ACTION_ICONS[a.type]}</Avatar>
                <Typography fontSize={13} fontWeight={600} color="text.secondary" sx={{ textAlign: 'center' }}>{a.type.replace('_', ' ')}</Typography>
                <Typography fontSize={11} color="#888" sx={{ mt: 0.5 }}>{new Date(a.timestamp).toLocaleDateString()}</Typography>
                {idx < actions.length - 1 && (
                  <Box sx={{ width: 2, height: 32, bgcolor: '#e0e7ff', mx: 'auto', my: 0.5, borderRadius: 1 }} />
                )}
              </Box>
            </Tooltip>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EngagementTimeline; 