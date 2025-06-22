// Lead status: 'hot', 'warm', 'cold', 'stale'
export type LeadStatus = 'hot' | 'warm' | 'cold' | 'stale';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  status: LeadStatus;
  score: number;
  tags: string[];
  pipelineStage: string;
  owner: string;
  lastActivity: string; // ISO date
}

export type ActivityType = 'email' | 'chat' | 'call' | 'pageview' | 'product' | 'ai';

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  timestamp: string; // ISO date
  summary: string;
  details?: string;
  channel?: string;
  status?: 'opened' | 'clicked' | 'replied' | 'missed' | 'completed';
}

export interface LeadScore {
  leadId: string;
  score: number;
  updatedAt: string;
  trend: number[]; // last N scores
  predictive?: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  color: string;
}

export interface AISuggestion {
  id: string;
  leadId: string;
  suggestion: string;
  reason: string;
  createdAt: string;
  actionType: 'call' | 'email' | 'nurture' | 'webinar' | 'move' | 'custom';
} 