import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, Typography, Avatar, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';
import LeadProfile from './LeadProfile';
import InteractionTimeline from './InteractionTimeline';
import EngagementGraph from './EngagementGraph';
import CommunicationHistory from './CommunicationHistory';
import LeadScoringDashboard from './LeadScoringDashboard';
import ActivityFeed from './ActivityFeed';
import AISuggestionPanel from './AISuggestionPanel';
import SmartAssistantPane from './SmartAssistantPane';
import { leads, users, pipelineStages, activities, leadScores, aiSuggestions } from './mockData';
import { Lead, User, PipelineStage, Activity, LeadScore, AISuggestion } from './types';

// Main CRM App Layout
const CRMApp: React.FC = () => {
  // Always use light theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: { main: '#6366f1' },
          secondary: { main: '#fbbf24' },
          background: {
            default: '#f8fafc',
            paper: '#fff',
          },
        },
        typography: {
          fontFamily: 'Manrope, Inter, sans-serif',
        },
      }),
    []
  );
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State for selected lead, pipeline, etc.
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0].id);
  const [pipeline, setPipeline] = useState<PipelineStage[]>(pipelineStages);
  const [leadList, setLeadList] = useState<Lead[]>(leads);
  const [activityList, setActivityList] = useState<Activity[]>(activities);
  const [scoreList, setScoreList] = useState<LeadScore[]>(leadScores);
  const [suggestionList, setSuggestionList] = useState<AISuggestion[]>(aiSuggestions);
  const [userList] = useState<User[]>(users);

  // Find selected lead and related data
  const selectedLead = leadList.find(l => l.id === selectedLeadId) || leadList[0];
  const selectedScore = scoreList.find(s => s.leadId === selectedLeadId);
  const selectedActivities = activityList.filter(a => a.leadId === selectedLeadId);
  const selectedSuggestions = suggestionList.filter(s => s.leadId === selectedLeadId);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Top Nav */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderRadius: 4, mb: 2, boxShadow: '0 2px 12px #6366f133' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h5" fontWeight={800} color="#6366f1" sx={{ flexGrow: 1 }}>
            Smart Relationship Hub
          </Typography>
          <Avatar sx={{ bgcolor: '#6366f1', ml: 2 }}>A</Avatar>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 80px)', bgcolor: theme.palette.background.default }}>
        {/* Sidebar: Segmentation, Pipeline, Filters */}
        <Sidebar
          leads={leadList}
          pipeline={pipeline}
          selectedLeadId={selectedLeadId}
          setSelectedLeadId={setSelectedLeadId}
        />
        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, p: isMobile ? 1 : 3, overflow: 'auto' }}>
          {/* Lead Profile & Scoring */}
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
            <LeadProfile lead={selectedLead} users={userList} />
            <LeadScoringDashboard score={selectedScore} />
            <AISuggestionPanel suggestions={selectedSuggestions} />
          </Box>
          {/* Timeline & Engagement */}
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
            <InteractionTimeline activities={selectedActivities} />
            <EngagementGraph score={selectedScore} />
          </Box>
          {/* Communication History & Activity Feed */}
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
            <CommunicationHistory activities={selectedActivities} />
            <ActivityFeed activities={activityList} leads={leadList} setSelectedLeadId={setSelectedLeadId} />
          </Box>
        </Box>
        {/* Smart Assistant Pane (floating/docked) */}
        <SmartAssistantPane lead={selectedLead} />
      </Box>
    </ThemeProvider>
  );
};

export default CRMApp; 