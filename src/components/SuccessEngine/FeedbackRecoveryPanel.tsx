import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Stack, Stepper, Step, StepLabel, LinearProgress } from '@mui/material';
import { FeedbackSurvey } from './types';
import { EmojiEmotions, ThumbUp, RocketLaunch } from '@mui/icons-material';

const FUNNEL_STEPS = [
  { label: 'Trial', icon: <EmojiEmotions color="primary" /> },
  { label: 'Active', icon: <ThumbUp color="success" /> },
  { label: 'Advocate', icon: <RocketLaunch color="secondary" /> },
];

interface FeedbackRecoveryPanelProps {
  feedback: FeedbackSurvey[];
}

const FeedbackRecoveryPanel: React.FC<FeedbackRecoveryPanelProps> = ({ feedback }) => {
  // Simulate funnel progress based on feedback completion
  let funnelStep = 0;
  if (feedback.some(f => f.completedAt)) funnelStep = 1;
  if (feedback.some(f => (f.score || 0) >= 8)) funnelStep = 2;

  return (
    <Card sx={{ minWidth: 320, maxWidth: 400, borderRadius: 4, boxShadow: '0 4px 24px #6366f122', bgcolor: '#fff', p: 2 }}>
      <CardContent>
        <Typography fontWeight={700} fontSize={17} mb={2}>Feedback & Recovery</Typography>
        <Stepper activeStep={funnelStep} alternativeLabel sx={{ mb: 2 }}>
          {FUNNEL_STEPS.map((step, idx) => (
            <Step key={step.label} completed={funnelStep > idx}>
              <StepLabel icon={step.icon}>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography fontWeight={600} fontSize={15} mb={1}>Surveys</Typography>
        <Stack spacing={1}>
          {feedback.length === 0 && <Typography color="text.secondary">No feedback surveys sent yet.</Typography>}
          {feedback.map(f => (
            <Box key={f.id} sx={{ p: 1, borderRadius: 2, bgcolor: '#f3f4f6', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip label={f.score !== undefined ? `Score: ${f.score}` : 'Pending'} color={f.score !== undefined ? (f.score >= 8 ? 'success' : 'warning') : 'default'} />
              <Typography fontSize={13} color="#888">Sent: {new Date(f.sentAt).toLocaleDateString()}</Typography>
              {f.completedAt && <Typography fontSize={13} color="#6366f1">Completed: {new Date(f.completedAt).toLocaleDateString()}</Typography>}
              {f.comments && <Typography fontSize={13} color="#222">“{f.comments}”</Typography>}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FeedbackRecoveryPanel; 