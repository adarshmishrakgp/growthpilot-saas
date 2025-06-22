import React from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { LeadScore } from './types';

const STATUS_COLORS: Record<string, string> = {
  hot: '#4ade80',
  warm: '#fde047',
  cold: '#60a5fa',
  stale: '#d1d5db',
};

function getStatus(score: number) {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  if (score >= 40) return 'cold';
  return 'stale';
}

interface LeadScoringDashboardProps {
  score?: LeadScore;
}

const LeadScoringDashboard: React.FC<LeadScoringDashboardProps> = ({ score }) => {
  const theme = useTheme();
  if (!score) return null;
  const status = getStatus(score.score);
  const color = STATUS_COLORS[status];
  const trend = score.trend;
  const predictive = score.predictive || score.score;
  const trendUp = predictive > score.score;
  return (
    <Box sx={{ minWidth: 180, maxWidth: 220, p: 2, bgcolor: theme.palette.background.paper, borderRadius: 4, boxShadow: '0 2px 12px #6366f122', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography fontWeight={700} fontSize={17} mb={2}>Lead Score</Typography>
      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
        <CircularProgress variant="determinate" value={score.score} size={90} thickness={6} sx={{ color }} />
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography fontWeight={800} fontSize={28} color={color}>{score.score}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography fontWeight={600} color={color}>Predictive: {predictive}</Typography>
        {trendUp ? <ArrowUpward sx={{ color: '#4ade80' }} /> : <ArrowDownward sx={{ color: '#f472b6' }} />}
      </Box>
    </Box>
  );
};

export default LeadScoringDashboard; 