import { Email, WhatsApp, LinkedIn, Message, Public, Instagram, YouTube, Twitter, Phone, SmartToy } from '@mui/icons-material';

export interface Template {
  id: string;
  name: string;
  content: string;
  subject?: string;
  variables: string[];
  category: string;
  sentiment: 'professional' | 'casual' | 'friendly' | 'urgent';
}

export interface ChannelStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  meetings: number;
}

export interface Channel {
  id: string;
  name: string;
  icon: any;
  enabled: boolean;
  delay: number;
  delayUnit: 'minutes' | 'hours' | 'days';
  template: string;
  templates: Template[];
  stats: ChannelStats;
  settings: {
    maxFollowUps: number;
    pauseOnReply: boolean;
    workingHoursOnly: boolean;
    customFields: Record<string, string>;
  };
}

export interface Trigger {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  enabled: boolean;
  priority: 'high' | 'medium' | 'low';
  cooldown: number;
  stats: {
    triggered: number;
    successful: number;
    failed: number;
  };
}

export const emailTemplates: Template[] = [
  {
    id: 'email1',
    name: 'Value Proposition',
    subject: 'Transform your {industry} operations with AI',
    content: 'Hi {name},\n\nI noticed {company} is making waves in the {industry} space. Many companies like yours are struggling with scaling operations efficiently.\n\nWe\'ve helped similar companies achieve:\n• 50% reduction in manual tasks\n• 3x faster customer response time\n• 99.9% accuracy in compliance\n\nWould you be interested in seeing how we could help {company} achieve similar results?\n\nBest,\n{sender_name}',
    variables: ['name', 'company', 'industry', 'sender_name'],
    category: 'outreach',
    sentiment: 'professional'
  },
  {
    id: 'email2',
    name: 'Case Study Follow-up',
    subject: 'How {similar_company} achieved 3x growth with our solution',
    content: 'Hi {name},\n\nI wanted to share a quick case study of how {similar_company}, another {industry} company, transformed their operations using our platform.\n\nKey highlights:\n• Automated 75% of routine tasks\n• Reduced compliance risks by 90%\n• Saved $500K annually\n\nWould you like to see how we could implement similar solutions at {company}?\n\nBest regards,\n{sender_name}',
    variables: ['name', 'company', 'industry', 'similar_company', 'sender_name'],
    category: 'follow_up',
    sentiment: 'professional'
  },
  {
    id: 'email3',
    name: 'Urgent Industry Update',
    subject: 'Critical {industry} regulation changes affecting {company}',
    content: 'Hi {name},\n\nI noticed the recent regulatory changes in the {industry} sector that will impact companies like {company}.\n\nOur AI platform has already been updated to handle these changes, helping companies:\n• Stay compliant with new regulations\n• Automate adjustment of processes\n• Generate required reports automatically\n\nWould you like a quick demo of how we can help you adapt to these changes?\n\nBest,\n{sender_name}',
    variables: ['name', 'company', 'industry', 'sender_name'],
    category: 'regulatory',
    sentiment: 'urgent'
  }
];

export const initialChannels: Channel[] = [
  {
    id: 'email',
    name: 'Email',
    icon: Email,
    enabled: true,
    delay: 0,
    delayUnit: 'minutes',
    template: emailTemplates[0].content,
    templates: emailTemplates,
    stats: {
      sent: 1250,
      delivered: 1200,
      opened: 750,
      clicked: 300,
      replied: 150,
      meetings: 45
    },
    settings: {
      maxFollowUps: 3,
      pauseOnReply: true,
      workingHoursOnly: true,
      customFields: {
        signature: 'Best regards,\n{sender_name}\n{company_name}',
        timezone: 'UTC'
      }
    }
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: WhatsApp,
    enabled: true,
    delay: 48,
    delayUnit: 'hours',
    template: 'Hey {name}, quick follow-up on our email about helping {company} with AI automation. Would you be free for a quick chat this week?',
    templates: [
      {
        id: 'wa1',
        name: 'Quick Follow-up',
        content: 'Hey {name}, quick follow-up on our email about helping {company} with AI automation. Would you be free for a quick chat this week?',
        variables: ['name', 'company'],
        category: 'follow_up',
        sentiment: 'friendly'
      }
    ],
    stats: {
      sent: 800,
      delivered: 780,
      opened: 600,
      clicked: 250,
      replied: 180,
      meetings: 60
    },
    settings: {
      maxFollowUps: 2,
      pauseOnReply: true,
      workingHoursOnly: true,
      customFields: {
        businessHours: '9:00-17:00'
      }
    }
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: LinkedIn,
    enabled: true,
    delay: 24,
    delayUnit: 'hours',
    template: `Hi {name}, I came across your profile and noticed your work at {company}. I\`d love to connect and share how we\`re helping similar {industry} companies scale their operations with AI.`,
    templates: [
      {
        id: 'li1',
        name: 'Connection Request',
        content: `Hi {name}, I came across your profile and noticed your work at {company}. I\`d love to connect and share how we\`re helping similar {industry} companies scale their operations with AI.`,
        variables: ['name', 'company', 'industry'],
        category: 'networking',
        sentiment: 'professional'
      }
    ],
    stats: {
      sent: 950,
      delivered: 950,
      opened: 800,
      clicked: 400,
      replied: 250,
      meetings: 85
    },
    settings: {
      maxFollowUps: 1,
      pauseOnReply: true,
      workingHoursOnly: false,
      customFields: {
        connectionNote: 'Interested in AI automation'
      }
    }
  },
  {
    id: 'sms',
    name: 'SMS',
    icon: Message,
    enabled: true,
    delay: 72,
    delayUnit: 'hours',
    template: `Hi {name}, following up on our outreach about AI solutions for {company}. Quick call this week? Reply YES for calendar link.`,
    templates: [
      {
        id: 'sms1',
        name: 'Follow-up SMS',
        content: `Hi {name}, following up on our outreach about AI solutions for {company}. Quick call this week? Reply YES for calendar link.`,
        variables: ['name', 'company'],
        category: 'follow_up',
        sentiment: 'friendly'
      },
      {
        id: 'sms2',
        name: 'Meeting Reminder',
        content: `Reminder: Your demo with {company_name} is tomorrow at {time}. Reply CONFIRM to confirm or RESCHEDULE to change.`,
        variables: ['company_name', 'time'],
        category: 'meeting',
        sentiment: 'professional'
      }
    ],
    stats: {
      sent: 450,
      delivered: 445,
      opened: 400,
      clicked: 120,
      replied: 85,
      meetings: 25
    },
    settings: {
      maxFollowUps: 2,
      pauseOnReply: true,
      workingHoursOnly: true,
      customFields: {
        optOutMessage: 'Reply STOP to opt out'
      }
    }
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: SmartToy,
    enabled: true,
    delay: 24,
    delayUnit: 'hours',
    template: `Hey {name}! 👋 Saw your {industry} content. We're helping creators like you scale with AI. Check out our latest case study?`,
    templates: [
      {
        id: 'tt1',
        name: 'Creator Outreach',
        content: `Hey {name}! 👋 Saw your {industry} content. We're helping creators like you scale with AI. Check out our latest case study?`,
        variables: ['name', 'industry'],
        category: 'outreach',
        sentiment: 'casual'
      },
      {
        id: 'tt2',
        name: 'Influencer Collaboration',
        content: `Hi {name}! Your {industry} content is 🔥. We'd love to collab on showing how AI is transforming {industry}. Interested in a creator partnership?`,
        variables: ['name', 'industry'],
        category: 'partnership',
        sentiment: 'friendly'
      }
    ],
    stats: {
      sent: 300,
      delivered: 290,
      opened: 250,
      clicked: 180,
      replied: 120,
      meetings: 40
    },
    settings: {
      maxFollowUps: 2,
      pauseOnReply: true,
      workingHoursOnly: false,
      customFields: {
        contentType: 'video',
        platform: 'tiktok'
      }
    }
  }
];

export const initialTriggers: Trigger[] = [
  {
    id: 'trigger1',
    name: 'High-Intent Website Visit',
    description: 'Trigger when a lead visits pricing or features page multiple times',
    condition: 'Lead views pricing.pdf OR features page > 2 times in 24h',
    action: 'Send WhatsApp message: "Hi {name}, noticed you were checking out our solutions. Would you like a personalized demo?"',
    enabled: true,
    priority: 'high',
    cooldown: 24,
    stats: {
      triggered: 145,
      successful: 128,
      failed: 17
    }
  },
  {
    id: 'trigger2',
    name: 'Email Engagement',
    description: 'Trigger when a lead opens email multiple times',
    condition: 'Lead opens email > 3 times OR clicks any link',
    action: 'Send LinkedIn connection request with personalized note',
    enabled: true,
    priority: 'medium',
    cooldown: 48,
    stats: {
      triggered: 89,
      successful: 82,
      failed: 7
    }
  },
  {
    id: 'trigger3',
    name: 'Content Download',
    description: 'Trigger when a lead downloads whitepaper or case study',
    condition: 'Lead downloads any premium content',
    action: 'Send follow-up email with related customer success story',
    enabled: true,
    priority: 'medium',
    cooldown: 72,
    stats: {
      triggered: 234,
      successful: 212,
      failed: 22
    }
  },
  {
    id: 'trigger4',
    name: 'Meeting No-Show',
    description: 'Trigger when a scheduled meeting is missed',
    condition: 'Scheduled meeting status changes to "no-show"',
    action: 'Send email: "Sorry we missed you! Would you like to reschedule?"',
    enabled: true,
    priority: 'high',
    cooldown: 1,
    stats: {
      triggered: 45,
      successful: 42,
      failed: 3
    }
  }
];

export const campaignAnalytics = {
  overview: {
    totalLeads: 2500,
    activeSequences: 850,
    completedSequences: 1250,
    totalMeetingsBooked: 190,
    conversionRate: 22.35,
    averageResponseTime: '3.5 hours'
  },
  channelPerformance: {
    email: {
      deliveryRate: 98,
      openRate: 45,
      clickRate: 15,
      replyRate: 8
    },
    whatsapp: {
      deliveryRate: 99,
      openRate: 85,
      responseRate: 35,
      averageResponseTime: '45 minutes'
    },
    linkedin: {
      acceptanceRate: 72,
      responseRate: 28,
      meetingRate: 12
    }
  },
  timeBasedStats: {
    bestTimeToSend: {
      email: '10:00 AM',
      whatsapp: '2:00 PM',
      linkedin: '9:00 AM'
    },
    dayOfWeek: {
      best: 'Tuesday',
      worst: 'Friday'
    }
  }
}; 