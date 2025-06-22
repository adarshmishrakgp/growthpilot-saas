import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, Typography, Avatar, useMediaQuery } from '@mui/material';
import { users, churnSignals, userActions, campaigns, playbooks, feedbackSurveys, kpis, segments, gptSuggestions } from './mockData';
import { User, ChurnSignal, UserAction, Campaign, Playbook, FeedbackSurvey, SuccessKPI, Segment, GPTSuggestion } from './types';


import Sidebar from './Sidebar';
import UserProfilePanel from './UserProfilePanel';
import ChurnSignalTracker from './ChurnSignalTracker';
import EngagementTimeline from './EngagementTimeline';
import SmartActionsPanel from './SmartActionsPanel';
import CampaignsPanel from './CampaignsPanel';
import FeedbackRecoveryPanel from './FeedbackRecoveryPanel';
import AdminDashboard from './AdminDashboard';

const SuccessEngineApp: React.FC = () => {
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

  // State for selected user, segment, etc.
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0].id);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  // Filtered users by segment
  const filteredUsers = selectedSegment === 'all'
    ? users
    : users.filter(u => {
        const seg = segments.find(s => s.id === selectedSegment);
        if (!seg) return true;
        if (seg.name === 'Active') return u.status === 'active';
        if (seg.name === 'At Risk') return u.status === 'at_risk';
        if (seg.name === 'Likely to Churn') return u.status === 'likely_churn';
        return true;
      });

  const selectedUser = users.find(u => u.id === selectedUserId) || users[0];
  const userChurnSignals = churnSignals.filter(c => c.userId === selectedUser.id);
  const userActionsList = userActions.filter(a => a.userId === selectedUser.id);
  const userFeedback = feedbackSurveys.filter(f => f.userId === selectedUser.id);
  const userGPTSuggestions = gptSuggestions.filter(g => g.userId === selectedUser.id);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Top Nav */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderRadius: 4, mb: 2, boxShadow: '0 2px 12px #6366f133' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h5" fontWeight={800} color="#6366f1" sx={{ flexGrow: 1 }}>
            Customer Success & Retention Engine
          </Typography>
          <Avatar sx={{ bgcolor: '#6366f1', ml: 2 }}>A</Avatar>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 80px)', bgcolor: theme.palette.background.default }}>
      
        <Sidebar
          users={filteredUsers}
          segments={segments}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          selectedSegment={selectedSegment}
          setSelectedSegment={setSelectedSegment}
        />
        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, p: isMobile ? 1 : 3, overflow: 'auto' }}>
          {/* User Profile & Churn Tracker */}
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
            <UserProfilePanel user={selectedUser} />
            <ChurnSignalTracker signals={userChurnSignals} />
            <SmartActionsPanel suggestions={userGPTSuggestions} />
          </Box>
          {/* Timeline & Campaigns */}
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
            <EngagementTimeline actions={userActionsList} />
            <CampaignsPanel campaigns={campaigns} playbooks={playbooks} />
          </Box>
          {/* Feedback & Admin Dashboard */}
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
            <FeedbackRecoveryPanel feedback={userFeedback} />
            <AdminDashboard kpis={kpis} segments={segments} users={users} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SuccessEngineApp; 