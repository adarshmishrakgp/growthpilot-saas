import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme';
import CssBaseline from '@mui/material/CssBaseline';
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
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/*"
              element={
                <PrivateRoute>
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
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 