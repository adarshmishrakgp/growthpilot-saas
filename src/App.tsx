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
import OmniProspectorPage from './components/campaigns/OmniProspectorPage';
import AIAssistantCommercePage from './pages/AIAssistantCommercePage';
import WorkflowAutomationPage from './pages/WorkflowAutomationPage';
import SuccessEngine from './components/SuccessEngine/SuccessEngineApp';
import CRMApp from './components/CRM/CRMApp';

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
            <Route path="/multi-channel" element={<MultiChannelCampaign />} />
            <Route path="/voice-agent" element={<AIVoiceAgent />} />
            <Route path="/unified-inbox" element={<UnifiedInboxLayout />} />
            <Route path="/prospector" element={<OmniProspectorPage />} />
            <Route path="/ai-commerce" element={<AIAssistantCommercePage />} />
            <Route path="/workflow-automation" element={<WorkflowAutomationPage />} />
            <Route path="/crm" element={<CRMApp />} />
            <Route path="/success-engine" element={<SuccessEngine />} />

          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App; 