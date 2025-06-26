import React, { useState } from 'react';
import { Card, CardContent, Button, TextField, Tooltip, Box, Typography, Divider, Dialog, DialogTitle, DialogContent, IconButton, Collapse, List, ListItem, ListItemText, Paper } from '@mui/material';
import { ExpandMore, Close, BarChartRounded } from '@mui/icons-material';
import {
  Bell,
  Users,
  TrendingUp,
  Activity,
  Calendar,
  MessageSquare,
  Zap,
  Phone,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip as RechartTooltip, ResponsiveContainer } from 'recharts';

const inboxData = [
  { name: 'Sarah M.', message: 'Hey! Can I get the brochure?', channel: 'WhatsApp', seen: false, conversation: [
    { from: 'Sarah M.', text: 'Hey! Can I get the brochure?', seen: false },
    { from: 'You', text: 'Sure! Sending it now.', seen: true },
  ] },
  { name: 'David P.', message: 'Interested in your pricing.', channel: 'Instagram', seen: true, conversation: [
    { from: 'David P.', text: 'Interested in your pricing.', seen: true },
    { from: 'You', text: 'Here is our pricing page.', seen: true },
  ] },
  { name: 'Aria J.', message: 'Support needed with login.', channel: 'Email', seen: false, conversation: [
    { from: 'Aria J.', text: 'Support needed with login.', seen: false },
    { from: 'You', text: 'Can you share the error screenshot?', seen: true },
  ] },
];

const newLeads = [
  { name: 'John Doe', email: 'john@finstack.com', company: 'FinStack', status: 'New', score: 92 },
  { name: 'Emily Carter', email: 'emily@wealthtech.io', company: 'WealthTech', status: 'New', score: 88 },
  { name: 'Mike Ray', email: 'mike@blockops.com', company: 'BlockOps', status: 'New', score: 76 },
];

const weekStats = [
  { name: 'Mon', leads: 24 },
  { name: 'Tue', leads: 32 },
  { name: 'Wed', leads: 19 },
  { name: 'Thu', leads: 45 },
  { name: 'Fri', leads: 51 },
  { name: 'Sat', leads: 38 },
  { name: 'Sun', leads: 29 },
];

const monthStats = Array.from({ length: 30 }, (_, i) => ({ name: `Day ${i + 1}`, leads: Math.floor(20 + Math.random() * 40) }));

const yearStats = [
  { name: 'Jan', leads: 320 },
  { name: 'Feb', leads: 280 },
  { name: 'Mar', leads: 350 },
  { name: 'Apr', leads: 400 },
  { name: 'May', leads: 420 },
  { name: 'Jun', leads: 390 },
  { name: 'Jul', leads: 410 },
  { name: 'Aug', leads: 430 },
  { name: 'Sep', leads: 370 },
  { name: 'Oct', leads: 450 },
  { name: 'Nov', leads: 470 },
  { name: 'Dec', leads: 490 },
];

const campaigns = [
  { name: 'Welcome Email Series', open: 78, click: 34, users: [
    { name: 'John Doe', action: 'Opened', pdf: true },
    { name: 'Emily Carter', action: 'Clicked', pdf: false },
    { name: 'Mike Ray', action: 'Viewed', pdf: true },
  ] },
  { name: 'WhatsApp Offers', open: 66, click: 44, users: [
    { name: 'Sarah M.', action: 'Opened', pdf: false },
    { name: 'David P.', action: 'Clicked', pdf: false },
  ] },
  { name: 'LinkedIn InMail', open: 52, click: 27, users: [
    { name: 'Aria J.', action: 'Viewed', pdf: false },
  ] },
];

const topLeads = [
  { name: 'John Doe', score: 92, company: 'FinStack', email: 'john@finstack.com', why: 'High engagement, recent activity, large deal size.' },
  { name: 'Emily Carter', score: 88, company: 'WealthTech', email: 'emily@wealthtech.io', why: 'Consistent opens, replied to campaigns, high intent.' },
  { name: 'Mike Ray', score: 76, company: 'BlockOps', email: 'mike@blockops.com', why: 'Multiple touchpoints, positive replies, good fit.' },
];

const PRIMARY = '#234567';
const SECONDARY = '#6C63FF';
const TEAL = '#00B8A9';
const BORDER = '#E0E6ED';
const TEXT = '#222';
const TEXT_SECONDARY = '#666';

export default function InteractiveDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openLeads, setOpenLeads] = useState(false);
  const [openInbox, setOpenInbox] = useState<number | null>(null);
  const [openCampaign, setOpenCampaign] = useState<number | null>(null);
  const [expandedLead, setExpandedLead] = useState<number | null>(null);
  const [graphType, setGraphType] = useState<'line' | 'area'>('line');
  const [range, setRange] = useState<'week' | 'month' | 'year'>('week');

  let chartData = weekStats;
  let xLabel = 'Day of Week';
  if (range === 'month') {
    chartData = monthStats;
    xLabel = 'Day of Month';
  } else if (range === 'year') {
    chartData = yearStats;
    xLabel = 'Month';
  }

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 2, md: 6 }, background: '#fff', fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, color: TEXT, mb: 1, letterSpacing: 1.5 }}>🧭 GrowthPilot Control Dashboard</Typography>
          <Typography sx={{ color: TEXT_SECONDARY, fontSize: 20, fontWeight: 500 }}>Monitor. Engage. Automate. All in one place.</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <TextField
            placeholder="Search leads, campaigns..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ background: '#f5f7fa', borderRadius: 2, input: { color: TEXT, fontWeight: 600 }, minWidth: 260, border: `1px solid ${BORDER}` }}
          />
          <Tooltip title="Notifications">
            <Button variant="contained" sx={{ minWidth: 48, minHeight: 48, borderRadius: '50%', background: SECONDARY, color: '#fff', boxShadow: '0 2px 12px #6C63FF22', p: 0, '&:hover': { background: PRIMARY } }}>
              <Bell style={{ color: '#fff', width: 28, height: 28 }} />
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Top Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 4, mb: 8 }}>
        {/* New Leads Card (clickable) */}
        <Card onClick={() => setOpenLeads(true)} sx={{ cursor: 'pointer', background: '#fff', border: `2px solid ${PRIMARY}`, borderRadius: 5, boxShadow: `0 4px 24px ${PRIMARY}11`, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.045)', boxShadow: `0 8px 40px ${PRIMARY}22` } }}>
          <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ color: TEXT_SECONDARY, fontWeight: 700, fontSize: 18 }}>New Leads</Typography>
              <Typography sx={{ fontSize: 36, fontWeight: 900, color: PRIMARY }}>+124</Typography>
            </Box>
            <Users style={{ color: PRIMARY, width: 48, height: 48 }} />
          </CardContent>
        </Card>
        {/* Other Stats */}
        {[
          { label: 'Revenue', value: '₹94,300', icon: TrendingUp, color: SECONDARY },
          { label: 'AI Replies', value: '233', icon: Activity, color: TEAL },
          { label: 'Meetings Booked', value: '17', icon: Calendar, color: PRIMARY },
        ].map((item, i) => (
          <Card key={i} sx={{ background: '#fff', border: `2px solid ${item.color}`, borderRadius: 5, boxShadow: `0 4px 24px ${item.color}11`, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.045)', boxShadow: `0 8px 40px ${item.color}22` } }}>
            <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ color: TEXT_SECONDARY, fontWeight: 700, fontSize: 18 }}>{item.label}</Typography>
                <Typography sx={{ fontSize: 36, fontWeight: 900, color: item.color }}>{item.value}</Typography>
              </Box>
              <item.icon style={{ color: item.color, width: 48, height: 48 }} />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Inbox + Chart */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 6, mb: 10, mt: 6 }}>
        {/* Modern Graph Card */}
        <Box
          sx={{
            background: 'rgba(255,255,255,0.85)',
            borderRadius: 5,
            boxShadow: '0 8px 32px 0 rgba(44,62,80,0.10)',
            border: '2px solid',
            borderImage: 'linear-gradient(90deg, #6C63FF 0%, #00B8A9 100%) 1',
            backdropFilter: 'blur(8px)',
            p: { xs: 2, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
            minWidth: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <BarChartRounded sx={{ fontSize: 36, mr: 1, color: 'url(#graphTitleGradient)' }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                fontSize: 28,
                background: 'linear-gradient(90deg, #6C63FF 0%, #00B8A9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: 1,
                mr: 1,
              }}
              component="span"
            >
              Leads Trend
            </Typography>
            <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant={range === 'week' ? 'contained' : 'outlined'}
                sx={{ fontWeight: 700, borderRadius: 2, minWidth: 60, color: range === 'week' ? '#fff' : SECONDARY, background: range === 'week' ? SECONDARY : '#fff', borderColor: SECONDARY, boxShadow: range === 'week' ? '0 2px 8px #6C63FF22' : undefined }}
                onClick={() => setRange('week')}
              >
                Week
              </Button>
              <Button
                size="small"
                variant={range === 'month' ? 'contained' : 'outlined'}
                sx={{ fontWeight: 700, borderRadius: 2, minWidth: 60, color: range === 'month' ? '#fff' : SECONDARY, background: range === 'month' ? SECONDARY : '#fff', borderColor: SECONDARY, boxShadow: range === 'month' ? '0 2px 8px #6C63FF22' : undefined }}
                onClick={() => setRange('month')}
              >
                Month
              </Button>
              <Button
                size="small"
                variant={range === 'year' ? 'contained' : 'outlined'}
                sx={{ fontWeight: 700, borderRadius: 2, minWidth: 60, color: range === 'year' ? '#fff' : SECONDARY, background: range === 'year' ? SECONDARY : '#fff', borderColor: SECONDARY, boxShadow: range === 'year' ? '0 2px 8px #6C63FF22' : undefined }}
                onClick={() => setRange('year')}
              >
                Year
              </Button>
            </Box>
            <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant={graphType === 'line' ? 'contained' : 'outlined'}
                sx={{ fontWeight: 700, borderRadius: 2, minWidth: 60, color: graphType === 'line' ? '#fff' : PRIMARY, background: graphType === 'line' ? PRIMARY : '#fff', borderColor: PRIMARY, boxShadow: graphType === 'line' ? '0 2px 8px #23456722' : undefined }}
                onClick={() => setGraphType('line')}
              >
                Line
              </Button>
              <Button
                size="small"
                variant={graphType === 'area' ? 'contained' : 'outlined'}
                sx={{ fontWeight: 700, borderRadius: 2, minWidth: 60, color: graphType === 'area' ? '#fff' : PRIMARY, background: graphType === 'area' ? PRIMARY : '#fff', borderColor: PRIMARY, boxShadow: graphType === 'area' ? '0 2px 8px #23456722' : undefined }}
                onClick={() => setGraphType('area')}
              >
                Area
              </Button>
            </Box>
          </Box>
          <Typography sx={{ color: TEXT_SECONDARY, mb: 3, fontSize: 15 }}>
            Track your lead growth over the {range}. Analyze trends and optimize your campaigns for better results.
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            {graphType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 60, right: 30, left: 30, bottom: 40 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6C63FF" />
                    <stop offset="100%" stopColor="#00B8A9" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#00B8A9" stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="graphTitleGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6C63FF" />
                    <stop offset="100%" stopColor="#00B8A9" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke={BORDER}
                  tick={{ fill: TEXT_SECONDARY, fontWeight: 700, fontSize: 15 }}
                  label={{ value: xLabel, position: 'bottom', offset: 20, fill: TEXT_SECONDARY, fontWeight: 900, fontSize: 16 }}
                  axisLine={{ stroke: BORDER }}
                  tickLine={false}
                />
                <YAxis
                  stroke={BORDER}
                  tick={{ fill: TEXT_SECONDARY, fontWeight: 700, fontSize: 15 }}
                  label={{ value: ' # Leads', angle: -90, position: 'insideLeft', offset: 10, fill: TEXT_SECONDARY, fontWeight: 900, fontSize: 16 }}
                  axisLine={{ stroke: BORDER }}
                  tickLine={false}
                />
                <RechartTooltip
                  contentStyle={{ background: '#fff', border: `1.5px solid #6C63FF`, borderRadius: 12, boxShadow: '0 2px 12px #6C63FF22', color: TEXT, fontWeight: 700 }}
                  labelStyle={{ color: SECONDARY, fontWeight: 900 }}
                  itemStyle={{ color: PRIMARY, fontWeight: 700 }}
                  cursor={{ stroke: SECONDARY, strokeWidth: 2, opacity: 0.15 }}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="url(#lineGradient)"
                  strokeWidth={4}
                  dot={{ r: 7, fill: '#fff', stroke: 'url(#lineGradient)', strokeWidth: 4, filter: 'drop-shadow(0 0 8px #6C63FF88)' }}
                  activeDot={{ r: 10, fill: '#fff', stroke: 'url(#lineGradient)', strokeWidth: 5, filter: 'drop-shadow(0 0 12px #00B8A988)' }}
                  isAnimationActive={true}
                  animationDuration={1200}
                />
              </LineChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 60, right: 30, left: 30, bottom: 40 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6C63FF" />
                    <stop offset="100%" stopColor="#00B8A9" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#00B8A9" stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="graphTitleGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6C63FF" />
                    <stop offset="100%" stopColor="#00B8A9" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke={BORDER}
                  tick={{ fill: TEXT_SECONDARY, fontWeight: 700, fontSize: 15 }}
                  label={{ value: xLabel, position: 'bottom', offset: 20, fill: TEXT_SECONDARY, fontWeight: 900, fontSize: 16 }}
                  axisLine={{ stroke: BORDER }}
                  tickLine={false}
                />
                <YAxis
                  stroke={BORDER}
                  tick={{ fill: TEXT_SECONDARY, fontWeight: 700, fontSize: 15 }}
                  label={{ value: ' # Leads', angle: -90, position: 'insideLeft', offset: 10, fill: TEXT_SECONDARY, fontWeight: 900, fontSize: 16 }}
                  axisLine={{ stroke: BORDER }}
                  tickLine={false}
                />
                <RechartTooltip
                  contentStyle={{ background: '#fff', border: `1.5px solid #6C63FF`, borderRadius: 12, boxShadow: '0 2px 12px #6C63FF22', color: TEXT, fontWeight: 700 }}
                  labelStyle={{ color: SECONDARY, fontWeight: 900 }}
                  itemStyle={{ color: PRIMARY, fontWeight: 700 }}
                  cursor={{ stroke: SECONDARY, strokeWidth: 2, opacity: 0.15 }}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="url(#lineGradient)"
                  fill="url(#areaGradient)"
                  strokeWidth={4}
                  dot={{ r: 7, fill: '#fff', stroke: 'url(#lineGradient)', strokeWidth: 4, filter: 'drop-shadow(0 0 8px #6C63FF88)' }}
                  activeDot={{ r: 10, fill: '#fff', stroke: 'url(#lineGradient)', strokeWidth: 5, filter: 'drop-shadow(0 0 12px #00B8A988)' }}
                  isAnimationActive={true}
                  animationDuration={1200}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </Box>
        <Card sx={{ background: '#fff', border: `2px solid ${SECONDARY}`, borderRadius: 5, boxShadow: `0 4px 24px ${SECONDARY}11`, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.025)', boxShadow: `0 8px 40px ${SECONDARY}22` } }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: SECONDARY, mb: 2, letterSpacing: 1 }}>📥 Inbox Preview</Typography>
            {inboxData.map((msg, i) => (
              <Box key={i} onClick={() => setOpenInbox(i)} sx={{ mb: 3, borderBottom: `1px solid ${BORDER}`, pb: 2, cursor: 'pointer', '&:hover': { background: '#f5f7fa' } }}>
                <Typography sx={{ fontWeight: msg.seen ? 500 : 900, color: msg.seen ? TEXT : SECONDARY, fontSize: 18 }}>{msg.name}</Typography>
                <Typography sx={{ fontWeight: msg.seen ? 400 : 700, color: msg.seen ? TEXT_SECONDARY : TEXT, fontSize: 15 }}>{msg.message}</Typography>
                <Box sx={{ fontSize: 13, color: TEAL, background: '#e6f7f7', borderRadius: 2, px: 1.5, py: 0.5, mt: 1, display: 'inline-block', fontWeight: 700 }}>{msg.channel}</Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>

      {/* Campaign Performance */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 900, color: PRIMARY, mb: 4, letterSpacing: 1 }}>📣 Campaign Stats</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {campaigns.map((c, i) => (
            <Card key={i} onClick={() => setOpenCampaign(i)} sx={{ cursor: 'pointer', background: '#fff', border: `2px solid ${SECONDARY}`, borderRadius: 5, boxShadow: `0 4px 24px ${SECONDARY}11`, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.035)', boxShadow: `0 8px 40px ${SECONDARY}22` } }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: SECONDARY, fontSize: 20, mb: 1 }}>{c.name}</Typography>
                    <Typography sx={{ color: TEXT_SECONDARY, fontSize: 15 }}>Open: {c.open}% · Click: {c.click}%</Typography>
                  </Box>
                  <ExternalLink style={{ width: 28, height: 28, color: TEAL, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Top Leads */}
      <Box sx={{ mb: 4, mt: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: SECONDARY, mb: 4, letterSpacing: 1 }}>👑 Top Leads</Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 4,
        }}>
          {topLeads.map((lead, i) => (
            <Card key={i} sx={{ background: '#fff', border: `2px solid ${PRIMARY}`, borderRadius: 5, p: 3, boxShadow: `0 4px 24px ${PRIMARY}11`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: PRIMARY, fontSize: 20 }}>{lead.name}</Typography>
                  <Typography sx={{ color: TEXT_SECONDARY, fontSize: 15 }}>{lead.email} · {lead.company}</Typography>
                </Box>
                <Box sx={{ color: SECONDARY, fontWeight: 900, fontSize: 28, ml: 2 }}>{lead.score}</Box>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Button
                  size="small"
                  endIcon={<ExpandMore />}
                  onClick={() => setExpandedLead(expandedLead === i ? null : i)}
                  sx={{ color: SECONDARY, fontWeight: 700, textTransform: 'none', fontSize: 15 }}
                >
                  Why Top Lead?
                </Button>
                <Collapse in={expandedLead === i}>
                  <Typography sx={{ color: TEXT, fontSize: 15, mt: 1, mb: 1 }}>{lead.why}</Typography>
                </Collapse>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>

      {/* --- MODALS & DRAWERS --- */}
      {/* New Leads Modal */}
      <Dialog open={openLeads} onClose={() => setOpenLeads(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          New Leads
          <IconButton onClick={() => setOpenLeads(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            {newLeads.map((lead, i) => (
              <ListItem key={i} divider>
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 700 }}>{lead.name}</Typography>}
                  secondary={<>
                    <Typography component="span" sx={{ color: TEXT_SECONDARY }}>{lead.email}</Typography> · <Typography component="span" sx={{ color: TEXT_SECONDARY }}>{lead.company}</Typography>
                  </>}
                />
                <Typography sx={{ color: PRIMARY, fontWeight: 900 }}>{lead.score}</Typography>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Inbox Conversation Modal */}
      <Dialog open={openInbox !== null} onClose={() => setOpenInbox(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Conversation
          <IconButton onClick={() => setOpenInbox(null)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          {openInbox !== null && (
            <List>
              {inboxData[openInbox].conversation.map((msg, idx) => (
                <ListItem key={idx}>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: msg.seen ? 500 : 900 }}>{msg.from}</Typography>}
                    secondary={<Typography sx={{ fontWeight: msg.seen ? 400 : 700 }}>{msg.text}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>

      {/* Campaign Details Modal */}
      <Dialog open={openCampaign !== null} onClose={() => setOpenCampaign(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Campaign Details
          <IconButton onClick={() => setOpenCampaign(null)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          {openCampaign !== null && (
            <List>
              {campaigns[openCampaign].users.map((user, idx) => (
                <ListItem key={idx} divider>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>}
                    secondary={<>
                      <Typography component="span" sx={{ color: TEXT_SECONDARY }}>{user.action}</Typography>
                      {user.pdf && <Typography component="span" sx={{ color: TEAL, ml: 1 }}>(Opened Brochure/PDF)</Typography>}
                    </>}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
