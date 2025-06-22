import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import { Thread } from './MessageThread';
import UserProfile from './UserProfile';
import ActionHistory from './ActionHistory';
import AISuggestionBox from './AISuggestionBox';
import MessageBubble from './MessageBubble';
import QuickReplyButtons from './QuickReplyButtons';

interface Props {
  thread: Thread | null;
  onClose: () => void;
}

const ConversationDrawer: React.FC<Props> = ({ thread, onClose }) => {
  const [tab, setTab] = useState(0);

  if (!thread) {
    return null;
  }

  const getIntentColor = (intent: string) => {
    switch (intent.toLowerCase()) {
      case 'lead':
        return 'success';
      case 'opportunity':
        return 'warning';
      case 'support':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box
      sx={{
        width: '380px',
        height: '100%',
        borderLeft: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={thread.avatar} alt={thread.user} sx={{ width: 48, height: 48 }} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6">{thread.user}</Typography>
            <Chip
              label={thread.intent}
              size="small"
              color={getIntentColor(thread.intent)}
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
        
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="Thread" />
          <Tab label="AI Suggestion" />
          <Tab label="CRM" />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {tab === 0 && (
          <Box>
            {thread.originalPost && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Original {thread.originalPost.type}
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    mb: 2
                  }}
                >
                  {thread.originalPost.mediaUrl && (
                    <Box
                      component="img"
                      src={thread.originalPost.mediaUrl}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 1,
                        mb: 1
                      }}
                    />
                  )}
                  <Typography variant="body2">
                    {thread.originalPost.caption || thread.originalPost.preview}
                  </Typography>
                </Box>
              </Box>
            )}
            
            {thread.thread.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
                isAI={message.from === 'ai'}
              />
            ))}
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <AISuggestionBox
              from="ai"
              text={thread.aiSuggested}
              time="now"
              onSend={(suggestion) => {
                // Handle sending the suggestion
                console.log('Sending suggestion:', suggestion);
              }}
            />
            <QuickReplyButtons />
          </Box>
        )}

        {tab === 2 && (
          <Box>
            <UserProfile 
              profile={thread.crm || { email: '', lastOrder: '' }} 
            />
            <Divider sx={{ my: 2 }} />
            <ActionHistory actions={thread.crmLog} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ConversationDrawer;
