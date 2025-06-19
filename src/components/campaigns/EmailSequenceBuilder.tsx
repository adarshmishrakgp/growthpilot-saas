import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Collapse
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TimerIcon from '@mui/icons-material/Timer';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';

export interface EmailStep {
  id: string;
  subject: string;
  content: string;
  delay: number;
  delayUnit: 'minutes' | 'hours' | 'days';
  condition?: string;
}

export interface EmailSequenceBuilderProps {
  onSave?: (steps: EmailStep[]) => void;
  onPreview?: (steps: EmailStep[]) => void;
  initialSteps?: EmailStep[];
}

const EmailSequenceBuilder: React.FC<EmailSequenceBuilderProps> = ({
  onSave,
  onPreview,
  initialSteps
}) => {
  const [steps, setSteps] = useState<EmailStep[]>(initialSteps || [
    {
      id: '1',
      subject: 'How our AI automates compliance for fintechs',
      content: `Hi {{first_name}},

I noticed you recently mentioned compliance challenges on LinkedIn. Many fintech CTOs we work with face similar hurdles.

Would you be interested in seeing how our AI platform helps companies like {{company_name}} automate compliance processes?

Quick highlights:
• 75% reduction in manual compliance tasks
• Real-time regulatory monitoring
• Automated report generation

Let me know if you'd like to see a quick demo.

Best,
{{sender_name}}`,
      delay: 0,
      delayUnit: 'minutes'
    }
  ]);

  const [selectedStep, setSelectedStep] = useState<string>(steps[0].id);

  const handleAddStep = () => {
    const newStep: EmailStep = {
      id: (steps.length + 1).toString(),
      subject: '',
      content: '',
      delay: 1,
      delayUnit: 'days'
    };
    setSteps([...steps, newStep]);
    setSelectedStep(newStep.id);
  };

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
    if (selectedStep === id) {
      setSelectedStep(steps[0].id);
    }
  };

  const handleUpdateStep = (id: string, field: keyof EmailStep, value: any) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const generateAISubject = () => {
    // Simulate AI generation
    setTimeout(() => {
      handleUpdateStep(selectedStep, 'subject', 'Save 75% on compliance costs with AI automation');
    }, 1000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1F2937' }}>
          Email Sequence Builder
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={() => onPreview?.(steps)}
            sx={{
              borderColor: '#6366F1',
              color: '#6366F1',
              '&:hover': {
                borderColor: '#4F46E5',
                background: 'rgba(99,102,241,0.05)'
              }
            }}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => onSave?.(steps)}
            sx={{
              background: 'linear-gradient(45deg, #6366F1 0%, #8B5CF6 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5558E8 0%, #7C4DEF 100%)',
              }
            }}
          >
            Save Sequence
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Steps Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{
            p: 2,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2
          }}>
            <Typography variant="subtitle2" sx={{ color: '#4B5563', mb: 2 }}>
              Sequence Steps
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {steps.map((step, index) => (
                <Box
                  key={step.id}
                  onClick={() => setSelectedStep(step.id)}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    cursor: 'pointer',
                    background: selectedStep === step.id ? 'rgba(99,102,241,0.1)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      background: selectedStep === step.id ? 'rgba(99,102,241,0.1)' : 'rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <DragIndicatorIcon sx={{ color: '#9CA3AF' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ 
                      color: selectedStep === step.id ? '#6366F1' : '#1F2937',
                      fontWeight: selectedStep === step.id ? 600 : 400
                    }}>
                      Email {index + 1}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TimerIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        {step.delay} {step.delayUnit}
                      </Typography>
                    </Box>
                  </Box>
                  {steps.length > 1 && (
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStep(step.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" sx={{ color: '#EF4444' }} />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddStep}
              sx={{
                mt: 2,
                borderColor: '#6366F1',
                color: '#6366F1',
                '&:hover': {
                  borderColor: '#4F46E5',
                  background: 'rgba(99,102,241,0.05)'
                }
              }}
            >
              Add Step
            </Button>
          </Paper>
        </Grid>

        {/* Email Editor */}
        <Grid item xs={12} md={9}>
          <Paper sx={{
            p: 3,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2
          }}>
            {steps.map(step => (
              <Collapse in={selectedStep === step.id} key={step.id}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <FormControl sx={{ width: 100 }}>
                      <InputLabel>Delay</InputLabel>
                      <Select
                        value={step.delay}
                        label="Delay"
                        onChange={(e) => handleUpdateStep(step.id, 'delay', e.target.value)}
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7].map(n => (
                          <MenuItem key={n} value={n}>{n}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ width: 120 }}>
                      <InputLabel>Unit</InputLabel>
                      <Select
                        value={step.delayUnit}
                        label="Unit"
                        onChange={(e) => handleUpdateStep(step.id, 'delayUnit', e.target.value)}
                      >
                        <MenuItem value="minutes">Minutes</MenuItem>
                        <MenuItem value="hours">Hours</MenuItem>
                        <MenuItem value="days">Days</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        fullWidth
                        label="Subject Line"
                        value={step.subject}
                        onChange={(e) => handleUpdateStep(step.id, 'subject', e.target.value)}
                      />
                      <Tooltip title="Generate AI Subject">
                        <IconButton onClick={generateAISubject}>
                          <AutoAwesomeIcon sx={{ color: '#6366F1' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label="{{first_name}}"
                        onClick={() => handleUpdateStep(step.id, 'subject', step.subject + ' {{first_name}}')}
                        sx={{ background: 'white' }}
                      />
                      <Chip 
                        label="{{company_name}}"
                        onClick={() => handleUpdateStep(step.id, 'subject', step.subject + ' {{company_name}}')}
                        sx={{ background: 'white' }}
                      />
                    </Box>
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={12}
                    label="Email Content"
                    value={step.content}
                    onChange={(e) => handleUpdateStep(step.id, 'content', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'monospace'
                      }
                    }}
                  />

                  <Box sx={{ 
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(99,102,241,0.05)',
                    border: '1px dashed rgba(99,102,241,0.2)'
                  }}>
                    <Typography variant="body2" sx={{ color: '#4B5563' }}>
                      <strong>AI Writing Assistant:</strong> This email follows best practices for cold outreach 
                      with a clear value proposition and social proof. Consider adding a specific customer success 
                      story to increase credibility.
                    </Typography>
                  </Box>
                </Box>
              </Collapse>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmailSequenceBuilder; 