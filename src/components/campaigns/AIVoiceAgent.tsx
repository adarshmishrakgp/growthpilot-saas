import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Chip,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Card,
  CardContent,
  Tooltip,
  LinearProgress,
  useTheme,
  alpha,
  Alert,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  PhoneInTalk as PhoneInTalkIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Schedule as ScheduleIcon,
  Psychology as PsychologyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timeline as TimelineIcon,
  PhoneCallback as PhoneCallbackIcon,
  VoiceChat as VoiceChatIcon,
} from '@mui/icons-material';
import VoiceCallService, { VoiceCall, CallScheduleParams } from '../../services/VoiceCallService';

interface AIVoiceAgentProps {
  onCallComplete?: (callData: VoiceCall) => void;
}

const AIVoiceAgent: React.FC<AIVoiceAgentProps> = ({ onCallComplete }) => {
  const theme = useTheme();
  const [calls, setCalls] = useState<VoiceCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<VoiceCall | null>(null);
  const [isNewCallDialogOpen, setIsNewCallDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCallData, setNewCallData] = useState<CallScheduleParams>({
    leadName: '',
    company: '',
    phoneNumber: '',
    scheduledTime: '',
  });

  const voiceCallService = VoiceCallService.getInstance();

  // Fetch initial calls
  useEffect(() => {
    const fetchCalls = async () => {
      setIsLoading(true);
      try {
        const mockCalls = await Promise.all([
          voiceCallService.getCallStatus('1'),
          voiceCallService.getCallStatus('2'),
          voiceCallService.getCallStatus('3'),
        ]);
        setCalls(mockCalls);
      } catch (err) {
        setError('Failed to fetch calls');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCalls();
  }, [voiceCallService]);

  // Poll for updates on in-progress calls
  useEffect(() => {
    const inProgressCalls = calls.filter(call => call.status === 'in-progress');
    if (inProgressCalls.length === 0) return;

    const pollInterval = setInterval(async () => {
      const updatedCalls = await Promise.all(
        inProgressCalls.map(call => voiceCallService.getCallStatus(call.id))
      );

      setCalls(prevCalls => 
        prevCalls.map(prevCall => {
          const updatedCall = updatedCalls.find(uc => uc.id === prevCall.id);
          return updatedCall || prevCall;
        })
      );
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [calls, voiceCallService]);

  const handleNewCall = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newCall = await voiceCallService.scheduleCall(newCallData);
      setCalls(prevCalls => [...prevCalls, newCall]);
      setIsNewCallDialogOpen(false);
      setNewCallData({
        leadName: '',
        company: '',
        phoneNumber: '',
        scheduledTime: '',
      });
    } catch (err) {
      setError('Failed to schedule call');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCallDetails = async (call: VoiceCall) => {
    setIsLoading(true);
    setError(null);
    try {
      const [transcript, analysis] = await Promise.all([
        call.status === 'completed' ? voiceCallService.getTranscript(call.id) : Promise.resolve(undefined),
        call.status === 'completed' ? voiceCallService.analyzeIntent(call.transcript || '') : Promise.resolve(undefined),
      ]);

      const enrichedCall = {
        ...call,
        transcript,
        intentScore: analysis?.intentScore,
        sentiment: analysis?.sentiment,
        nextSteps: analysis?.nextSteps,
      };

      setSelectedCall(enrichedCall);
      setCalls(prevCalls =>
        prevCalls.map(pc => (pc.id === call.id ? enrichedCall : pc))
      );
    } catch (err) {
      setError('Failed to fetch call details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: VoiceCall['status']) => {
    switch (status) {
      case 'completed':
        return theme.palette.success.main;
      case 'in-progress':
        return theme.palette.primary.main;
      case 'scheduled':
        return theme.palette.info.main;
      case 'failed':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getOutcomeIcon = (outcome?: VoiceCall['outcome']): React.ReactElement => {
    switch (outcome) {
      case 'meeting_booked':
        return <CheckCircleIcon fontSize="small" />;
      case 'callback_requested':
        return <PhoneCallbackIcon fontSize="small" />;
      case 'not_interested':
        return <CancelIcon fontSize="small" />;
      case 'no_answer':
        return <PhoneIcon fontSize="small" />;
      default:
        return <PhoneIcon fontSize="small" />;
    }
  };

  const renderCallCard = (call: VoiceCall) => (
    <div
      key={call.id}
      style={{
        opacity: 1,
        transform: 'translateY(0)',
        transition: 'opacity 0.2s, transform 0.2s'
      }}
    >
      <Card
        sx={{
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: 2,
          boxShadow: 'none',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
          },
        }}
      >
        <CardContent>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar
                sx={{
                  bgcolor: alpha(getStatusColor(call.status), 0.1),
                  color: getStatusColor(call.status),
                }}
              >
                {call.leadName.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {call.leadName}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.grey[600] }}>
                {call.company} • {call.phoneNumber}
              </Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  label={call.status}
                  sx={{
                    bgcolor: alpha(getStatusColor(call.status), 0.1),
                    color: getStatusColor(call.status),
                    fontWeight: 500,
                  }}
                />
                {call.outcome && (
                  <Tooltip title={call.outcome.replace('_', ' ')}>
                    <Box sx={{ color: getStatusColor(call.status) }}>
                      {getOutcomeIcon(call.outcome)}
                    </Box>
                  </Tooltip>
                )}
                {call.intentScore && (
                  <Chip
                    size="small"
                    icon={<PsychologyIcon fontSize="small" />}
                    label={`${Math.round(call.intentScore)}% Intent`}
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                    }}
                  />
                )}
              </Stack>
            </Grid>
            <Grid item>
              <IconButton
                size="small"
                onClick={() => handleViewCallDetails(call)}
                disabled={isLoading}
                sx={{ color: theme.palette.grey[500] }}
              >
                <TimelineIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
          {call.status === 'in-progress' && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="indeterminate"
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderCallDetails = () =>
    selectedCall && (
      <>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: alpha(getStatusColor(selectedCall.status), 0.1) }}>
              {selectedCall.leadName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedCall.leadName}</Typography>
              <Typography variant="body2" sx={{ color: theme.palette.grey[600] }}>
                {selectedCall.company} • {selectedCall.phoneNumber}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600], mb: 1 }}>
                    Call Status
                  </Typography>
                  <Chip
                    label={selectedCall.status}
                    sx={{
                      bgcolor: alpha(getStatusColor(selectedCall.status), 0.1),
                      color: getStatusColor(selectedCall.status),
                    }}
                  />
                </Box>
                {selectedCall.scheduledTime && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600], mb: 1 }}>
                      Scheduled Time
                    </Typography>
                    <Typography>{selectedCall.scheduledTime}</Typography>
                  </Box>
                )}
                {selectedCall.duration && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600], mb: 1 }}>
                      Duration
                    </Typography>
                    <Typography>{selectedCall.duration}</Typography>
                  </Box>
                )}
                {selectedCall.outcome && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600], mb: 1 }}>
                      Outcome
                    </Typography>
                    <Chip
                      icon={getOutcomeIcon(selectedCall.outcome)}
                      label={selectedCall.outcome.replace('_', ' ')}
                      sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.1),
                      }}
                    />
                  </Box>
                )}
                {selectedCall.intentScore && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600], mb: 1 }}>
                      Intent Analysis
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        icon={<PsychologyIcon fontSize="small" />}
                        label={`${Math.round(selectedCall.intentScore)}% Intent`}
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                        }}
                      />
                      {selectedCall.sentiment && (
                        <Chip
                          icon={<VoiceChatIcon fontSize="small" />}
                          label={`${selectedCall.sentiment} sentiment`}
                          sx={{
                            bgcolor: alpha(
                              selectedCall.sentiment === 'positive'
                                ? theme.palette.success.main
                                : selectedCall.sentiment === 'negative'
                                ? theme.palette.error.main
                                : theme.palette.warning.main,
                              0.1
                            ),
                            color:
                              selectedCall.sentiment === 'positive'
                                ? theme.palette.success.main
                                : selectedCall.sentiment === 'negative'
                                ? theme.palette.error.main
                                : theme.palette.warning.main,
                          }}
                        />
                      )}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
              {/* Live Transcript or Completed Transcript */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600], mb: 1 }}>
                  {selectedCall.status === 'in-progress' ? 'Live Transcript' : 'Call Transcript'}
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.grey[500], 0.05),
                    maxHeight: 300,
                    overflow: 'auto',
                  }}
                >
                  {selectedCall.status === 'in-progress' && selectedCall.liveTranscript ? (
                    <Box>
                      {selectedCall.liveTranscript.map((line, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'inherit',
                            mb: 2,
                            color: index % 2 === 0 ? theme.palette.primary.main : 'inherit'
                          }}
                        >
                          {index % 2 === 0 ? 'AI: ' : 'Customer: '}{line}
                        </Typography>
                      ))}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <CircularProgress size={16} />
                        <Typography variant="caption" sx={{ color: theme.palette.grey[600] }}>
                          Transcribing...
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      component="pre"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit',
                        m: 0,
                      }}
                    >
                      {selectedCall.transcript}
                    </Typography>
                  )}
                </Paper>
              </Box>

              {/* Call Summary for completed calls */}
              {selectedCall.status === 'completed' && selectedCall.callSummary && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600], mb: 2 }}>
                    Call Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          height: '100%',
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          Main Topics Discussed
                        </Typography>
                        <Stack spacing={1}>
                          {selectedCall.callSummary.mainTopics.map((topic, index) => (
                            <Chip
                              key={index}
                              label={topic}
                              size="small"
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                              }}
                            />
                          ))}
                        </Stack>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          height: '100%',
                          bgcolor: alpha(theme.palette.warning.main, 0.02),
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          Customer Concerns
                        </Typography>
                        <Stack spacing={1}>
                          {selectedCall.callSummary.customerConcerns.map((concern, index) => (
                            <Chip
                              key={index}
                              label={concern}
                              size="small"
                              sx={{
                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                                color: theme.palette.warning.main,
                              }}
                            />
                          ))}
                        </Stack>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.success.main, 0.02),
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          Action Items
                        </Typography>
                        <Stack spacing={1}>
                          {selectedCall.callSummary.actionItems.map((item, index) => (
                            <Chip
                              key={index}
                              icon={<CheckCircleIcon fontSize="small" />}
                              label={item}
                              size="small"
                              sx={{
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                color: theme.palette.success.main,
                              }}
                            />
                          ))}
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {selectedCall.keyPoints && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600], mb: 1 }}>
                    Key Points
                  </Typography>
                  <Stack spacing={1}>
                    {selectedCall.keyPoints.map((point, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: theme.palette.grey[700],
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: theme.palette.primary.main,
                          }}
                        />
                        {point}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}

              {selectedCall.nextSteps && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600], mb: 1 }}>
                    Next Steps
                  </Typography>
                  <Alert severity="info" icon={<ScheduleIcon />}>
                    {selectedCall.nextSteps}
                  </Alert>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCall(null)}>Close</Button>
          {selectedCall.status === 'completed' && onCallComplete && (
            <Button
              variant="contained"
              onClick={() => {
                onCallComplete(selectedCall);
                setSelectedCall(null);
              }}
            >
              Process Outcome
            </Button>
          )}
        </DialogActions>
      </>
    );

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.grey[900], mb: 1 }}>
            AI Voice Agent
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.grey[600] }}>
            Intelligent voice calls powered by AI to qualify leads and book meetings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RecordVoiceOverIcon />}
          onClick={() => setIsNewCallDialogOpen(true)}
          disabled={isLoading}
          sx={{
            background: theme.palette.primary.main,
            '&:hover': {
              background: theme.palette.primary.dark,
            },
          }}
        >
          Schedule New Call
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <PhoneInTalkIcon sx={{ color: theme.palette.primary.main }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.grey[900] }}>
                  {calls.filter(c => c.status === 'completed').length}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.grey[600] }}>
                  Completed Calls
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.grey[200]}`,
              height: '100%',
              position: 'relative',
            }}
          >
            {isLoading && (
              <LinearProgress
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
            )}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Active Calls
            </Typography>
            <Stack spacing={2}>
              <div>
                {calls.map(call => renderCallCard(call))}
              </div>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* New Call Dialog */}
      <Dialog
        open={isNewCallDialogOpen}
        onClose={() => setIsNewCallDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Schedule New AI Call</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Lead Name"
              value={newCallData.leadName}
              onChange={(e) => setNewCallData({ ...newCallData, leadName: e.target.value })}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Company"
              value={newCallData.company}
              onChange={(e) => setNewCallData({ ...newCallData, company: e.target.value })}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={newCallData.phoneNumber}
              onChange={(e) => setNewCallData({ ...newCallData, phoneNumber: e.target.value })}
              disabled={isLoading}
              placeholder="+1234567890"
            />
            <TextField
              fullWidth
              label="Scheduled Time"
              type="datetime-local"
              value={newCallData.scheduledTime}
              onChange={(e) => setNewCallData({ ...newCallData, scheduledTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
              disabled={isLoading}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewCallDialogOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleNewCall}
            disabled={
              isLoading ||
              !newCallData.leadName ||
              !newCallData.company ||
              !newCallData.phoneNumber ||
              !newCallData.scheduledTime
            }
            startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
          >
            Schedule Call
          </Button>
        </DialogActions>
      </Dialog>

      {/* Call Details Dialog */}
      <Dialog
        open={Boolean(selectedCall)}
        onClose={() => setSelectedCall(null)}
        maxWidth="md"
        fullWidth
      >
        {renderCallDetails()}
      </Dialog>
    </Box>
  );
};

export default AIVoiceAgent;