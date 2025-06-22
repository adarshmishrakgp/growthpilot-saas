import { User, ChurnSignal, UserAction, Campaign, Playbook, FeedbackSurvey, SuccessKPI, Segment, GPTSuggestion } from './types';

export const users: User[] = [
  {
    id: 'u1',
    name: 'Jordan Smith',
    email: 'jordan@acme.com',
    avatarUrl: '',
    plan: 'Pro',
    tags: ['Power User', 'Upsell Target'],
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    churnRisk: 22,
    lifetimeValue: 1200,
    featureAdoption: 90,
    status: 'active',
  },
  {
    id: 'u2',
    name: 'Taylor Brooks',
    email: 'taylor@beta.com',
    avatarUrl: '',
    plan: 'Basic',
    tags: ['Churn Risk'],
    lastLogin: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    churnRisk: 78,
    lifetimeValue: 400,
    featureAdoption: 40,
    status: 'at_risk',
  },
  {
    id: 'u3',
    name: 'Morgan Lee',
    email: 'morgan@gamma.com',
    avatarUrl: '',
    plan: 'Starter',
    tags: ['Likely to Churn'],
    lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    churnRisk: 92,
    lifetimeValue: 150,
    featureAdoption: 10,
    status: 'likely_churn',
  },
];

export const churnSignals: ChurnSignal[] = [
  { id: 'c1', userId: 'u2', type: 'inactivity', detectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), description: 'No login for 15 days', severity: 'high' },
  { id: 'c2', userId: 'u2', type: 'complaint', detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), description: 'Support ticket: Feature not working', severity: 'medium' },
  { id: 'c3', userId: 'u3', type: 'downgrade', detectedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), description: 'Downgraded from Pro to Starter', severity: 'high' },
  { id: 'c4', userId: 'u3', type: 'payment_issue', detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), description: 'Payment failed', severity: 'high' },
  { id: 'c5', userId: 'u1', type: 'inactivity', detectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), description: 'Session duration dropped', severity: 'low' },
];

export const userActions: UserAction[] = [
  { id: 'a1', userId: 'u1', type: 'login', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), summary: 'Logged in', details: '' },
  { id: 'a2', userId: 'u1', type: 'feature_use', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), summary: 'Used advanced analytics', details: '' },
  { id: 'a3', userId: 'u2', type: 'login', timestamp: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), summary: 'Logged in', details: '' },
  { id: 'a4', userId: 'u2', type: 'support', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), summary: 'Submitted support ticket', details: 'Feature not working' },
  { id: 'a5', userId: 'u2', type: 'plan_change', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), summary: 'Downgraded plan', details: '' },
  { id: 'a6', userId: 'u3', type: 'login', timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), summary: 'Logged in', details: '' },
  { id: 'a7', userId: 'u3', type: 'payment', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), summary: 'Payment failed', details: '' },
  { id: 'a8', userId: 'u3', type: 'plan_change', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), summary: 'Downgraded plan', details: '' },
  { id: 'a9', userId: 'u1', type: 'feature_use', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), summary: 'Used dashboard', details: '' },
  { id: 'a10', userId: 'u1', type: 'login', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), summary: 'Logged in', details: '' },
];

export const campaigns: Campaign[] = [
  { id: 'cmp1', name: 'We Miss You', trigger: 'Inactive 15 days', actions: ['Send WhatsApp', 'Send help guide email', 'Schedule CSM call'], status: 'active' },
  { id: 'cmp2', name: 'Refund Recovery', trigger: 'Refund issued', actions: ['Send apology email', 'Offer discount'], status: 'paused' },
];

export const playbooks: Playbook[] = [
  { id: 'pb1', name: 'Retention Recovery', steps: ['Send re-engagement email', 'Schedule check-in call', 'Offer discount'], description: 'Recover at-risk users with a multi-step campaign.' },
  { id: 'pb2', name: 'Upsell Campaign', steps: ['Identify power users', 'Send upgrade offer', 'Follow up with CSM call'], description: 'Target power users for upsell.' },
];

export const feedbackSurveys: FeedbackSurvey[] = [
  { id: 'fs1', userId: 'u2', sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), score: 6, comments: 'Missing features.' },
  { id: 'fs2', userId: 'u3', sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), completedAt: undefined, score: undefined, comments: undefined },
];

export const kpis: SuccessKPI[] = [
  { id: 'kpi1', label: 'Churn Rate', value: 7.2, trend: [8.1, 7.8, 7.5, 7.2] },
  { id: 'kpi2', label: 'NPS', value: 42, trend: [38, 40, 41, 42] },
  { id: 'kpi3', label: 'Retention', value: 91, trend: [89, 90, 91, 91] },
];

export const segments: Segment[] = [
  { id: 's1', name: 'Active', color: '#4ade80', icon: '🟢' },
  { id: 's2', name: 'At Risk', color: '#fde047', icon: '⚠️' },
  { id: 's3', name: 'Likely to Churn', color: '#f472b6', icon: '🔥' },
];

export const gptSuggestions: GPTSuggestion[] = [
  { id: 'g1', userId: 'u2', suggestion: 'Send "We Miss You" WhatsApp', reason: 'User inactive for 15 days', createdAt: new Date().toISOString(), actionType: 'email' },
  { id: 'g2', userId: 'u1', suggestion: 'Offer upgrade to Pro+', reason: 'Power user on Basic plan', createdAt: new Date().toISOString(), actionType: 'upsell' },
  { id: 'g3', userId: 'u3', suggestion: 'Trigger apology + discount email', reason: 'Refund issued', createdAt: new Date().toISOString(), actionType: 'nurture' },
]; 