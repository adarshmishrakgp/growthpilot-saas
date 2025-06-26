import React, { useState } from 'react';
import {
  Typography, Grid, Paper, Box, Dialog, DialogTitle, DialogContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, Button, Divider, Tooltip, Tabs, Tab, TextField
} from '@mui/material';
import { Close, TrendingUp, Group, MonetizationOn, WorkOutline, BarChart, Search } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartTooltip, BarChart as ReBarChart, Bar, FunnelChart, Funnel, LabelList } from 'recharts';
import { leads, activities, leadScores, users as crmUsers } from '../components/CRM/mockData';
import { users as seUsers, userActions, kpis } from '../components/SuccessEngine/mockData';
import UserProfile from '../components/UnifiedInbox/UserProfile';
import type { Lead } from '../components/CRM/types';
import type { User as SEUser } from '../components/SuccessEngine/types';

const PRIMARY = '#234567';
const SECONDARY = '#6C63FF';
const TEAL = '#00B8A9';
const BORDER = '#E0E6ED';
const TEXT = '#222';
const TEXT_SECONDARY = '#666';

function getLeadSource(lead: Lead): string {
  // Mock: assign a random source for demo
  const sources = ['LinkedIn', 'Email Campaign', 'Website', 'Referral', 'Webinar'];
  return sources[lead.score % sources.length];
}

function getUserPayments(userId: string) {
  // Mock: return payment actions for a user
  return userActions.filter(a => a.userId === userId && a.type === 'payment');
}

function getUserRevenue(userId: string): number {
  const user = seUsers.find(u => u.id === userId);
  return user ? user.lifetimeValue : 0;
}

function getLeadActivities(leadId: string) {
  return activities.filter(a => a.leadId === leadId);
}

function getLeadScoreTrend(leadId: string): number[] {
  const score = leadScores.find(s => s.leadId === leadId);
  return score ? score.trend : [];
}

function getUserProfileData(lead: Lead) {
  // Map lead to UserProfileData shape
  return {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    avatar: lead.avatarUrl,
    customerSince: '2022',
    totalOrders: Math.floor(lead.score / 10),
    totalSpent: lead.score * 20,
    lastOrder: '2024-06-01',
    tags: lead.tags,
    socialLinks: [],
    segments: [lead.status],
  };
}

const workflowList = [
  { id: 'w1', name: 'Onboarding Sequence', status: 'Active', steps: 5, users: 120, lastRun: '2024-06-01', success: 92 },
  { id: 'w2', name: 'Churn Recovery', status: 'Active', steps: 3, users: 45, lastRun: '2024-05-28', success: 78 },
  { id: 'w3', name: 'Upsell Campaign', status: 'Paused', steps: 4, users: 30, lastRun: '2024-05-20', success: 60 },
];

const funnelData = [
  { stage: 'Leads', value: leads.length },
  { stage: 'Qualified', value: 18 },
  { stage: 'Demo', value: 10 },
  { stage: 'Closed', value: 6 },
];

export default function Analytics() {
  const [openModal, setOpenModal] = useState<'revenue' | 'workflows' | 'conversion' | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedUser, setSelectedUser] = useState<SEUser | null>(null);
  const [tab, setTab] = useState<number>(0);
  const [leadSearch, setLeadSearch] = useState<string>('');

  // Filtered leads for search
  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.company.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.email.toLowerCase().includes(leadSearch.toLowerCase())
  );

  // Before the return statement in Analytics()
  const churnKPI = kpis.find(k => k.label === 'Churn Rate');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Poppins, sans-serif' }}
    >
      <Box sx={{ p: { xs: 2, md: 6 } }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: PRIMARY, mb: 1, letterSpacing: 1.5 }}>📊 Analytics Center</Typography>
        <Typography sx={{ color: TEXT_SECONDARY, fontSize: 20, fontWeight: 500, mb: 5 }}>Deep insights into your growth, revenue, and engagement.</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 4, border: `2px solid ${SECONDARY}`, borderRadius: 5, boxShadow: `0 4px 24px ${SECONDARY}11`, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.045)', boxShadow: `0 8px 40px ${SECONDARY}22` } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Group sx={{ color: SECONDARY, fontSize: 40 }} />
                <Box>
                  <Typography sx={{ color: TEXT_SECONDARY, fontWeight: 700, fontSize: 18 }}>Total Leads</Typography>
                  <Typography sx={{ fontSize: 36, fontWeight: 900, color: SECONDARY }}>{leads.length}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper onClick={() => setOpenModal('revenue')} sx={{ p: 4, border: `2px solid ${TEAL}`, borderRadius: 5, boxShadow: `0 4px 24px ${TEAL}11`, cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.045)', boxShadow: `0 8px 40px ${TEAL}22` } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MonetizationOn sx={{ color: TEAL, fontSize: 40 }} />
                <Box>
                  <Typography sx={{ color: TEXT_SECONDARY, fontWeight: 700, fontSize: 18 }}>Revenue</Typography>
                  <Typography sx={{ fontSize: 36, fontWeight: 900, color: TEAL }}>
                    ${seUsers.reduce((sum, u) => sum + u.lifetimeValue, 0).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper onClick={() => setOpenModal('workflows')} sx={{ p: 4, border: `2px solid ${PRIMARY}`, borderRadius: 5, boxShadow: `0 4px 24px ${PRIMARY}11`, cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.045)', boxShadow: `0 8px 40px ${PRIMARY}22` } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WorkOutline sx={{ color: PRIMARY, fontSize: 40 }} />
                <Box>
                  <Typography sx={{ color: TEXT_SECONDARY, fontWeight: 700, fontSize: 18 }}>Active Workflows</Typography>
                  <Typography sx={{ fontSize: 36, fontWeight: 900, color: PRIMARY }}>{workflowList.filter(w => w.status === 'Active').length}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper onClick={() => setOpenModal('conversion')} sx={{ p: 4, border: `2px solid ${PRIMARY}`, borderRadius: 5, boxShadow: `0 4px 24px ${PRIMARY}11`, cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.045)', boxShadow: `0 8px 40px ${PRIMARY}22` } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BarChart sx={{ color: PRIMARY, fontSize: 40 }} />
                <Box>
                  <Typography sx={{ color: TEXT_SECONDARY, fontWeight: 700, fontSize: 18 }}>Conversion Rate</Typography>
                  <Typography sx={{ fontSize: 36, fontWeight: 900, color: PRIMARY }}>{Math.round((funnelData[3].value / funnelData[0].value) * 100)}%</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Leads List Section (always visible) */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: SECONDARY, mb: 2, letterSpacing: 1 }}>Leads</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Search sx={{ mr: 1 }} />
            <TextField
              placeholder="Search leads..."
              value={leadSearch}
              onChange={e => setLeadSearch(e.target.value)}
              size="small"
              sx={{ minWidth: 260 }}
            />
          </Box>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Source</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeads.map(lead => (
                  <TableRow key={lead.id} hover sx={{ cursor: 'pointer' }} onClick={() => setSelectedLead(lead)}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={lead.avatarUrl} sx={{ width: 32, height: 32, bgcolor: SECONDARY }}>{lead.name[0]}</Avatar>
                        {lead.name}
                      </Box>
                    </TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell><Chip label={lead.status} size="small" sx={{ bgcolor: '#e0e7ff', color: PRIMARY, fontWeight: 700 }} /></TableCell>
                    <TableCell>{lead.score}</TableCell>
                    <TableCell>{getLeadSource(lead)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Lead Details Modal (only for selected lead) */}
        <Dialog open={!!selectedLead} onClose={() => setSelectedLead(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Lead Details
            <IconButton onClick={() => setSelectedLead(null)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedLead && (
              <Box>
                <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                  <UserProfile profile={getUserProfileData(selectedLead)} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Lead Activities</Typography>
                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Summary</TableCell>
                            <TableCell>Channel</TableCell>
                            <TableCell>Time</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getLeadActivities(selectedLead.id).map(a => (
                            <TableRow key={a.id}>
                              <TableCell>{a.type}</TableCell>
                              <TableCell>{a.summary}</TableCell>
                              <TableCell>{a.channel}</TableCell>
                              <TableCell>{new Date(a.timestamp).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Score Trend</Typography>
                    <ResponsiveContainer width="100%" height={80}>
                      <LineChart data={getLeadScoreTrend(selectedLead.id).map((v, i) => ({ name: `T${i + 1}`, score: v }))}>
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <RechartTooltip />
                        <Line type="monotone" dataKey="score" stroke={SECONDARY} strokeWidth={3} dot />
                      </LineChart>
                    </ResponsiveContainer>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 2 }}>Source Attribution</Typography>
                    <Chip label={getLeadSource(selectedLead)} color="primary" sx={{ fontWeight: 700, fontSize: 15, mt: 1 }} />
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Revenue Modal */}
        <Dialog open={openModal === 'revenue'} onClose={() => { setOpenModal(null); setSelectedUser(null); }} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Revenue
            <IconButton onClick={() => { setOpenModal(null); setSelectedUser(null); }}><Close /></IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedUser ? (
              <Box>
                <UserProfile profile={{
                  name: selectedUser.name,
                  email: selectedUser.email,
                  avatar: selectedUser.avatarUrl,
                  customerSince: '2022',
                  totalOrders: Math.floor(selectedUser.lifetimeValue / 100),
                  totalSpent: selectedUser.lifetimeValue,
                  lastOrder: '2024-06-01',
                  tags: selectedUser.tags,
                  socialLinks: [],
                  segments: [selectedUser.status],
                }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2 }}>Payment History</Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Summary</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getUserPayments(selectedUser.id).map((p, i) => (
                        <TableRow key={i}>
                          <TableCell>{new Date(p.timestamp).toLocaleDateString()}</TableCell>
                          <TableCell>{p.summary}</TableCell>
                          <TableCell>$100</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button variant="outlined" onClick={() => setSelectedUser(null)} sx={{ mt: 2 }}>Back to List</Button>
              </Box>
            ) : (
              <Box>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                  <Tab label="Users" />
                  <Tab label="Revenue Trend" />
                  <Tab label="Breakdown" />
                </Tabs>
                {tab === 0 && (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Plan</TableCell>
                          <TableCell>Lifetime Value</TableCell>
                          <TableCell>Churn Risk</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {seUsers.map(user => (
                          <TableRow key={user.id} hover sx={{ cursor: 'pointer' }} onClick={() => setSelectedUser(user)}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar src={user.avatarUrl} sx={{ width: 32, height: 32, bgcolor: TEAL }}>{user.name[0]}</Avatar>
                                {user.name}
                              </Box>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell><Chip label={user.plan} size="small" sx={{ bgcolor: '#e0e7ff', color: PRIMARY, fontWeight: 700 }} /></TableCell>
                            <TableCell>${user.lifetimeValue}</TableCell>
                            <TableCell><Chip label={user.churnRisk + '%'} size="small" sx={{ bgcolor: '#fde047', color: '#222', fontWeight: 700 }} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                {tab === 1 && (
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={seUsers.map((u, i) => ({ name: u.name, value: u.lifetimeValue }))}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartTooltip />
                      <Line type="monotone" dataKey="value" stroke={TEAL} strokeWidth={3} dot />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                {tab === 2 && (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Plan</TableCell>
                          <TableCell>Users</TableCell>
                          <TableCell>Total Revenue</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {['Pro', 'Basic', 'Starter'].map(plan => (
                          <TableRow key={plan}>
                            <TableCell>{plan}</TableCell>
                            <TableCell>{seUsers.filter(u => u.plan === plan).length}</TableCell>
                            <TableCell>${seUsers.filter(u => u.plan === plan).reduce((sum, u) => sum + u.lifetimeValue, 0)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Workflows Modal */}
        <Dialog open={openModal === 'workflows'} onClose={() => setOpenModal(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Active Workflows
            <IconButton onClick={() => setOpenModal(null)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Steps</TableCell>
                    <TableCell>Users</TableCell>
                    <TableCell>Last Run</TableCell>
                    <TableCell>Success Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workflowList.map(wf => (
                    <TableRow key={wf.id}>
                      <TableCell>{wf.name}</TableCell>
                      <TableCell><Chip label={wf.status} size="small" sx={{ bgcolor: wf.status === 'Active' ? '#4ade80' : '#fde047', color: '#222', fontWeight: 700 }} /></TableCell>
                      <TableCell>{wf.steps}</TableCell>
                      <TableCell>{wf.users}</TableCell>
                      <TableCell>{wf.lastRun}</TableCell>
                      <TableCell>{wf.success}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>

        {/* Conversion Rate Modal */}
        <Dialog open={openModal === 'conversion'} onClose={() => setOpenModal(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Conversion Rate
            <IconButton onClick={() => setOpenModal(null)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Funnel</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <ReBarChart data={funnelData} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="stage" type="category" width={100} />
                  <Bar dataKey="value" fill={SECONDARY} barSize={32} radius={[8, 8, 8, 8]}>
                    <LabelList dataKey="value" position="right" />
                  </Bar>
                  <RechartTooltip />
                </ReBarChart>
              </ResponsiveContainer>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Conversion Events</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Stage</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leads.slice(0, 10).map((lead, i) => (
                    <TableRow key={lead.id}>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{funnelData[Math.min(i, funnelData.length - 1)].stage}</TableCell>
                      <TableCell>{new Date(Date.now() - i * 86400000).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Conversion Rate Trend</Typography>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={churnKPI ? churnKPI.trend.map((v: number, i: number) => ({ name: `T${i + 1}`, value: v })) : []}>
                <XAxis dataKey="name" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <RechartTooltip />
                <Line type="monotone" dataKey="value" stroke={PRIMARY} strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </DialogContent>
        </Dialog>
      </Box>
    </motion.div>
  );
} 