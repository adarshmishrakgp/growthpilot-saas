import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { LeadScore } from './types';
// @ts-ignore
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

interface EngagementGraphProps {
  score?: LeadScore;
}

const EngagementGraph: React.FC<EngagementGraphProps> = ({ score }) => {
  const theme = useTheme();
  if (!score) return null;
  const data = {
    labels: ['-3', '-2', '-1', 'Now'],
    datasets: [
      {
        label: 'Score',
        data: score.trend,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.2)',
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#6366f1',
      },
      {
        label: 'Predictive',
        data: [null, null, null, score.predictive],
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251,191,36,0.2)',
        borderDash: [6, 6],
        pointRadius: 6,
        pointBackgroundColor: '#fbbf24',
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' as const },
    },
    scales: {
      y: { min: 0, max: 100, ticks: { color: theme.palette.text.primary } },
      x: { ticks: { color: theme.palette.text.primary } },
    },
  };
  return (
    <Box sx={{ minWidth: 320, maxWidth: 400, p: 2, bgcolor: theme.palette.background.paper, borderRadius: 4, boxShadow: '0 2px 12px #6366f122' }}>
      <Typography fontWeight={700} fontSize={17} mb={2}>Engagement Trend</Typography>
      <Line data={data} options={options} />
    </Box>
  );
};

export default EngagementGraph; 