import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CampaignIcon from '@mui/icons-material/Campaign';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface LeadScore {
  total: number;
  engagement: number;
  relevance: number;
  intent: number;
}

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  email?: string;
  phone?: string;
  score: LeadScore;
  recentActivity: string[];
  tags: string[];
  lastInteraction: string;
}

const LeadFinderDashboard: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setLeads([
        {
          id: '1',
          name: 'Sarah Chen',
          title: 'CTO',
          company: 'FinTech Solutions GmbH',
          location: 'Berlin, Germany',
          industry: 'Financial Technology',
          linkedinUrl: 'https://linkedin.com/in/sarahchen',
          twitterUrl: 'https://twitter.com/sarahchen',
          email: 'sarah.chen@fintechsolutions.de',
          score: {
            total: 92,
            engagement: 88,
            relevance: 95,
            intent: 93
          },
          recentActivity: [
            'Mentioned "AI compliance" on LinkedIn',
            'Visited pricing page 2 times',
            'Downloaded whitepaper'
          ],
          tags: ['fintech', 'decision-maker', 'high-intent'],
          lastInteraction: '2 days ago'
        },
        // Add more mock leads here
      ]);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1F2937', mb: 1 }}>
          AI Lead Generator
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          Find and engage high-quality leads using AI-powered prospecting
        </Typography>
      </Box>

      {/* Search Section */}
      <Paper sx={{ 
        p: 3, 
        mb: 4,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder='e.g. "CTOs at fintech startups in Berlin who mentioned compliance"'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6366F1' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Advanced Filters">
                      <IconButton>
                        <TuneIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
                sx: {
                  background: 'white',
                  '&:hover': {
                    background: 'white',
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                icon={<WorkIcon />} 
                label="Fintech" 
                onDelete={() => {}}
                sx={{ background: 'white' }}
              />
              <Chip 
                icon={<LocationOnIcon />} 
                label="Berlin" 
                onDelete={() => {}}
                sx={{ background: 'white' }}
              />
              <Chip 
                icon={<AutoAwesomeIcon />} 
                label="Mentioned: compliance" 
                onDelete={() => {}}
                sx={{ background: 'white' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={isSearching}
              startIcon={isSearching ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
              sx={{
                background: 'linear-gradient(45deg, #6366F1 0%, #8B5CF6 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5558E8 0%, #7C4DEF 100%)',
                }
              }}
            >
              {isSearching ? 'Searching...' : 'Find Leads with AI'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Section */}
      {leads.length > 0 && (
        <Grid container spacing={3}>
          {leads.map((lead) => (
            <Grid item xs={12} md={6} lg={4} key={lead.id}>
              <Paper sx={{
                p: 2,
                height: '100%',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                }
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937' }}>
                      {lead.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      {lead.title} at {lead.company}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: 'rgba(99,102,241,0.1)',
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h6" sx={{ color: '#6366F1', fontWeight: 700 }}>
                      {lead.score.total}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#4B5563', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOnIcon fontSize="small" />
                    {lead.location}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4B5563', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon fontSize="small" />
                    {lead.industry}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#374151', mb: 1, fontWeight: 600 }}>
                    Recent Activity
                  </Typography>
                  {lead.recentActivity.map((activity, index) => (
                    <Typography key={index} variant="body2" sx={{ 
                      color: '#6B7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 0.5
                    }}>
                      <TrendingUpIcon fontSize="small" sx={{ color: '#6366F1' }} />
                      {activity}
                    </Typography>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {lead.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        background: 'rgba(99,102,241,0.1)',
                        color: '#6366F1',
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    sx={{
                      flex: 1,
                      background: '#6366F1',
                      '&:hover': {
                        background: '#4F46E5'
                      }
                    }}
                  >
                    Add to CRM
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CampaignIcon />}
                    sx={{
                      flex: 1,
                      borderColor: '#6366F1',
                      color: '#6366F1',
                      '&:hover': {
                        borderColor: '#4F46E5',
                        background: 'rgba(99,102,241,0.05)'
                      }
                    }}
                  >
                    Start Campaign
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default LeadFinderDashboard; 