import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Menu,
  MenuItem,
  Divider,
  LinearProgress,
  Avatar,
  Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface LeadScore {
  total: number;
  websiteVisits: number;
  contentEngagement: number;
  socialMentions: number;
  companyFit: number;
}

interface LeadEnrichment {
  email: string;
  phone?: string;
  company: {
    name: string;
    size: string;
    funding: string;
    website: string;
  };
  social: {
    linkedin?: string;
    twitter?: string;
  };
}

interface Lead {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar?: string;
  score: LeadScore;
  enrichment: LeadEnrichment;
  segment: 'Hot' | 'Warm' | 'Nurture' | 'Archive';
  lastAction?: {
    type: 'email' | 'whatsapp' | 'call';
    date: string;
    status: 'pending' | 'completed' | 'failed';
  };
  tags: string[];
  stage: string;
}

const AdvancedProspector: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'CTO',
      location: 'Berlin, Germany',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      score: {
        total: 85,
        websiteVisits: 90,
        contentEngagement: 85,
        socialMentions: 80,
        companyFit: 85
      },
      enrichment: {
        email: 'sarah.chen@fintechco.de',
        company: {
          name: 'FinTech Solutions GmbH',
          size: '50-100',
          funding: 'Series A',
          website: 'fintechco.de'
        },
        social: {
          linkedin: 'linkedin.com/in/sarahchen',
          twitter: 'twitter.com/sarahchen'
        }
      },
      segment: 'Hot',
      lastAction: {
        type: 'email',
        date: '2024-03-20',
        status: 'completed'
      },
      tags: ['compliance', 'regtech', 'decision-maker'],
      stage: 'Engaged'
    }
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    segment: [] as string[],
    score: [] as string[],
    tags: [] as string[]
  });

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, leadId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedLead(leadId);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedLead(null);
  };

  const handleAction = async (action: 'email' | 'whatsapp' | 'call') => {
    if (!selectedLead) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLeads(leads.map(lead => {
      if (lead.id === selectedLead) {
        return {
          ...lead,
          lastAction: {
            type: action,
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
          }
        };
      }
      return lead;
    }));
    
    setIsLoading(false);
    handleActionClose();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#6366F1';
    return '#6B7280';
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Hot': return '#EF4444';
      case 'Warm': return '#F59E0B';
      case 'Nurture': return '#6366F1';
      default: return '#6B7280';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1F2937', mb: 1 }}>
          OmniProspector Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          AI-powered lead prospecting and engagement for Berlin-based fintech CTOs
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{
        p: 3,
        mb: 3,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search leads by name, company, or tags..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6B7280' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={{
                  borderColor: '#6366F1',
                  color: '#6366F1'
                }}
              >
                Filters
              </Button>
              <Button
                variant="contained"
                startIcon={<AutoAwesomeIcon />}
                sx={{
                  background: 'linear-gradient(45deg, #6366F1 0%, #8B5CF6 100%)'
                }}
              >
                Start Prospecting
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Active Filters */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Chip
            label="Score > 80"
            onDelete={() => {}}
            sx={{ background: 'white' }}
          />
          <Chip
            label="Berlin"
            onDelete={() => {}}
            sx={{ background: 'white' }}
          />
          <Chip
            label="Mentioned: compliance"
            onDelete={() => {}}
            sx={{ background: 'white' }}
          />
        </Box>
      </Paper>

      {/* Leads Table */}
      <TableContainer component={Paper} sx={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        mb: 3
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Lead</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Segment</TableCell>
              <TableCell>Last Action</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} sx={{
                '&:hover': {
                  background: 'rgba(99,102,241,0.05)'
                }
              }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={lead.avatar} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#1F2937', fontWeight: 600 }}>
                        {lead.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        {lead.title} • {lead.enrichment.company.name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: getScoreColor(lead.score.total),
                        fontWeight: 600
                      }}
                    >
                      {lead.score.total}
                    </Typography>
                    <Tooltip title="View Score Breakdown">
                      <IconButton size="small">
                        <TrendingUpIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={lead.segment}
                    size="small"
                    sx={{
                      background: `${getSegmentColor(lead.segment)}20`,
                      color: getSegmentColor(lead.segment),
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>
                  {lead.lastAction ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {lead.lastAction.type === 'email' && <EmailIcon sx={{ fontSize: 16, color: '#6B7280' }} />}
                      {lead.lastAction.type === 'whatsapp' && <WhatsAppIcon sx={{ fontSize: 16, color: '#6B7280' }} />}
                      {lead.lastAction.type === 'call' && <PhoneIcon sx={{ fontSize: 16, color: '#6B7280' }} />}
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        {lead.lastAction.date}
                      </Typography>
                      {lead.lastAction.status === 'completed' && (
                        <CheckCircleIcon sx={{ fontSize: 16, color: '#10B981' }} />
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      No actions yet
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {lead.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          background: 'rgba(99,102,241,0.1)',
                          color: '#6366F1',
                          fontWeight: 500
                        }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#1F2937' }}>
                    {lead.stage}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => handleActionClick(e, lead.id)}
                    disabled={isLoading}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={100}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleAction('email')} disabled={isLoading}>
          <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
          Send Email Sequence
        </MenuItem>
        <MenuItem onClick={() => handleAction('whatsapp')} disabled={isLoading}>
          <WhatsAppIcon sx={{ mr: 1, fontSize: 20 }} />
          Send WhatsApp Message
        </MenuItem>
        <MenuItem onClick={() => handleAction('call')} disabled={isLoading}>
          <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
          Schedule AI Call
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleActionClose}>
          <PersonAddIcon sx={{ mr: 1, fontSize: 20 }} />
          Push to CRM
        </MenuItem>
      </Menu>

      {/* Lead Details Drawer - To be implemented */}
    </Box>
  );
};

export default AdvancedProspector;