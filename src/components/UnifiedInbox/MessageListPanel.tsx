import React from 'react';
import { List, Typography, Box, Paper } from '@mui/material';
import MessageThread from './MessageThread';
import type { Thread } from './MessageThread';

// Mock data for threads
const threads: Thread[] = [
  {
    id: '1',
    user: 'Priya Sharma',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    channel: 'Instagram',
    intent: 'lead',
    lastMessage: 'How much is this?',
    time: '2m ago',
    unread: true,
    aiSuggested: "Hi! This product is ₹999. I've DMed you the link to buy.",
    crmLog: [
      "Tagged as Lead",
      "Sent product link via DM",
      "Logged UTM from post"
    ],
    originalPost: {
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      caption: '✨ Our new summer collection just dropped! Limited edition sneakers with cloud-like comfort. Which color is your favorite? 👟 #SneakerHead #Fashion',
      timestamp: '2h ago'
    },
    thread: [
      { from: 'user', text: 'How much is this?', time: '2m ago' },
      { from: 'ai', text: "Hi! This product is ₹999. I've DMed you the link to buy.", time: 'just now', attachments: [{ type: 'link', url: 'https://shop.com/buy/123', label: 'Buy Now' }] }
    ]
  },
  {
    id: '2',
    user: 'Rahul Verma',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    channel: 'WhatsApp',
    intent: 'opportunity',
    lastMessage: 'Do you have size 9 in stock?',
    time: '5m ago',
    unread: true,
    aiSuggested: "Yes! We've got 2 pairs in size 9 available. Want me to hold one for you?",
    crmLog: [
      "Tagged as Opportunity",
      "Sent product card",
      "Logged WhatsApp Pay link"
    ],
    originalPost: {
      type: 'text',
      preview: '🎉 Exclusive WhatsApp Deal: Get 20% off on all sneakers this weekend! Reply with "SNEAKER20" to claim your discount. Limited time offer!',
      timestamp: '1h ago'
    },
    thread: [
      { from: 'user', text: 'Do you have size 9 in stock?', time: '5m ago' },
      { from: 'ai', text: "Yes! We've got 2 pairs in size 9 available. Want me to hold one for you?", time: 'just now', attachments: [{ type: 'link', url: 'https://shop.com/whatsapp-pay', label: 'Buy via WhatsApp Pay' }] }
    ]
  },
  {
    id: '3',
    user: 'Maya Singh',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    channel: 'TikTok',
    intent: 'lead',
    lastMessage: 'Need more info!',
    time: '10m ago',
    unread: false,
    aiSuggested: "Hey! Just sent you a DM with full specs and a comparison sheet.",
    crmLog: [
      "Tagged as Lead",
      "Sent product highlights carousel",
      "Sent case study link"
    ],
    originalPost: {
      type: 'video',
      mediaUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
      caption: '🔥 Watch how our sneakers are made! Behind the scenes look at our sustainable manufacturing process. #SneakerTok #Sustainability',
      timestamp: '45m ago'
    },
    thread: [
      { from: 'user', text: 'Need more info!', time: '10m ago' },
      { from: 'ai', text: "Hey! Just sent you a DM with full specs and a comparison sheet.", time: 'just now', attachments: [{ type: 'link', url: 'https://shop.com/case-study', label: 'View Case Study' }] }
    ]
  },
  {
    id: '4',
    user: 'Amit Patel',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    channel: 'Facebook',
    intent: 'support',
    lastMessage: 'I never received my order 😡',
    time: '15m ago',
    unread: true,
    aiSuggested: "Sorry to hear that! I've escalated this to our team. You'll hear back in 30 mins.",
    crmLog: [
      "Tagged as Support",
      "Complaint ticket auto-opened",
      "Escalated to human rep"
    ],
    originalPost: {
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
      caption: '🎯 Flash Sale Alert! 48 hours only - Get your favorite sneakers at 30% off. Shop now through our website or DM us for exclusive deals!',
      timestamp: '3h ago'
    },
    thread: [
      { from: 'user', text: 'I never received my order 😡', time: '15m ago' },
      { from: 'ai', text: "Sorry to hear that! I've escalated this to our team. You'll hear back in 30 mins.", time: 'just now' }
    ]
  },
  {
    id: '5',
    user: 'Maya Rao',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    channel: 'Email',
    intent: 'lead',
    lastMessage: 'Do you have a pricing sheet for NGOs?',
    time: '20m ago',
    unread: false,
    aiSuggested: "Hi Maya! Here's our nonprofit pricing. Also attached a case study from an NGO using our platform.",
    crmLog: [
      "Tagged as Lead",
      "Sent PDF pricing",
      "Auto-scheduled follow-up in 3 days"
    ],
    originalPost: {
      type: 'email',
      subject: 'Special Nonprofit Organization Pricing - Limited Time Offer',
      preview: `Dear Maya, We understand that NGOs have unique needs and budget constraints. That's why we're excited to introduce our special nonprofit pricing tier that includes...`,
      timestamp: '1h ago'
    },
    thread: [
      { from: 'user', text: 'Do you have a pricing sheet for NGOs?', time: '20m ago' },
      { from: 'ai', text: "Hi Maya! Here's our nonprofit pricing. Also attached a case study from an NGO using our platform.", time: 'just now', attachments: [{ type: 'file', url: 'https://shop.com/pricing.pdf', label: 'Download PDF' }] }
    ]
  },
  {
    id: '6',
    user: 'Jay Mehta',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    channel: 'LinkedIn',
    intent: 'opportunity',
    lastMessage: 'Saw your product on TechCrunch — does it work for fintechs?',
    time: '25m ago',
    unread: false,
    aiSuggested: "Hey Jay! Yes, we've helped 24+ fintech teams automate their onboarding. I'll DM you the demo link.",
    crmLog: [
      "Tagged as Opportunity",
      "Sent demo link",
      "Logged LinkedIn company data"
    ],
    originalPost: {
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
      caption: '🚀 Excited to announce our latest partnership with leading fintech companies! Our AI-powered platform now integrates seamlessly with major financial services. #Fintech #Innovation',
      timestamp: '4h ago'
    },
    thread: [
      { from: 'user', text: 'Saw your product on TechCrunch — does it work for fintechs?', time: '25m ago' },
      { from: 'ai', text: "Hey Jay! Yes, we've helped 24+ fintech teams automate their onboarding. I'll DM you the demo link.", time: 'just now', attachments: [{ type: 'link', url: 'https://shop.com/demo', label: 'View Demo' }] }
    ]
  },
  {
    id: '7',
    user: 'Sarah Chen',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    channel: 'WhatsApp',
    intent: 'support',
    lastMessage: 'How do I reset my password?',
    time: '30m ago',
    unread: false,
    aiSuggested: "I can help you reset your password! Click the link I just sent to your email.",
    crmLog: [
      "Tagged as Support",
      "Sent password reset link",
      "Updated contact info"
    ],
    originalPost: {
      type: 'text',
      preview: `Need help with your account? Our support team is here 24/7. Reply with your query and we'll assist you right away!`,
      timestamp: '30m ago'
    },
    thread: [
      { from: 'user', text: 'How do I reset my password?', time: '30m ago' },
      { from: 'ai', text: "I can help you reset your password! Click the link I just sent to your email.", time: 'just now' }
    ]
  },
  {
    id: '8',
    user: 'Alex Thompson',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    channel: 'Instagram',
    intent: 'spam',
    lastMessage: 'Check out my new crypto project!',
    time: '35m ago',
    unread: false,
    aiSuggested: "This message has been flagged as potential spam.",
    crmLog: [
      "Tagged as Spam",
      "Added to block list",
      "Updated spam filters"
    ],
    originalPost: {
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d',
      caption: '🚀 Want to make 1000x returns? Join our exclusive crypto community! Limited spots available! DM now! 💰 #Crypto #GetRichQuick',
      timestamp: '35m ago'
    },
    thread: [
      { from: 'user', text: 'Check out my new crypto project!', time: '35m ago' },
      { from: 'ai', text: "This message has been flagged as potential spam.", time: 'just now' }
    ]
  }
];

interface Props {
  channelFilter: string[];
  onSelectThread: (thread: Thread) => void;
  selectedThreadId: string | null;
}

const MessageListPanel: React.FC<Props> = ({ channelFilter, onSelectThread, selectedThreadId }) => {
  const filtered = channelFilter.length
    ? threads.filter(t => channelFilter.includes(t.channel))
    : threads;

  return (
    <Paper sx={{ 
      p: 3,
      height: '100%',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937' }}>
          Inbox
          {channelFilter.length > 0 && (
            <Typography component="span" variant="body2" sx={{ ml: 1, color: '#6B7280' }}>
              • Filtered by {channelFilter.join(', ')}
            </Typography>
          )}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280' }}>
          {filtered.length} conversations
        </Typography>
      </Box>
      <List sx={{ 
        maxHeight: 'calc(100vh - 250px)',
        overflowY: 'auto',
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
        {filtered.map(thread => (
          <MessageThread
            key={thread.id}
            thread={thread}
            selected={selectedThreadId === thread.id}
            onClick={() => onSelectThread(thread)}
          />
        ))}
      </List>
    </Paper>
  );
};

export default MessageListPanel;
