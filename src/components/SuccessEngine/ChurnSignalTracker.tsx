import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Stack, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { ChurnSignal } from './types';
import { Warning, ReportProblem, TrendingDown, Payment } from '@mui/icons-material';

const SIGNAL_ICONS: Record<string, React.ReactNode> = {
  inactivity: <Warning sx={{ color: '#fde047' }} />,
  complaint: <ReportProblem sx={{ color: '#f472b6' }} />,
  downgrade: <TrendingDown sx={{ color: '#60a5fa' }} />,
  payment_issue: <Payment sx={{ color: '#fbbf24' }} />,
};

const SEVERITY_COLORS: Record<string, string> = {
  low: '#60a5fa',
  medium: '#fbbf24',
  high: '#f472b6',
};

interface ChurnSignalTrackerProps {
  signals: ChurnSignal[];
}

const ChurnSignalTracker: React.FC<ChurnSignalTrackerProps> = ({ signals }) => {
  return (
    <Card sx={{ minWidth: 220, maxWidth: 340, borderRadius: 4, boxShadow: '0 4px 24px #6366f122', bgcolor: '#fff', p: 2 }}>
      <CardContent>
        <Typography fontWeight={700} fontSize={17} mb={2}>Churn Signals</Typography>
        <List dense>
          {signals.length === 0 && (
            <Typography color="text.secondary">No churn signals detected 🎉</Typography>
          )}
          {signals.map(signal => (
            <ListItem key={signal.id} sx={{ borderRadius: 2, mb: 1, bgcolor: '#f3f4f6' }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: SEVERITY_COLORS[signal.severity], color: '#222' }}>{SIGNAL_ICONS[signal.type]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<span style={{ fontWeight: 700 }}>{signal.type.replace('_', ' ').toUpperCase()}</span>}
                secondary={<span style={{ color: '#888', fontSize: 13 }}>{signal.description}</span>}
              />
              <Chip size="small" label={signal.severity.toUpperCase()} sx={{ bgcolor: SEVERITY_COLORS[signal.severity], color: '#222', fontWeight: 700, ml: 1 }} />
              <Typography fontSize={12} color="#888" sx={{ ml: 1 }}>{new Date(signal.detectedAt).toLocaleDateString()}</Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ChurnSignalTracker;