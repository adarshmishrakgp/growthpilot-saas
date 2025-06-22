import React from 'react';
import { Box, Typography, Avatar, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface PostContent {
  type: 'email' | 'image' | 'text' | 'video';
  mediaUrl?: string;
  caption?: string;
  subject?: string;
  preview?: string;
  timestamp: string;
}

export interface Thread {
  id: string;
  author: string;
  text: string;
  status: string;
  user: string;
  channel: string;
  avatar: string;
  intent: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  aiSuggested: string;
  crmLog: string[];
  originalPost?: PostContent;
  thread: {
    from: 'user' | 'ai';
    text: string;
    time: string;
    attachments?: Array<{
      type: string;
      url: string;
      label: string;
    }>;
  }[];
  crm?: {
    email: string;
    lastOrder: string;
    [key: string]: any;
  };
}

const ThreadContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ThreadContent = styled(Box)({
  marginLeft: '12px',
  flex: 1,
  overflow: 'hidden',
});

const ThreadHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '4px',
});

interface MessageThreadProps {
  thread: Thread;
  selected?: boolean;
  onClick?: () => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({ 
  thread,
  selected = false,
  onClick
}) => {
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
    <ThreadContainer
      onClick={onClick}
      sx={{
        backgroundColor: selected ? 'action.selected' : 'background.paper',
      }}
    >
      <Avatar src={thread.avatar} alt={thread.user} />
      <ThreadContent>
        <ThreadHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {thread.user}
            </Typography>
            <Chip
              label={thread.intent}
              size="small"
              color={getIntentColor(thread.intent)}
              sx={{ height: 20 }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {thread.time}
          </Typography>
        </ThreadHeader>
        <Typography
          variant="body2"
          color={thread.unread ? 'text.primary' : 'text.secondary'}
          noWrap
          sx={{ fontWeight: thread.unread ? 600 : 400 }}
        >
          {thread.lastMessage}
        </Typography>
      </ThreadContent>
    </ThreadContainer>
  );
};

export default MessageThread;
