import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  CircularProgress
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export interface CampaignStats {
  totalLeads: number;
  emailsSent: number;
  emailsOpened: number;
  emailsReplied: number;
  callsTriggered: number;
  callsCompleted: number;
  meetings: number;
}

export interface CampaignSegment {
  name: string;
  count: number;
  color: string;
}

export interface CampaignManagerProps {
  onSettingsClick?: () => void;
  onStatusChange?: (isRunning: boolean) => void;
}

const CampaignManager: React.FC<CampaignManagerProps> = ({ 
  onSettingsClick,
  onStatusChange 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const campaignStats: CampaignStats = {
    totalLeads: 100,
    emailsSent: 78,
    emailsOpened: 45,
    emailsReplied: 12,
    callsTriggered: 8,
    callsCompleted: 5,
    meetings: 3
  };

  const segments: CampaignSegment[] = [
    { name: 'Hot Leads', count: 15, color: '#EF4444' },
    { name: 'Warm Leads', count: 35, color: '#F59E0B' },
    { name: 'Cold Leads', count: 50, color: '#3B82F6' }
  ];

  const handleToggleCampaign = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newStatus = !isRunning;
      setIsRunning(newStatus);
      onStatusChange?.(newStatus);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1F2937' }}>
            Fintech Compliance Campaign
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={onSettingsClick}
              sx={{
                borderColor: '#6366F1',
                color: '#6366F1',
                '&:hover': {
                  borderColor: '#4F46E5',
                  background: 'rgba(99,102,241,0.05)'
                }
              }}
            >
              Settings
            </Button>
            <Button
              variant="contained"
              onClick={handleToggleCampaign}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : isRunning ? <PauseIcon /> : <PlayArrowIcon />}
              sx={{
                background: isRunning ? '#EF4444' : '#10B981',
                '&:hover': {
                  background: isRunning ? '#DC2626' : '#059669'
                }
              }}
            >
              {isRunning ? 'Pause Campaign' : 'Start Campaign'}
            </Button>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          Automated outreach to Berlin-based CTOs and Engineering Heads in fintech
        </Typography>
      </Box>

      {/* Campaign Progress */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{
            p: 3,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937' }}>
                Campaign Progress
              </Typography>
              <Chip
                label={`${campaignStats.emailsSent}/${campaignStats.totalLeads} Processed`}
                sx={{
                  background: 'rgba(99,102,241,0.1)',
                  color: '#6366F1',
                  fontWeight: 500
                }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={(campaignStats.emailsSent / campaignStats.totalLeads) * 100}
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
          </Paper>
        </Grid>
      </Grid>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{
            p: 3,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            height: '100%'
          }}>
            <Typography variant="subtitle2" sx={{ color: '#4B5563', mb: 2 }}>
              Email Performance
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <EmailIcon sx={{ color: '#6366F1', fontSize: 32 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1F2937' }}>
                  {Math.round((campaignStats.emailsReplied / campaignStats.emailsSent) * 100)}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Reply Rate
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Opens
              </Typography>
              <Typography variant="body2" sx={{ color: '#1F2937', fontWeight: 500 }}>
                {campaignStats.emailsOpened}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Replies
              </Typography>
              <Typography variant="body2" sx={{ color: '#1F2937', fontWeight: 500 }}>
                {campaignStats.emailsReplied}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{
            p: 3,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            height: '100%'
          }}>
            <Typography variant="subtitle2" sx={{ color: '#4B5563', mb: 2 }}>
              Voice AI Calls
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <PhoneIcon sx={{ color: '#6366F1', fontSize: 32 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1F2937' }}>
                  {Math.round((campaignStats.callsCompleted / campaignStats.callsTriggered) * 100)}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Completion Rate
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Triggered
              </Typography>
              <Typography variant="body2" sx={{ color: '#1F2937', fontWeight: 500 }}>
                {campaignStats.callsTriggered}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Completed
              </Typography>
              <Typography variant="body2" sx={{ color: '#1F2937', fontWeight: 500 }}>
                {campaignStats.callsCompleted}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{
            p: 3,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            height: '100%'
          }}>
            <Typography variant="subtitle2" sx={{ color: '#4B5563', mb: 2 }}>
              Lead Segments
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <GroupIcon sx={{ color: '#6366F1', fontSize: 32 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1F2937' }}>
                  {campaignStats.meetings}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Meetings Booked
                </Typography>
              </Box>
            </Box>
            {segments.map((segment) => (
              <Box key={segment.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: segment.color }} />
                  {segment.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#1F2937', fontWeight: 500 }}>
                  {segment.count}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* AI Insights */}
      <Paper sx={{
        p: 3,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AutoAwesomeIcon sx={{ color: '#6366F1' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937' }}>
            AI Campaign Insights
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#4B5563', mb: 2 }}>
          Based on current performance metrics, here are AI-generated recommendations:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            background: 'rgba(99,102,241,0.05)',
            border: '1px dashed rgba(99,102,241,0.2)'
          }}>
            <Typography variant="body2" sx={{ color: '#4B5563' }}>
              • Email open rates are 20% higher when sent between 9-11am Berlin time
            </Typography>
          </Box>
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            background: 'rgba(99,102,241,0.05)',
            border: '1px dashed rgba(99,102,241,0.2)'
          }}>
            <Typography variant="body2" sx={{ color: '#4B5563' }}>
              • Leads who mentioned "regulatory compliance" show 3x higher response rates
            </Typography>
          </Box>
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            background: 'rgba(99,102,241,0.05)',
            border: '1px dashed rgba(99,102,241,0.2)'
          }}>
            <Typography variant="body2" sx={{ color: '#4B5563' }}>
              • Voice AI calls have 45% success rate when following email opens within 1 hour
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CampaignManager; 