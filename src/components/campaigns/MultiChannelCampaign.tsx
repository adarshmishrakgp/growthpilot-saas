import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Stack,
  Badge,
  CircularProgress,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  RadioGroup,
  Radio,
  Menu,
} from '@mui/material';
import {
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  LinkedIn as LinkedInIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  Schedule as ScheduleIcon,
  Psychology as PsychologyIcon,
  AutoGraph as AutoGraphIcon,
  CalendarMonth as CalendarIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  CheckCircle,
  Error,
  Info,
  SmartToy,
  AssignmentInd as AssignmentIndIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  initialChannels,
  initialTriggers,
  campaignAnalytics,
  Channel,
  Trigger,
  Template
} from './data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface CampaignStep {
  id: string;
  type: 'email' | 'whatsapp' | 'linkedin' | 'sms' | 'tiktok' | 'wait' | 'condition';
  content?: string;
  delay?: number;
  condition?: {
    type: 'opened' | 'clicked' | 'replied' | 'no_response';
    value: string;
  };
}

interface CampaignStats {
  sent: number;
  opened: number;
  replied: number;
  meetings: number;
  converted: number;
}

const MultiChannelCampaign: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [triggers, setTriggers] = useState<Trigger[]>(initialTriggers);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [isTriggerDialogOpen, setIsTriggerDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [campaignName, setCampaignName] = useState('Q4 Enterprise Outreach');
  const [campaignStatus, setCampaignStatus] = useState<'active' | 'paused' | 'draft'>('active');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [settings, setSettings] = useState({
    autoPause: false,
    abTesting: false,
    workingHoursOnly: false,
    aiPersonalization: false,
    smartScheduling: false,
    followUpStrategy: 'moderate',
    responseHandling: 'auto',
    notifications: {
      success: false,
      failure: false,
      engagement: false,
      analytics: false
    }
  });
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [isTriggerDetailsOpen, setIsTriggerDetailsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isGptDialogOpen, setIsGptDialogOpen] = useState(false);
  const [selectedBookingSlot, setSelectedBookingSlot] = useState<string>('');
  const [gptGeneratedContent, setGptGeneratedContent] = useState<string>('');
  const [bookingStep, setBookingStep] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [campaignSteps, setCampaignSteps] = useState<CampaignStep[]>([]);
  const [campaignStats, setCampaignStats] = useState<CampaignStats>({
    sent: 0,
    opened: 0,
    replied: 0,
    meetings: 0,
    converted: 0,
  });
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [selectedStep, setSelectedStep] = useState<CampaignStep | null>(null);

  const handleChannelToggle = (channelId: string) => {
    setChannels(channels.map(channel =>
      channel.id === channelId ? { ...channel, enabled: !channel.enabled } : channel
    ));
  };

  const handleEditChannel = (channel: Channel) => {
    setEditingChannel(channel);
    setIsChannelDialogOpen(true);
  };

  const handleEditTrigger = (trigger: Trigger) => {
    setEditingTrigger(trigger);
    setIsTriggerDialogOpen(true);
  };

  const handleSaveChannel = () => {
    if (editingChannel) {
      setChannels(channels.map(channel =>
        channel.id === editingChannel.id ? editingChannel : channel
      ));
    }
    setIsChannelDialogOpen(false);
    setEditingChannel(null);
  };

  const handleSaveTrigger = () => {
    if (editingTrigger) {
      setTriggers(triggers.map(trigger =>
        trigger.id === editingTrigger.id ? editingTrigger : trigger
      ));
    }
    setIsTriggerDialogOpen(false);
    setEditingTrigger(null);
  };

  const handleTriggerClick = (trigger: Trigger) => {
    setSelectedTrigger(trigger);
    setIsTriggerDetailsOpen(true);
  };

  const handleBookMeeting = () => {
    setIsBookingOpen(true);
  };

  const handleGenerateContent = () => {
    setIsGptDialogOpen(true);
    // Simulate GPT generating content
    setTimeout(() => {
      setGptGeneratedContent(`Hi {name},

I noticed {company} is making waves in the {industry} space with your innovative approach to {recent_achievement}. Many companies like yours are looking to scale their operations efficiently while maintaining quality.

We've helped similar {industry} companies achieve:
• 50% reduction in manual tasks through AI automation
• 3x faster customer response time
• 99.9% accuracy in compliance processes

Would you be interested in seeing how we could help {company} achieve similar results? I'd love to schedule a quick call to discuss your specific needs.

Best,
{sender_name}`);
    }, 1500);
  };

  const handleUserActionClick = (event: React.MouseEvent<HTMLElement>, user: any) => {
    setSelectedUser(user);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAssignToSales = () => {
    setIsAssignDialogOpen(true);
    handleClose();
  };

  const generateMockUsers = (type: 'triggered' | 'successful' | 'failed') => {
    const users = [];
    const statuses = {
      triggered: ['Pending Action', 'New Lead', 'Follow Up'],
      successful: ['Meeting Booked', 'Responded', 'Qualified'],
      failed: ['No Response', 'Bounced', 'Unsubscribed']
    };

    for (let i = 0; i < 10; i++) {
      users.push({
        id: `user-${i}`,
        name: `John Doe ${i}`,
        email: `john.doe${i}@company.com`,
        company: `Company ${i}`,
        position: `Position ${i}`,
        status: statuses[type][Math.floor(Math.random() * 3)],
        lastActivity: `${Math.floor(Math.random() * 24)} hours ago`,
        score: Math.floor(Math.random() * 100),
        interactions: Math.floor(Math.random() * 10),
        notes: 'Last interaction showed high interest in product features',
        assignedTo: Math.random() > 0.5 ? 'Sarah Smith' : null
      });
    }
    return users;
  };

  const renderUserList = (type: 'triggered' | 'successful' | 'failed') => {
    const users = generateMockUsers(type);
    
    return (
      <Stack spacing={2}>
        {/* Search and Filter Bar */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
            }}
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              startAdornment={<SortIcon color="action" sx={{ mr: 1 }} />}
            >
              <MenuItem value="recent">Most Recent</MenuItem>
              <MenuItem value="score">Lead Score</MenuItem>
              <MenuItem value="interactions">Most Interactions</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              startAdornment={<FilterListIcon color="action" sx={{ mr: 1 }} />}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="unassigned">Unassigned</MenuItem>
              <MenuItem value="high-priority">High Priority</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* User List */}
        {users.map((user) => (
          <Card key={user.id} variant="outlined">
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {user.name.charAt(0)}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="subtitle1">{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.position} at {user.company}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip 
                      label={user.status} 
                      size="small"
                      color={
                        type === 'successful' ? 'success' :
                        type === 'failed' ? 'error' : 'primary'
                      }
                    />
                    <Typography variant="caption" color="text.secondary">
                      Last activity: {user.lastActivity}
                    </Typography>
                    {user.assignedTo && (
                      <Chip
                        size="small"
                        label={`Assigned to: ${user.assignedTo}`}
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Schedule Meeting">
                      <IconButton 
                        color="primary"
                        onClick={() => {
                          setSelectedUser(user);
                          handleBookMeeting();
                        }}
                      >
                        <CalendarIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Auto Call">
                      <IconButton 
                        color="secondary"
                        onClick={() => {
                          // Implement auto call functionality
                          alert(`Initiating auto call to ${user.name}`);
                        }}
                      >
                        <PhoneIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Assign to Sales">
                      <IconButton 
                        color="info"
                        onClick={() => {
                          setSelectedUser(user);
                          handleAssignToSales();
                        }}
                      >
                        <AssignmentIndIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      onClick={(e) => handleUserActionClick(e, user)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  };

  const renderAnalytics = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Campaign Performance</Typography>
      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Total Leads</Typography>
              <Typography variant="h4">{campaignAnalytics.overview.totalLeads}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Active: {campaignAnalytics.overview.activeSequences}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Meetings Booked</Typography>
              <Typography variant="h4">{campaignAnalytics.overview.totalMeetingsBooked}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Conversion: {campaignAnalytics.overview.conversionRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Avg. Response Time</Typography>
              <Typography variant="h4">{campaignAnalytics.overview.averageResponseTime}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Best Time: {campaignAnalytics.timeBasedStats.bestTimeToSend.email}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Channel Performance</Typography>
              <Typography variant="h4">{channels.length}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Active: {channels.filter(c => c.enabled).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Channel Performance</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={channels.map(channel => ({
                      name: channel.name,
                      sent: channel.stats.sent,
                      opened: channel.stats.opened,
                      replied: channel.stats.replied,
                      meetings: channel.stats.meetings,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="sent" fill="#6366F1" />
                    <Bar dataKey="opened" fill="#3B82F6" />
                    <Bar dataKey="replied" fill="#2DD4BF" />
                    <Bar dataKey="meetings" fill="#EC4899" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderSettings = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Campaign Settings</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>General Settings</Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Campaign Name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
                <FormControl fullWidth>
                  <InputLabel>Campaign Status</InputLabel>
                  <Select
                    value={campaignStatus}
                    label="Campaign Status"
                    onChange={(e) => setCampaignStatus(e.target.value as any)}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="paused">Paused</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.autoPause} 
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        autoPause: e.target.checked
                      }))}
                    />
                  }
                  label="Auto-pause on high unsubscribe rate"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.abTesting} 
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        abTesting: e.target.checked
                      }))}
                    />
                  }
                  label="Enable A/B testing"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.workingHoursOnly} 
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        workingHoursOnly: e.target.checked
                      }))}
                    />
                  }
                  label="Send during working hours only"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>AI & Automation Settings</Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.aiPersonalization} 
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        aiPersonalization: e.target.checked
                      }))}
                    />
                  }
                  label="Enable AI-powered personalization"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.smartScheduling} 
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        smartScheduling: e.target.checked
                      }))}
                    />
                  }
                  label="Smart send-time optimization"
                />
                <FormControl fullWidth>
                  <InputLabel>Follow-up Strategy</InputLabel>
                  <Select
                    value={settings.followUpStrategy}
                    label="Follow-up Strategy"
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      followUpStrategy: e.target.value
                    }))}
                  >
                    <MenuItem value="aggressive">Aggressive (1-2 days)</MenuItem>
                    <MenuItem value="moderate">Moderate (3-5 days)</MenuItem>
                    <MenuItem value="relaxed">Relaxed (7+ days)</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Response Handling</InputLabel>
                  <Select
                    value={settings.responseHandling}
                    label="Response Handling"
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      responseHandling: e.target.value
                    }))}
                  >
                    <MenuItem value="auto">Automatic (AI-powered)</MenuItem>
                    <MenuItem value="manual">Manual Review</MenuItem>
                    <MenuItem value="hybrid">Hybrid (AI + Human)</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Notification Settings</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.notifications.success} 
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            success: e.target.checked
                          }
                        }))}
                      />
                    }
                    label="Success notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.notifications.failure} 
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            failure: e.target.checked
                          }
                        }))}
                      />
                    }
                    label="Failure notifications"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.notifications.engagement} 
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            engagement: e.target.checked
                          }
                        }))}
                      />
                    }
                    label="Engagement notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.notifications.analytics} 
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            analytics: e.target.checked
                          }
                        }))}
                      />
                    }
                    label="Analytics reports"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const TriggerDetailsDialog = () => (
    <Dialog 
      open={isTriggerDetailsOpen} 
      onClose={() => setIsTriggerDetailsOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TimelineIcon color="primary" />
          <Typography variant="h6">{selectedTrigger?.name}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {selectedTrigger && (
          <Box>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
              {selectedTrigger.description}
            </Typography>
            
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <CardContent>
                    <Typography variant="h4">{selectedTrigger.stats.triggered}</Typography>
                    <Typography variant="subtitle2">Total Triggered</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <CardContent>
                    <Typography variant="h4">{selectedTrigger.stats.successful}</Typography>
                    <Typography variant="subtitle2">Successful</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
                  <CardContent>
                    <Typography variant="h4">{selectedTrigger.stats.failed}</Typography>
                    <Typography variant="subtitle2">Failed</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Tabs for different user lists */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
                <Tab label={`Triggered (${selectedTrigger.stats.triggered})`} />
                <Tab label={`Successful (${selectedTrigger.stats.successful})`} />
                <Tab label={`Failed (${selectedTrigger.stats.failed})`} />
              </Tabs>
            </Box>

            {/* Tab Panels */}
            {selectedTab === 0 && renderUserList('triggered')}
            {selectedTab === 1 && renderUserList('successful')}
            {selectedTab === 2 && renderUserList('failed')}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsTriggerDetailsOpen(false)}>Close</Button>
      </DialogActions>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          handleClose();
          // Implement view profile
          alert(`Viewing profile of ${selectedUser?.name}`);
        }}>
          View Full Profile
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          // Implement add note
          alert(`Adding note for ${selectedUser?.name}`);
        }}>
          Add Note
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          // Implement send message
          alert(`Sending message to ${selectedUser?.name}`);
        }}>
          Send Direct Message
        </MenuItem>
      </Menu>

      {/* Assign to Sales Dialog */}
      <Dialog
        open={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Assign to Sales Team</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Sales Representative</InputLabel>
              <Select
                label="Sales Representative"
                defaultValue=""
              >
                <MenuItem value="sarah">Sarah Smith</MenuItem>
                <MenuItem value="john">John Johnson</MenuItem>
                <MenuItem value="mike">Mike Wilson</MenuItem>
                <MenuItem value="lisa">Lisa Anderson</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Assignment Notes"
              placeholder="Add any relevant information for the sales representative..."
            />
            <FormControlLabel
              control={<Switch />}
              label="Send notification email"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => {
              setIsAssignDialogOpen(false);
              // Implement assignment logic
              alert(`Assigned ${selectedUser?.name} to sales team`);
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );

  const BookingDialog = () => {
    const mockTimeSlots = [
      '10:00 AM - 10:30 AM',
      '11:00 AM - 11:30 AM',
      '2:00 PM - 2:30 PM',
      '3:30 PM - 4:00 PM',
    ];

    const handleNext = () => {
      setBookingStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
      setBookingStep((prevStep) => prevStep - 1);
    };

    const handleFinish = () => {
      setIsBookingOpen(false);
      setBookingStep(0);
      // Here you would integrate with your calendar system
    };

    return (
      <Dialog open={isBookingOpen} onClose={() => setIsBookingOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule a Meeting</DialogTitle>
        <DialogContent>
          <Stepper activeStep={bookingStep} orientation="vertical">
            <Step>
              <StepLabel>Select Date & Time</StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  <RadioGroup
                    value={selectedBookingSlot}
                    onChange={(e) => setSelectedBookingSlot(e.target.value)}
                  >
                    {mockTimeSlots.map((slot) => (
                      <FormControlLabel
                        key={slot}
                        value={slot}
                        control={<Radio />}
                        label={slot}
                      />
                    ))}
                  </RadioGroup>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={!selectedBookingSlot}
                      sx={{ mr: 1 }}
                    >
                      Continue
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Meeting Details</StepLabel>
              <StepContent>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Meeting Topic"
                    defaultValue="Product Demo & Discussion"
                  />
                  <TextField
                    fullWidth
                    label="Additional Notes"
                    multiline
                    rows={3}
                    placeholder="Add any specific topics you'd like to discuss..."
                  />
                  <Box sx={{ mt: 2 }}>
                    <Button onClick={handleBack} sx={{ mr: 1 }}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mr: 1 }}
                    >
                      Continue
                    </Button>
                  </Box>
                </Stack>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Confirmation</StepLabel>
              <StepContent>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Meeting Details:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time: {selectedBookingSlot}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: 30 minutes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: Product Demo & Discussion
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button onClick={handleBack} sx={{ mr: 1 }}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleFinish}
                      sx={{ mr: 1 }}
                    >
                      Confirm Booking
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
      </Dialog>
    );
  };

  const GptContentDialog = () => (
    <Dialog open={isGptDialogOpen} onClose={() => setIsGptDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SmartToy color="primary" />
          <Typography variant="h6">AI Content Generation</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Personalization Variables
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Industry"
                placeholder="e.g. Healthcare, Finance, Tech"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Recent Achievement"
                placeholder="e.g. Market expansion, New product launch"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Focus"
                placeholder="e.g. AI automation, Customer experience"
              />
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Generated Content
          </Typography>
          {gptGeneratedContent ? (
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: 'pre-line' }}
                >
                  {gptGeneratedContent}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsGptDialogOpen(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            // Here you would save the generated content
            setIsGptDialogOpen(false);
          }}
          disabled={!gptGeneratedContent}
        >
          Use This Content
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderChannelActions = () => (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<CalendarIcon />}
            onClick={handleBookMeeting}
          >
            Book Meeting
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<SmartToy />}
            onClick={handleGenerateContent}
          >
            Generate AI Content
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(campaignSteps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCampaignSteps(items);
  };

  const generateAIContent = async (step: CampaignStep) => {
    setIsGeneratingContent(true);
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const content = `Hi {first_name},

I noticed {company} has been making waves in the {industry} space. Your recent work on {recent_project} caught my attention.

{company_research_insight}

Would you be open to a quick chat about how we could help {company} achieve similar results?

Best,
{sender_name}`;

      setCampaignSteps(steps =>
        steps.map(s =>
          s.id === step.id ? { ...s, content } : s
        )
      );
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const renderCampaignBuilder = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Campaign Builder 🚀
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Channels & Actions
            </Typography>
            <Stack spacing={2}>
              <Button
                startIcon={<EmailIcon />}
                variant="outlined"
                fullWidth
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('step_type', 'email');
                }}
              >
                Email
              </Button>
              <Button
                startIcon={<WhatsAppIcon />}
                variant="outlined"
                fullWidth
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('step_type', 'whatsapp');
                }}
              >
                WhatsApp
              </Button>
              <Button
                startIcon={<LinkedInIcon />}
                variant="outlined"
                fullWidth
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('step_type', 'linkedin');
                }}
              >
                LinkedIn
              </Button>
              <Button
                startIcon={<ScheduleIcon />}
                variant="outlined"
                fullWidth
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('step_type', 'wait');
                }}
              >
                Wait
              </Button>
              <Button
                startIcon={<PsychologyIcon />}
                variant="outlined"
                fullWidth
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('step_type', 'condition');
                }}
              >
                Condition
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={9}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="campaign-steps">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    minHeight: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    p: 3,
                    border: '2px dashed',
                    borderColor: 'divider',
                  }}
                >
                  {campaignSteps.map((step, index) => (
                    <Draggable key={step.id} draggableId={step.id} index={index}>
                      {(provided) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            p: 2,
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          {step.type === 'email' && <EmailIcon />}
                          {step.type === 'whatsapp' && <WhatsAppIcon />}
                          {step.type === 'linkedin' && <LinkedInIcon />}
                          {step.type === 'wait' && <ScheduleIcon />}
                          {step.type === 'condition' && <PsychologyIcon />}
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {step.type.charAt(0).toUpperCase() + step.type.slice(1)}
                            </Typography>
                            {step.content && (
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {step.content.substring(0, 50)}...
                              </Typography>
                            )}
                          </Box>

                          <Stack direction="row" spacing={1}>
                            <IconButton
                              size="small"
                              onClick={() => generateAIContent(step)}
                            >
                              <SmartToy />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => setSelectedStep(step)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setCampaignSteps(steps =>
                                  steps.filter(s => s.id !== step.id)
                                );
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Campaign Header */}
      <Paper elevation={0} sx={{ p: 3, background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)' }}>
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
              {campaignName}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
              Design personalized outreach sequences across multiple channels
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              color={campaignStatus === 'active' ? 'error' : 'success'}
              startIcon={campaignStatus === 'active' ? <PauseIcon /> : <PlayArrowIcon />}
              onClick={() => setCampaignStatus(campaignStatus === 'active' ? 'paused' : 'active')}
              sx={{ mr: 2 }}
            >
              {campaignStatus === 'active' ? 'Pause Campaign' : 'Start Campaign'}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<SettingsIcon />}
              onClick={() => setActiveTab(3)}
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
            >
              Settings
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <Tabs
          orientation="vertical"
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            minWidth: 200,
            '& .MuiTab-root': {
              alignItems: 'flex-start',
              textAlign: 'left',
              pl: 3,
            },
          }}
        >
          <Tab icon={<AutoGraphIcon sx={{ mr: 1 }} />} label="Sequence Flow" iconPosition="start" />
          <Tab icon={<TimelineIcon sx={{ mr: 1 }} />} label="Analytics" iconPosition="start" />
          <Tab icon={<PsychologyIcon sx={{ mr: 1 }} />} label="Triggers" iconPosition="start" />
          <Tab icon={<SettingsIcon sx={{ mr: 1 }} />} label="Settings" iconPosition="start" />
        </Tabs>

        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>Channel Sequence</Typography>
              <Grid container spacing={3}>
                {channels.map((channel, index) => (
                  <Grid item xs={12} key={channel.id}>
                    <Card>
                      <CardContent>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item>
                            <Avatar sx={{ 
                              bgcolor: channel.enabled ? 'primary.main' : 'grey.300',
                              width: 56,
                              height: 56
                            }}>
                              <channel.icon sx={{ fontSize: 32 }} />
                            </Avatar>
                          </Grid>
                          <Grid item xs>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {channel.name}
                              <Chip
                                size="small"
                                label={`${channel.stats.meetings} meetings`}
                                color="success"
                                sx={{ ml: 1 }}
                              />
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Delay: {channel.delay} {channel.delayUnit} after previous step
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={(channel.stats.replied / channel.stats.sent) * 100}
                                sx={{ height: 4, borderRadius: 2 }}
                              />
                              <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                                Response Rate: {((channel.stats.replied / channel.stats.sent) * 100).toFixed(1)}%
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item>
                            <Stack direction="row" spacing={1}>
                              <Switch
                                checked={channel.enabled}
                                onChange={() => handleChannelToggle(channel.id)}
                                color="primary"
                              />
                              <IconButton onClick={() => handleEditChannel(channel)}>
                                <EditIcon />
                              </IconButton>
                            </Stack>
                          </Grid>
                        </Grid>
                        {channel.enabled && (
                          <Box sx={{ mt: 2 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                              <InputLabel>Template</InputLabel>
                              <Select
                                value={selectedTemplate}
                                label="Template"
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                              >
                                {channel.templates.map((template) => (
                                  <MenuItem key={template.id} value={template.id}>
                                    {template.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              value={channel.template}
                              onChange={(e) => {
                                const updatedChannels = [...channels];
                                updatedChannels[index].template = e.target.value;
                                setChannels(updatedChannels);
                              }}
                              placeholder="Enter message template..."
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeTab === 1 && renderAnalytics()}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>Campaign Triggers</Typography>
              <Grid container spacing={3}>
                {triggers.map((trigger) => (
                  <Grid item xs={12} md={6} key={trigger.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => handleTriggerClick(trigger)}
                    >
                      <CardContent>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                              {trigger.name}
                              <Chip
                                size="small"
                                label={trigger.priority}
                                color={
                                  trigger.priority === 'high' ? 'error' :
                                  trigger.priority === 'medium' ? 'warning' : 'info'
                                }
                                sx={{ ml: 1 }}
                              />
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {trigger.description}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <TriggerDetailsDialog />
            </Box>
          )}

          {activeTab === 3 && renderSettings()}
        </Box>
      </Box>

      {/* Channel Edit Dialog */}
      <Dialog open={isChannelDialogOpen} onClose={() => setIsChannelDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Channel Settings</DialogTitle>
        <DialogContent>
          {editingChannel && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Delay"
                  type="number"
                  value={editingChannel.delay}
                  onChange={(e) => setEditingChannel({
                    ...editingChannel,
                    delay: parseInt(e.target.value) || 0,
                  })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Delay Unit</InputLabel>
                  <Select
                    value={editingChannel.delayUnit}
                    label="Delay Unit"
                    onChange={(e) => setEditingChannel({
                      ...editingChannel,
                      delayUnit: e.target.value as any,
                    })}
                  >
                    <MenuItem value="minutes">Minutes</MenuItem>
                    <MenuItem value="hours">Hours</MenuItem>
                    <MenuItem value="days">Days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editingChannel.settings.workingHoursOnly}
                      onChange={(e) => setEditingChannel({
                        ...editingChannel,
                        settings: {
                          ...editingChannel.settings,
                          workingHoursOnly: e.target.checked,
                        },
                      })}
                    />
                  }
                  label="Send during working hours only"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Max Follow-ups"
                  type="number"
                  value={editingChannel.settings.maxFollowUps}
                  onChange={(e) => setEditingChannel({
                    ...editingChannel,
                    settings: {
                      ...editingChannel.settings,
                      maxFollowUps: parseInt(e.target.value) || 0,
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Templates</Typography>
                {editingChannel.templates.map((template, index) => (
                  <Card key={template.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <TextField
                        fullWidth
                        label="Template Name"
                        value={template.name}
                        onChange={(e) => {
                          const updatedTemplates = [...editingChannel.templates];
                          updatedTemplates[index] = {
                            ...template,
                            name: e.target.value,
                          };
                          setEditingChannel({
                            ...editingChannel,
                            templates: updatedTemplates,
                          });
                        }}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Content"
                        value={template.content}
                        onChange={(e) => {
                          const updatedTemplates = [...editingChannel.templates];
                          updatedTemplates[index] = {
                            ...template,
                            content: e.target.value,
                          };
                          setEditingChannel({
                            ...editingChannel,
                            templates: updatedTemplates,
                          });
                        }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsChannelDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveChannel} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Trigger Edit Dialog */}
      <Dialog open={isTriggerDialogOpen} onClose={() => setIsTriggerDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Trigger</DialogTitle>
        <DialogContent>
          {editingTrigger && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Trigger Name"
                  value={editingTrigger.name}
                  onChange={(e) => setEditingTrigger({
                    ...editingTrigger,
                    name: e.target.value,
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  value={editingTrigger.description}
                  onChange={(e) => setEditingTrigger({
                    ...editingTrigger,
                    description: e.target.value,
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Condition"
                  value={editingTrigger.condition}
                  onChange={(e) => setEditingTrigger({
                    ...editingTrigger,
                    condition: e.target.value,
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Action"
                  value={editingTrigger.action}
                  onChange={(e) => setEditingTrigger({
                    ...editingTrigger,
                    action: e.target.value,
                  })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={editingTrigger.priority}
                    label="Priority"
                    onChange={(e) => setEditingTrigger({
                      ...editingTrigger,
                      priority: e.target.value as any,
                    })}
                  >
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cooldown (hours)"
                  type="number"
                  value={editingTrigger.cooldown}
                  onChange={(e) => setEditingTrigger({
                    ...editingTrigger,
                    cooldown: parseInt(e.target.value) || 0,
                  })}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsTriggerDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveTrigger} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {renderChannelActions()}
      <BookingDialog />
      <GptContentDialog />
    </Box>
  );
};

export default MultiChannelCampaign; 