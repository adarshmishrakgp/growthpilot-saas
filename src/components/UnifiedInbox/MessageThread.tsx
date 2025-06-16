import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Chip, Badge, Box, Typography } from '@mui/material';

export interface PostContent {
  type: 'image' | 'video' | 'text' | 'email';
  mediaUrl?: string;
  caption?: string;
  subject?: string;
  preview?: string;
  timestamp: string;
}

export interface Thread {
  id: string;
  user: string;
  avatar: string;
  channel: string;
  intent: 'lead' | 'support' | 'spam' | 'opportunity';
  lastMessage: string;
  time: string;
  unread?: boolean;
  aiSuggested: string;
  crmLog: string[];
  originalPost?: PostContent;
  crm?: {
    email: string;
    lastOrder: string;
    [key: string]: any;
  };
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
}

const intentConfig: { [key: string]: { label: string; color: string } } = {
  lead: { label: 'Lead', color: 'success' },
  support: { label: 'Support', color: 'info' },
  spam: { label: 'Spam', color: 'default' },
  opportunity: { label: 'Opportunity', color: 'warning' }
};

interface Props {
  thread: Thread;
  selected: boolean;
  onClick: () => void;
}

const MessageThread: React.FC<Props> = ({ thread, selected, onClick }) => (
  <ListItem
    button
    selected={selected}
    onClick={onClick}
    sx={{
      borderRadius: 2,
      mb: 1,
      background: selected ? 'rgba(99,102,241,0.08)' : 'transparent'
    }}
  >
    <ListItemAvatar>
      <Badge color="error" variant="dot" invisible={!thread.unread}>
        <Avatar src={thread.avatar} />
      </Badge>
    </ListItemAvatar>
    <ListItemText
      primary={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontWeight: 700 }}>{thread.user}</Typography>
          <Chip 
            label={intentConfig[thread.intent].label} 
            color={intentConfig[thread.intent].color as any} 
            size="small" 
          />
        </Box>
      }
      secondary={
        <Typography variant="body2" color="text.secondary">
          {thread.lastMessage} • {thread.time}
        </Typography>
      }
    />
  </ListItem>
);

export default MessageThread;
