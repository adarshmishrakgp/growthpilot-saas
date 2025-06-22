import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ChannelFilterSidebar from './ChannelFilterSidebar';
import MessageListPanel from './MessageListPanel';
import ConversationDrawer from './ConversationDrawer';
import { Thread } from './MessageThread';

const UnifiedInboxLayout: React.FC = () => {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels(prev =>
      prev.includes(channel)
        ? prev.filter(ch => ch !== channel)
        : [...prev, channel]
    );
  };

  const handleThreadSelect = (thread: Thread) => {
    setSelectedThread(thread);
  };

  const handleCloseDrawer = () => {
    setSelectedThread(null);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)', 
      fontFamily: 'Inter, Manrope, sans-serif'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937' }}>
              Unified Inbox
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>
              Manage all your conversations in one place
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2}>
            <ChannelFilterSidebar
              selectedChannels={selectedChannels}
              onChannelToggle={handleChannelToggle}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <MessageListPanel
              channelFilter={selectedChannels}
              onSelectThread={handleThreadSelect}
              selectedThreadId={selectedThread?.id || null}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <ConversationDrawer 
              thread={selectedThread} 
              onClose={handleCloseDrawer}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UnifiedInboxLayout;
