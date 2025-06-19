export interface Company {
  name: string;
  size: string;
  industry: string;
  funding: string;
  website?: string;
  techStack?: string[];
  revenue?: string;
}

export interface LeadEnrichment {
  email?: string;
  phone?: string;
  company: Company;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  engagement?: {
    websiteVisits: {
      count: number;
      averageDuration: number;
      pagesViewed: string[];
    };
    emailInteractions: {
      opens: number;
      clicks: number;
      replies: number;
    };
    contentDownloads: Array<{
      type: string;
      title: string;
      date: string;
    }>;
    eventParticipation?: Array<{
      name: string;
      type: string;
      date: string;
    }>;
  };
  intent?: Array<{
    keywords: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    lastMentionDate: string;
  }>;
}

export interface LeadScore {
  total: number;
  websiteVisits: number;
  contentEngagement: number;
  socialMentions: number;
  companyFit: number;
}

export interface Lead {
  id: string;
  name: string;
  title: string;
  location: string;
  tags: string[];
  stage: string;
  avatar?: string;
  score: LeadScore;
  enrichment: LeadEnrichment;
  segment: 'Hot' | 'Warm' | 'Nurture' | 'Archive';
  lastAction?: {
    type: 'email' | 'whatsapp' | 'call';
    date: string;
    status: 'pending' | 'completed' | 'failed';
    notes?: string;
  };
  customFields?: Record<string, any>;
  assignedTo?: {
    id: string;
    name: string;
    role: string;
  };
  timeline?: {
    date: string;
    type: string;
    description: string;
    data?: any;
  }[];
  preferences?: {
    communicationChannel: ('email' | 'whatsapp' | 'call')[];
    timezone: string;
    language: string;
    optOut?: boolean;
  };
  qualification?: {
    budget: string;
    authority: boolean;
    need: string;
    timeline: string;
    score: number;
  };
  nextActions?: {
    type: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    assignedTo: string;
  }[];
} 