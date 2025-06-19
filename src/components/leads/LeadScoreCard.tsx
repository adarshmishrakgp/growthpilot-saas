import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  LinearProgress, 
  Grid,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

interface ScoreMetric {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

interface LeadScoreCardProps {
  engagement: number;
  relevance: number;
  intent: number;
  totalScore: number;
}

const LeadScoreCard: React.FC<LeadScoreCardProps> = ({
  engagement,
  relevance,
  intent,
  totalScore
}) => {
  const metrics: ScoreMetric[] = [
    {
      label: 'Engagement Score',
      value: engagement,
      description: 'Based on website visits, content downloads, and social interactions',
      icon: <TrendingUpIcon sx={{ color: '#6366F1' }} />
    },
    {
      label: 'Relevance Score',
      value: relevance,
      description: 'Match with ideal customer profile and company characteristics',
      icon: <PersonIcon sx={{ color: '#6366F1' }} />
    },
    {
      label: 'Intent Score',
      value: intent,
      description: 'Likelihood of purchase based on behavior and signals',
      icon: <SignalCellularAltIcon sx={{ color: '#6366F1' }} />
    }
  ];

  return (
    <Paper sx={{ 
      p: 3,
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937' }}>
          Lead Score Analysis
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          background: 'rgba(99,102,241,0.1)',
          padding: '4px 12px',
          borderRadius: 2
        }}>
          <WorkIcon sx={{ color: '#6366F1' }} />
          <Typography sx={{ color: '#6366F1', fontWeight: 600 }}>
            {totalScore}/100
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} key={index}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {metric.icon}
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                    {metric.label}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#6366F1' }}>
                    {metric.value}%
                  </Typography>
                  <Tooltip title={metric.description}>
                    <IconButton size="small">
                      <InfoIcon fontSize="small" sx={{ color: '#9CA3AF' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={metric.value}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(99,102,241,0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(45deg, #6366F1 0%, #8B5CF6 100%)',
                  }
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ 
        mt: 3, 
        p: 2, 
        borderRadius: 2, 
        background: 'rgba(99,102,241,0.05)',
        border: '1px dashed rgba(99,102,241,0.2)'
      }}>
        <Typography variant="body2" sx={{ color: '#4B5563' }}>
          <strong>AI Insight:</strong> This lead shows high engagement with compliance-related content 
          and matches our ideal customer profile for fintech solutions. Recommended action: Schedule a 
          personalized demo.
        </Typography>
      </Box>
    </Paper>
  );
};

export default LeadScoreCard; 