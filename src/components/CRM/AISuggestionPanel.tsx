import React from 'react';
import { Box, Typography, Card, CardContent, Chip, Stack, useTheme } from '@mui/material';
import { AISuggestion } from './types';
import { Call, Email, AutoAwesome, Group, Event, MoveDown } from '@mui/icons-material';
import { ReactElement } from 'react';

const ACTION_ICONS: Record<string, ReactElement> = {
  call: <Call fontSize="small" />,
  email: <Email fontSize="small" />,
  nurture: <Group fontSize="small" />,
  webinar: <Event fontSize="small" />,
  move: <MoveDown fontSize="small" />,
  custom: <AutoAwesome fontSize="small" />,
};

interface AISuggestionPanelProps {
  suggestions: AISuggestion[];
}

const AISuggestionPanel: React.FC<AISuggestionPanelProps> = ({ suggestions }) => {
  const theme = useTheme();
  if (!suggestions.length) return null;
  return (
    <Card sx={{ minWidth: 220, maxWidth: 320, borderRadius: 4, boxShadow: '0 4px 24px #6366f122', bgcolor: '#fff', p: 2 }}>
      <CardContent>
        <Typography fontWeight={700} fontSize={17} mb={2}>AI Suggestions</Typography>
        <Stack spacing={2}>
          {suggestions.map(s => (
            <Box key={s.id} sx={{ p: 1, borderRadius: 2, bgcolor: '#f3f4f6', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip icon={ACTION_ICONS[s.actionType] || <AutoAwesome fontSize="small" />} label={s.actionType.toUpperCase()} size="small" sx={{ fontWeight: 700 }} />
              <Box>
                <Typography fontWeight={700} fontSize={15}>{s.suggestion}</Typography>
                <Typography fontSize={13} color="#888">{s.reason}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AISuggestionPanel; 