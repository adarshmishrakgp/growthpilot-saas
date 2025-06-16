import React from 'react';
import { Drawer, Box, Avatar, Typography, Chip, Divider, Tabs, Tab, Button, IconButton } from '@mui/material';


import ActionHistory from './ActionHistory';
import UserProfile from './UserProfile';
import QuickReplyButtons from './QuickReplyButtons';
import AISuggestionBox from './AISuggestionBox';
import PostPreview from './PostPreview';
import type { Thread } from './MessageThread';

const tags: { [key: string]: { label: string; color: string } } = {
  lead: { label: 'Lead', color: 'success' },
  support: { label: 'Support', color: 'info' },
  spam: { label: 'Spam', color: 'default' },
  opportunity: { label: 'Opportunity', color: 'warning' }
};

interface ConversationDrawerProps {
  thread: Thread | null;
}

const ConversationDrawer: React.FC<ConversationDrawerProps> = ({ thread }) => {
  const [tab, setTab] = React.useState(0);
  if (!thread) return null;

  return (
    <Drawer
      anchor="right"
      open={!!thread}
      variant="persistent"
      PaperProps={{
        sx: {
            marginTop: '100px',
          width: 400,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '24px 0 0 24px',
          boxShadow: '0 2px 32px #6366f122',
          overflow: 'hidden',
          
        },
      }}
    >
      {/* Fixed Header Section */}
      <Box sx={{ 
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        pt: 2,
        px: 3,
      }}>
        {/* User Info Row */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 2,
          background: 'rgba(255,255,255,0.9)',
          p: 1.5,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <Avatar 
            src={thread.avatar} 
            sx={{ 
              width: 48, 
              height: 48,
              border: '2px solid rgba(99,102,241,0.1)'
            }} 
          />
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={700} sx={{ color: '#1F2937' }}>{thread.user}</Typography>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>{thread.channel}</Typography>
          </Box>
          <Chip 
            label={tags[thread.intent]?.label} 
            color={tags[thread.intent]?.color as any} 
            size="small"
          />
        </Box>

      

        {/* Tabs */}
        <Tabs 
          value={tab} 
          onChange={(_, v) => setTab(v)} 
          sx={{ 
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0'
            },
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.9rem',
              textTransform: 'none',
              minHeight: 48
            }
          }}
        >
          <Tab label="Thread" />
          <Tab label="AI Suggestion" />
          <Tab label="CRM" />
        </Tabs>
      </Box>

      {/* Scrollable Content Section */}
      <Box sx={{ 
        height: 'calc(100vh - 180px)', // Adjusted for new header height
        overflowY: 'auto',
        p: 3,
        pt: 2,
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '10px',
        },
      }}>
        {tab === 0 && (
          <Box>
            {/* Post Preview with spacing */}
            {thread.originalPost && (
              <Box sx={{ mb: 3 }}>
                <PostPreview channel={thread.channel} content={thread.originalPost} />
              </Box>
            )}
            
            {/* Message Thread */}
            {thread.thread && thread.thread.map((msg, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <AISuggestionBox from={msg.from} text={msg.text} time={msg.time} />
                {msg.attachments && msg.attachments.map((att, idx) => (
                  <Button
                    key={idx}
                    href={att.url}
                    target="_blank"
                    variant="contained"
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {att.label}
                  </Button>
                ))}
              </Box>
            ))}
            <QuickReplyButtons />
          </Box>
        )}
        {tab === 1 && (
          <AISuggestionBox from="ai" text={thread.aiSuggested} time="now" />
        )}
        {tab === 2 && (
          <>
            <UserProfile profile={thread.crm || { email: '', lastOrder: '' }} />
            <ActionHistory actions={thread.crmLog || []} />
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default ConversationDrawer;
