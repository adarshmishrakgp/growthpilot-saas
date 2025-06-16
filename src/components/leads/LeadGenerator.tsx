import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import {
  Search as SearchIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  score: number;
  source: 'linkedin' | 'twitter' | 'website';
  recentActivity: string[];
  contactInfo: {
    email?: string;
    phone?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Energy',
];

const LeadGenerator: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mock data for demonstration
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'John Smith',
      title: 'CTO',
      company: 'TechCorp',
      industry: 'Technology',
      location: 'Berlin',
      score: 85,
      source: 'linkedin',
      recentActivity: [
        'Posted about AI implementation',
        'Commented on cloud security',
        'Shared article about fintech',
      ],
      contactInfo: {
        email: 'john@techcorp.com',
        linkedin: 'linkedin.com/in/johnsmith',
      },
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      title: 'Head of Product',
      company: 'FinTech Solutions',
      industry: 'Finance',
      location: 'London',
      score: 92,
      source: 'twitter',
      recentActivity: [
        'Tweeted about blockchain',
        'Engaged with fintech content',
        'Followed crypto accounts',
      ],
      contactInfo: {
        email: 'sarah@fintechsolutions.com',
        twitter: '@sarahj',
      },
    },
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Here we would integrate with actual lead generation APIs
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLeads(mockLeads);
    } catch (error) {
      console.error('Error searching for leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setDialogOpen(true);
  };

  const getSourceIcon = (source: Lead['source']) => {
    switch (source) {
      case 'linkedin':
        return <LinkedInIcon />;
      case 'twitter':
        return <TwitterIcon />;
      case 'website':
        return <LanguageIcon />;
      default:
        return <LanguageIcon />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'warning';
    return 'error';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          AI Lead Generator
        </Typography>

        {/* Search Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Leads"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., CTOs at fintech startups in Berlin"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={industries}
                value={selectedIndustry}
                onChange={(_, newValue) => setSelectedIndustry(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Industry" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Section */}
        <Grid container spacing={2}>
          {leads.map((lead) => (
            <Grid item xs={12} md={6} key={lead.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon />
                      <Typography variant="h6">{lead.name}</Typography>
                    </Box>
                    <Chip
                      icon={getSourceIcon(lead.source)}
                      label={lead.source}
                      size="small"
                    />
                  </Box>
                  <Typography color="text.secondary" gutterBottom>
                    {lead.title} at {lead.company}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      icon={<BusinessIcon />}
                      label={lead.industry}
                      size="small"
                    />
                    <Chip
                      icon={<LanguageIcon />}
                      label={lead.location}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Lead Score:</Typography>
                    <Chip
                      icon={lead.score >= 80 ? <StarIcon /> : <StarBorderIcon />}
                      label={lead.score}
                      color={getScoreColor(lead.score)}
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleLeadClick(lead)}>
                    View Details
                  </Button>
                  <Button size="small" color="primary">
                    Add to Campaign
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Lead Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedLead && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  {selectedLead.name}
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Contact Information</Typography>
                    {selectedLead.contactInfo.email && (
                      <Typography>Email: {selectedLead.contactInfo.email}</Typography>
                    )}
                    {selectedLead.contactInfo.phone && (
                      <Typography>Phone: {selectedLead.contactInfo.phone}</Typography>
                    )}
                    {selectedLead.contactInfo.linkedin && (
                      <Typography>LinkedIn: {selectedLead.contactInfo.linkedin}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Recent Activity</Typography>
                    {selectedLead.recentActivity.map((activity, index) => (
                      <Typography key={index} variant="body2">
                        • {activity}
                      </Typography>
                    ))}
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
                <Button variant="contained" color="primary">
                  Start Campaign
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default LeadGenerator; 