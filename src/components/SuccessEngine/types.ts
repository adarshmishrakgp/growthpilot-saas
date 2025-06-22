export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: string;
  tags: string[];
  lastLogin: string;
  churnRisk: number; // 0-100
  lifetimeValue: number;
  featureAdoption: number; // 0-100
  status: 'active' | 'at_risk' | 'likely_churn' | 'inactive';
}

export interface ChurnSignal {
  id: string;
  userId: string;
  type: 'inactivity' | 'complaint' | 'downgrade' | 'payment_issue';
  detectedAt: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface UserAction {
  id: string;
  userId: string;
  type: 'login' | 'plan_change' | 'support' | 'payment' | 'feature_use';
  timestamp: string;
  summary: string;
  details?: string;
}

export interface Campaign {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  status: 'active' | 'paused' | 'completed';
}

export interface Playbook {
  id: string;
  name: string;
  steps: string[];
  description: string;
}

export interface FeedbackSurvey {
  id: string;
  userId: string;
  sentAt: string;
  completedAt?: string;
  score?: number;
  comments?: string;
}

export interface SuccessKPI {
  id: string;
  label: string;
  value: number;
  trend: number[];
}

export interface Segment {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface GPTSuggestion {
  id: string;
  userId: string;
  suggestion: string;
  reason: string;
  createdAt: string;
  actionType: 'email' | 'call' | 'upsell' | 'nurture' | 'custom';
} 