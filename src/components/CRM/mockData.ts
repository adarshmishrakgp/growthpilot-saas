import { Lead, Activity, LeadScore, PipelineStage, User, AISuggestion } from './types';

export const users: User[] = [
  { id: 'u1', name: 'Alex Kim', color: '#6366f1', avatarUrl: '', },
  { id: 'u2', name: 'Sam Lee', color: '#fbbf24', avatarUrl: '', },
];

export const pipelineStages: PipelineStage[] = [
  { id: 'stage1', name: 'Prospect', color: '#a5b4fc' },
  { id: 'stage2', name: 'Qualified', color: '#fbbf24' },
  { id: 'stage3', name: 'Negotiation', color: '#4ade80' },
];

export const leads: Lead[] = [
  {
    id: 'l1',
    name: 'Jordan Smith',
    company: 'Acme Corp',
    email: 'jordan@acme.com',
    phone: '+1 555-1234',
    avatarUrl: '',
    status: 'hot',
    score: 88,
    tags: ['pricing', 'case study'],
    pipelineStage: 'stage2',
    owner: 'u1',
    lastActivity: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'l2',
    name: 'Taylor Brooks',
    company: 'Beta Inc',
    email: 'taylor@beta.com',
    phone: '+1 555-5678',
    avatarUrl: '',
    status: 'warm',
    score: 65,
    tags: ['demo'],
    pipelineStage: 'stage1',
    owner: 'u2',
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'l3',
    name: 'Morgan Lee',
    company: 'Gamma LLC',
    email: 'morgan@gamma.com',
    phone: '+1 555-9012',
    avatarUrl: '',
    status: 'cold',
    score: 32,
    tags: ['newsletter'],
    pipelineStage: 'stage1',
    owner: 'u1',
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const activities: Activity[] = [
  { id: 'a1', leadId: 'l1', type: 'email', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), summary: 'Opened email: Welcome', status: 'opened', channel: 'email' },
  { id: 'a2', leadId: 'l1', type: 'email', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), summary: 'Clicked link: Pricing', status: 'clicked', channel: 'email' },
  { id: 'a3', leadId: 'l1', type: 'pageview', timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(), summary: 'Visited pricing page', channel: 'web' },
  { id: 'a4', leadId: 'l1', type: 'pageview', timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString(), summary: 'Clicked case study', channel: 'web' },
  { id: 'a5', leadId: 'l1', type: 'chat', timestamp: new Date(Date.now() - 70 * 60 * 1000).toISOString(), summary: 'No reply in chat', channel: 'website', status: 'missed' },
  { id: 'a6', leadId: 'l2', type: 'email', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), summary: 'Opened email: Demo', status: 'opened', channel: 'email' },
  { id: 'a7', leadId: 'l2', type: 'call', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), summary: 'Missed call', status: 'missed', channel: 'phone' },
  { id: 'a8', leadId: 'l2', type: 'chat', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), summary: 'WhatsApp reply: Interested', status: 'replied', channel: 'whatsapp' },
  { id: 'a9', leadId: 'l3', type: 'email', timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), summary: 'Opened newsletter', status: 'opened', channel: 'email' },
  { id: 'a10', leadId: 'l3', type: 'pageview', timestamp: new Date(Date.now() - 29 * 60 * 60 * 1000).toISOString(), summary: 'Visited blog', channel: 'web' },
];

export const leadScores: LeadScore[] = [
  { leadId: 'l1', score: 88, updatedAt: new Date().toISOString(), trend: [60, 70, 80, 88], predictive: 90 },
  { leadId: 'l2', score: 65, updatedAt: new Date().toISOString(), trend: [50, 55, 60, 65], predictive: 70 },
  { leadId: 'l3', score: 32, updatedAt: new Date().toISOString(), trend: [30, 32, 32, 32], predictive: 35 },
];

export const aiSuggestions: AISuggestion[] = [
  { id: 's1', leadId: 'l1', suggestion: 'Auto-call + Send comparison guide', reason: "Engaged lead, but hasn't responded in 3 days", createdAt: new Date().toISOString(), actionType: 'call' },
  { id: 's2', leadId: 'l2', suggestion: 'Invite to webinar', reason: 'Replied on WhatsApp, interested in demo', createdAt: new Date().toISOString(), actionType: 'webinar' },
  { id: 's3', leadId: 'l3', suggestion: 'Move to nurture campaign', reason: 'No activity in 1 month', createdAt: new Date().toISOString(), actionType: 'nurture' },
]; 