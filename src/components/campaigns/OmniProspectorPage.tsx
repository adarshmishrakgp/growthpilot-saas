// OmniProspectorEnhanced.jsx
// Full ~850 lines React + MUI implementation of AI Lead Generator (OmniProspector)
// Includes: Sidebar, Hero, Tabs, Filters, Lead Cards, Animations, Bulk Actions, Visuals

import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Paper, TextField, Button, Chip, Avatar,
  Select, MenuItem, FormControl, InputLabel, Divider, Snackbar, Alert,
  Drawer, List, ListItem, ListItemIcon, ListItemText, Tabs, Tab, Modal,
  CircularProgress, Tooltip, AppBar, Toolbar, IconButton, Badge,
  Checkbox, Grow, Card, CardContent, CardActions, LinearProgress,
  Switch, FormControlLabel, Collapse, Accordion, AccordionSummary,
  AccordionDetails, SpeedDial, SpeedDialAction, SpeedDialIcon
} from '@mui/material';
import {
  Dashboard, People, Email, Call, Search, Autorenew, StarRate,
  Close, Notifications, Settings, Menu, FilterList, Download,
  Share, Add, Edit, Delete, ExpandMore, Business, Phone,
  LocationOn, Language, LinkedIn, Twitter, Facebook,
  TrendingUp, Analytics, Campaign, Group
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Lead } from '../../types/lead';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

// UI Lead type for local/sample leads
interface UILead {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar?: string;
  tags: string[];
  company: string;
  industry: string;
  employees: string;
  revenue: string;
  website: string;
  linkedIn?: string;
  enriched: boolean;
  score: number;
  lastActivity: string;
  source: string;
  status: string;
  email?: string;
  phone?: string;
}

// Sample lead data
const sampleLeads: UILead[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Tech Solutions Inc',
    title: 'VP of Engineering',
    email: 'john.smith@techsolutions.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    industry: 'Technology',
    employees: '201-500',
    revenue: '$10M - $50M',
    website: 'techsolutions.com',
    linkedIn: 'linkedin.com/in/johnsmith',
    enriched: true,
    score: 95,
    tags: ['Hot Lead', 'Decision Maker'],
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastActivity: '2 hours ago',
    source: 'LinkedIn',
    status: 'New'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Marketing Pro LLC',
    title: 'CMO',
    email: 'sarah.j@marketingpro.com',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    industry: 'Marketing',
    employees: '51-200',
    revenue: '$5M - $10M',
    website: 'marketingpro.com',
    linkedIn: 'linkedin.com/in/sarahjohnson',
    enriched: true,
    score: 88,
    tags: ['Warm Lead', 'Budget Holder'],
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastActivity: '1 day ago',
    source: 'Email Campaign',
    status: 'Contacted'
  },
  {
    id: '3',
    name: 'Michael Chen',
    company: 'Innovation Labs',
    title: 'CTO',
    email: '',
    phone: '',
    location: 'Austin, TX',
    industry: 'Software',
    employees: '11-50',
    revenue: '$1M - $5M',
    website: 'innovationlabs.io',
    linkedIn: '',
    enriched: false,
    score: 72,
    tags: ['Cold Lead'],
    avatar: 'https://i.pravatar.cc/150?img=3',
    lastActivity: '3 days ago',
    source: 'Web Scraping',
    status: 'Uncontacted'
  },
  {
    id: '4',
    name: 'Emily Davis',
    company: 'Global Enterprises',
    title: 'Director of Sales',
    email: 'emily.davis@globalent.com',
    phone: '+1 (555) 456-7890',
    location: 'Chicago, IL',
    industry: 'Enterprise',
    employees: '1001+',
    revenue: '$100M+',
    website: 'globalent.com',
    linkedIn: 'linkedin.com/in/emilydavis',
    enriched: true,
    score: 92,
    tags: ['Hot Lead', 'Enterprise'],
    avatar: 'https://i.pravatar.cc/150?img=4',
    lastActivity: '5 hours ago',
    source: 'Referral',
    status: 'Qualified'
  }
];

// Sidebar Navigation Component
interface SidebarNavProps {
  open: boolean;
  onClose: () => void;
}
const SidebarNav = (props: SidebarNavProps) => {
  const { open, onClose } = props;
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, active: true },
    { text: 'Leads', icon: <People />, badge: 47 },
    { text: 'Campaigns', icon: <Campaign /> },
    { text: 'Analytics', icon: <Analytics /> },
    { text: 'Email', icon: <Email />, badge: 5 },
    { text: 'Calls', icon: <Call /> },
    { text: 'Settings', icon: <Settings /> },
  ];

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          OmniProspector
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={index} selected={item.active}>
            <ListItemIcon>
              {item.badge ? (
                <Badge badgeContent={item.badge} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

// Filters Panel Component
type FiltersState = {
  search: string;
  industry: string;
  companySize: string;
  status: string;
  enrichedOnly: boolean;
};

interface FiltersPanelProps {
  filters: FiltersState;
  onFilterChange: (key: keyof FiltersState, value: string | boolean) => void;
  onClearFilters: () => void;
}
const FiltersPanel = (props: FiltersPanelProps) => {
  const { filters, onFilterChange, onClearFilters } = props;
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterList sx={{ mr: 1 }} />
          Filters
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide' : 'Show'} Filters
        </Button>
      </Box>
      
      <Collapse in={expanded}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              size="small"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'gray' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Industry</InputLabel>
              <Select
                value={filters.industry}
                label="Industry"
                onChange={(e) => onFilterChange('industry', e.target.value)}
              >
                <MenuItem value="">All Industries</MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Software">Software</MenuItem>
                <MenuItem value="Enterprise">Enterprise</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Company Size</InputLabel>
              <Select
                value={filters.companySize}
                label="Company Size"
                onChange={(e) => onFilterChange('companySize', e.target.value)}
              >
                <MenuItem value="">All Sizes</MenuItem>
                <MenuItem value="1-10">1-10 employees</MenuItem>
                <MenuItem value="11-50">11-50 employees</MenuItem>
                <MenuItem value="51-200">51-200 employees</MenuItem>
                <MenuItem value="201-500">201-500 employees</MenuItem>
                <MenuItem value="1001+">1001+ employees</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => onFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <FormControlLabel
            control={
              <Switch
                checked={filters.enrichedOnly}
                onChange={(e) => onFilterChange('enrichedOnly', e.target.checked)}
              />
            }
            label="Enriched leads only"
          />
          <Button variant="outlined" onClick={onClearFilters}>
            Clear Filters
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

// Bulk Action Bar Component
interface BulkActionBarProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
}
const BulkActionBar = (props: BulkActionBarProps) => {
  const { selectedCount, onBulkAction } = props;
  if (selectedCount === 0) return null;

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.main', color: 'white' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body1">
          {selectedCount} lead{selectedCount > 1 ? 's' : ''} selected
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<Email />}
            onClick={() => onBulkAction('email')}
          >
            Email
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<Download />}
            onClick={() => onBulkAction('export')}
          >
            Export
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<Delete />}
            onClick={() => onBulkAction('delete')}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

// Lead Card Component
interface LeadCardProps {
  lead: UILead;
  selected: boolean;
  onSelect: (leadId: string, checked: boolean) => void;
  onAction: (action: string, lead: UILead) => void;
}
const LeadCard = (props: LeadCardProps) => {
  const { lead, selected, onSelect, onAction } = props;
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  return (
    <Grow in timeout={500}>
      <Card sx={{ mb: 2, position: 'relative' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Checkbox
              checked={selected}
              onChange={(e) => onSelect(lead.id, e.target.checked)}
              sx={{ mr: 1, mt: -1 }}
            />
            <Avatar src={lead.avatar} sx={{ mr: 2, width: 56, height: 56 }}>
              {lead.name.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {lead.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {lead.title} at {lead.company}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                {lead.tags.map((tag: string, index: number) => (
                  <Chip key={index} label={tag} size="small" color="primary" variant="outlined" />
                ))}
                <Chip
                  label={lead.enriched ? 'Enriched' : 'Not Enriched'}
                  size="small"
                  color={lead.enriched ? 'success' : 'default'}
                />
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Chip
                label={`${lead.score}%`}
                color={getScoreColor(lead.score)}
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" display="block" color="text.secondary">
                {lead.lastActivity}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {lead.email || 'Not available'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {lead.phone || 'Not available'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">{lead.location}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Business sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">{lead.industry}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Group sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">{lead.employees} employees</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">{lead.revenue}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Collapse in={expanded}>
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Website
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {lead.website}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Source
                  </Typography>
                  <Typography variant="body2">
                    {lead.source}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    LinkedIn
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {lead.linkedIn || 'Not available'}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Status
                  </Typography>
                  <Chip label={lead.status} size="small" variant="outlined" />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            startIcon={<ExpandMore sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />}
          >
            {expanded ? 'Less' : 'More'} Info
          </Button>
          <Box>
            <Tooltip title="Send Email">
              <IconButton size="small" onClick={() => onAction('email', lead)}>
                <Email />
              </IconButton>
            </Tooltip>
            <Tooltip title="Call">
              <IconButton size="small" onClick={() => onAction('call', lead)}>
                <Call />
              </IconButton>
            </Tooltip>
            <Tooltip title="Enrich Data">
              <IconButton size="small" onClick={() => onAction('enrich', lead)}>
                <Autorenew />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onAction('edit', lead)}>
                <Edit />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      </Card>
    </Grow>
  );
};

// Main Component
export default function OmniProspectorEnhanced() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [leads, setLeads] = useState<UILead[]>(sampleLeads);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Filters state
  const [filters, setFilters] = useState<FiltersState>({
    search: '',
    industry: '',
    companySize: '',
    status: '',
    enrichedOnly: false
  });

  // Filter leads based on current filters and tab
  const filteredLeads = leads.filter(lead => {
    // Tab filtering
    if (tabValue === 1 && !lead.enriched) return false;
    if (tabValue === 2 && lead.enriched) return false;

    // Search filter
    if (filters.search && !lead.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !lead.company.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Industry filter
    if (filters.industry && lead.industry !== filters.industry) return false;

    // Company size filter
    if (filters.companySize && lead.employees !== filters.companySize) return false;

    // Status filter
    if (filters.status && lead.status !== filters.status) return false;

    // Enriched only filter
    if (filters.enrichedOnly && !lead.enriched) return false;

    return true;
  });

  const handleFilterChange = (key: keyof FiltersState, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      industry: '',
      companySize: '',
      status: '',
      enrichedOnly: false
    });
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    setSelectedLeads(prev => 
      checked 
        ? [...prev, leadId]
        : prev.filter(id => id !== leadId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedLeads(checked ? filteredLeads.map(lead => lead.id) : []);
  };

  const handleBulkAction = (action: string) => {
    setLoading(true);
    setTimeout(() => {
      setSnackbar({
        open: true,
        message: `${action} completed for selected leads!`,
        severity: 'success',
      });
      setSelectedLeads([]);
      setLoading(false);
    }, 1000);
  };

  const handleLeadAction = (action: string, lead: UILead) => {
    setSnackbar({
      open: true,
      message: `${action} action for ${lead.name}`,
      severity: 'success',
    });
  };

  const handleEnrichLeads = () => {
    setLoading(true);
    setTimeout(() => {
      setLeads(prev => prev.map(lead => 
        !lead.enriched ? { ...lead, enriched: true, score: Math.min(100, lead.score + 10) } : lead
      ));
      setSnackbar({
        open: true,
        message: 'Lead enrichment completed',
        severity: 'success'
      });
      setLoading(false);
    }, 2000);
  };

  const speedDialActions = [
    { icon: <Add />, name: 'Add Lead' },
    { icon: <Download />, name: 'Import Leads' },
    { icon: <Autorenew />, name: 'Enrich All', onClick: handleEnrichLeads },
    { icon: <Share />, name: 'Export Leads' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Sidebar */}
        <SidebarNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
         
          <Box sx={{ p: 3, mt: 8 }}>
            {/* Hero Section */}
            <Paper sx={{ p: 4, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    Welcome to OmniProspector
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    AI-powered lead generation and enrichment platform. Find, enrich, and manage your prospects with intelligent automation.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" color="secondary" startIcon={<Add />}>
                      Generate Leads
                    </Button>
                    <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }}>
                      View Analytics
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                      {leads.length}
                    </Typography>
                    <Typography variant="body1">Total Leads</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(leads.filter(l => l.enriched).length / leads.length) * 100}
                      sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.3)' }}
                    />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      {Math.round((leads.filter(l => l.enriched).length / leads.length) * 100)}% Enriched
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Tabs */}
            <Paper sx={{ mb: 2 }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab label={`All Leads (${leads.length})`} />
                <Tab label={`Enriched (${leads.filter(l => l.enriched).length})`} />
                <Tab label={`Unenriched (${leads.filter(l => !l.enriched).length})`} />
              </Tabs>
            </Paper>

            {/* Filters */}
            <FiltersPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />

            {/* Bulk Actions */}
            <BulkActionBar
              selectedCount={selectedLeads.length}
              onBulkAction={handleBulkAction}
            />

            {/* Select All */}
            {filteredLeads.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedLeads.length === filteredLeads.length}
                      indeterminate={selectedLeads.length > 0 && selectedLeads.length < filteredLeads.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  }
                  label={`Select all ${filteredLeads.length} leads`}
                />
              </Box>
            )}

            {/* Loading */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Lead Cards */}
            <Grid container>
              <Grid item xs={12}>
                {filteredLeads.map(lead => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    selected={selectedLeads.includes(lead.id)}
                    onSelect={handleSelectLead}
                    onAction={handleLeadAction}
                  />
                ))}
                {filteredLeads.length === 0 && !loading && (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      No leads found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Try adjusting your filters or generate new leads
                    </Typography>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Speed Dial */}
        <SpeedDial
          ariaLabel="SpeedDial"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity as 'success' | 'info' | 'warning' | 'error'}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
