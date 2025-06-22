import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Stack, LinearProgress, Avatar } from '@mui/material';
import { SuccessKPI, Segment, User } from './types';

// Simple SVG sparkline generator
function Sparkline({ data, color = '#6366f1' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / (max - min || 1)) * 100}`).join(' ');
  return (
    <svg width="60" height="20" viewBox="0 0 100 100">
      <polyline fill="none" stroke={color} strokeWidth="6" points={points} />
    </svg>
  );
}

interface AdminDashboardProps {
  kpis: SuccessKPI[];
  segments: Segment[];
  users: User[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ kpis, segments, users }) => {
  // Segment performance
  const segmentCounts = segments.map(seg => ({
    ...seg,
    count: users.filter(u => {
      if (seg.name === 'Active') return u.status === 'active';
      if (seg.name === 'At Risk') return u.status === 'at_risk';
      if (seg.name === 'Likely to Churn') return u.status === 'likely_churn';
      return false;
    }).length,
  }));
  // High-risk users
  const highRiskUsers = users.filter(u => u.churnRisk >= 80);

  return (
    <Card sx={{ minWidth: 320, maxWidth: 400, borderRadius: 4, boxShadow: '0 4px 24px #6366f122', bgcolor: '#fff', p: 2 }}>
      <CardContent>
        <Typography fontWeight={700} fontSize={17} mb={2}>Admin Dashboard</Typography>
        <Stack direction="row" spacing={2} mb={2}>
          {kpis.map(kpi => (
            <Box key={kpi.id} sx={{ p: 2, borderRadius: 3, bgcolor: '#f3f4f6', minWidth: 90, textAlign: 'center', boxShadow: '0 2px 8px #6366f122' }}>
              <Typography fontWeight={700} fontSize={15}>{kpi.label}</Typography>
              <Typography fontWeight={800} fontSize={22} color="#6366f1">{kpi.value}</Typography>
              <Sparkline data={kpi.trend} />
            </Box>
          ))}
        </Stack>
        <Typography fontWeight={600} fontSize={15} mb={1}>Segment Performance</Typography>
        <Stack direction="row" spacing={1} mb={2}>
          {segmentCounts.map(seg => (
            <Chip key={seg.id} label={`${seg.icon} ${seg.name}: ${seg.count}`} sx={{ bgcolor: seg.color, color: '#222', fontWeight: 700 }} />
          ))}
        </Stack>
        <Typography fontWeight={600} fontSize={15} mb={1}>Alert Center</Typography>
        <Stack spacing={1}>
          {highRiskUsers.length === 0 && <Typography color="text.secondary">No high-risk users 🎉</Typography>}
          {highRiskUsers.map(u => (
            <Box key={u.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 2, bgcolor: '#f472b622' }}>
              <Avatar sx={{ bgcolor: '#f472b6', color: '#fff', width: 28, height: 28 }}>{u.name[0]}</Avatar>
              <Typography fontWeight={700}>{u.name}</Typography>
              <Chip label={`Churn Risk: ${u.churnRisk}%`} sx={{ bgcolor: '#f472b6', color: '#fff', fontWeight: 700 }} />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard; 