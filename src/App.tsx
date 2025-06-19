import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import SmartInbox from './components/inbox/SmartInbox';
import LeadGenerator from './components/leads/LeadGenerator';
import CampaignBuilder from './components/campaigns/CampaignBuilder';
import { UnifiedInboxLayout } from './components/UnifiedInbox';
import { MultiChannelCampaign, AIVoiceAgent } from './components/campaigns';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/inbox" element={<SmartInbox />} />
            <Route path="/leads" element={<LeadGenerator />} />
            <Route path="/campaigns" element={<CampaignBuilder />} />
            <Route path="/campaigns/multi-channel" element={<MultiChannelCampaign />} />
            <Route path="/campaigns/voice-agent" element={<AIVoiceAgent />} />
            <Route path="/unified-inbox" element={<UnifiedInboxLayout />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App; 