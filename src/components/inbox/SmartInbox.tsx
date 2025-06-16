import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  TextField,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  WhatsApp as WhatsAppIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: string;
  platform: 'whatsapp' | 'instagram' | 'facebook' | 'linkedin' | 'email';
  timestamp: Date;
  status: 'unread' | 'read';
  tag: 'lead' | 'support' | 'spam' | 'opportunity' | 'none';
}

const SmartInbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'How much is this product?',
        sender: 'John Doe',
        platform: 'instagram',
        timestamp: new Date(),
        status: 'unread',
        tag: 'lead',
      },
      {
        id: '2',
        content: 'I need help with my order #12345',
        sender: 'Jane Smith',
        platform: 'whatsapp',
        timestamp: new Date(),
        status: 'unread',
        tag: 'support',
      },
      // Add more mock messages as needed
    ];
    setMessages(mockMessages);
  }, []);

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    setMessages(messages.map(msg => 
      msg.id === message.id ? { ...msg, status: 'read' } : msg
    ));
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;

    setLoading(true);
    try {
      // Here we would integrate with GPT-4 for response generation
      // For now, we'll just add the reply to the messages
      const newMessage: Message = {
        id: Date.now().toString(),
        content: replyText,
        sender: 'You',
        platform: selectedMessage.platform,
        timestamp: new Date(),
        status: 'read',
        tag: 'none',
      };

      setMessages([newMessage, ...messages]);
      setReplyText('');
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = (messageId: string, newTag: Message['tag']) => {
    setMessages(messages.map(msg =>
      msg.id === messageId ? { ...msg, tag: newTag } : msg
    ));
    setAnchorEl(null);
  };

  const getPlatformIcon = (platform: Message['platform']) => {
    switch (platform) {
      case 'whatsapp':
        return <WhatsAppIcon />;
      case 'instagram':
        return <InstagramIcon />;
      case 'facebook':
        return <FacebookIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      case 'email':
        return <EmailIcon />;
      default:
        return <EmailIcon />;
    }
  };

  const getTagColor = (tag: Message['tag']) => {
    switch (tag) {
      case 'lead':
        return 'primary';
      case 'support':
        return 'success';
      case 'spam':
        return 'error';
      case 'opportunity':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" gutterBottom>
          Smart Inbox
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 200px)' }}>
          {/* Message List */}
          <Paper sx={{ width: '40%', overflow: 'auto' }}>
            <List>
              {messages.map((message) => (
                <React.Fragment key={message.id}>
                  <ListItem
                    button
                    selected={selectedMessage?.id === message.id}
                    onClick={() => handleMessageClick(message)}
                  >
                    <ListItemAvatar>
                      <Avatar>{getPlatformIcon(message.platform)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={message.sender}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" noWrap>
                            {message.content}
                          </Typography>
                          <Chip
                            label={message.tag}
                            size="small"
                            color={getTagColor(message.tag)}
                          />
                        </Box>
                      }
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(e.currentTarget);
                        setSelectedMessage(message);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Message Detail */}
          <Paper sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
            {selectedMessage ? (
              <>
                <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
                  <Typography variant="h6">{selectedMessage.sender}</Typography>
                  <Typography variant="body1">{selectedMessage.content}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                  />
                  <IconButton
                    color="primary"
                    onClick={handleReply}
                    disabled={loading || !replyText.trim()}
                  >
                    {loading ? <CircularProgress size={24} /> : <SendIcon />}
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body1" color="text.secondary">
                  Select a message to view details
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Tag Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleTagChange(selectedMessage?.id || '', 'lead')}>
            Lead
          </MenuItem>
          <MenuItem onClick={() => handleTagChange(selectedMessage?.id || '', 'support')}>
            Support
          </MenuItem>
          <MenuItem onClick={() => handleTagChange(selectedMessage?.id || '', 'spam')}>
            Spam
          </MenuItem>
          <MenuItem onClick={() => handleTagChange(selectedMessage?.id || '', 'opportunity')}>
            Opportunity
          </MenuItem>
        </Menu>
      </Box>
    </motion.div>
  );
};

export default SmartInbox; 