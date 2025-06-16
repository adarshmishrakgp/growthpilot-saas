import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Drawer,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  Tabs,
  Tab,
  Badge,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Autorenew as AutorenewIcon
} from '@mui/icons-material';

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  summary: string;
  score: number;
  badges: string[];
  source: string;
  insights: string;
  favorite: boolean;
}

const leadSources = [
  { label: 'LinkedIn', icon: <LinkedInIcon color="primary" /> },
  { label: 'X', icon: <Box component="span" sx={{ fontWeight: 700, fontSize: 18 }}>𝕏</Box> },
  { label: 'Websites', icon: <Box component="span" sx={{ fontSize: 18 }}>🌐</Box> },
];

const leadsData: Lead[] = [
  {
    id: '1',
    name: 'Amy Tan',
    title: 'COO',
    company: 'NeuroPulse',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    summary: 'Mentioned "compliance" 3x in last week. Visited pricing page twice.',
    score: 88,
    badges: ['🔥 High Intent', 'LinkedIn'],
    source: 'LinkedIn',
    insights: 'Last seen on LinkedIn 2h ago. Opened last campaign email.',
    favorite: false,
  },
  {
    id: '2',
    name: 'John Miller',
    title: 'CTO',
    company: 'FinBoost',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    summary: 'Commented on your AI blog post. Clicked on demo link.',
    score: 76,
    badges: ['💼 B2B', 'X'],
    source: 'X',
    insights: 'Active on X. Mentioned "automation" in recent post.',
    favorite: true,
  },
];

const aiScripts = [
  "Hey {name}, saw you're scaling {topic} at {company}. Want to see how AI can make it 10x easier? Let's chat!",
  "Hi {name}, noticed your interest in {topic}. Our AI tools could be a game-changer for {company}—up for a quick call?",
];

function getSourceIcon(source: string) {
  if (source === 'LinkedIn') return <LinkedInIcon color="primary" />;
  if (source === 'X') return <Box component="span" sx={{ fontWeight: 700, fontSize: 18 }}>𝕏</Box>;
  return <Box component="span" sx={{ fontSize: 18 }}>🌐</Box>;
}

const intentColor = (score: number) =>
  score > 80 ? 'linear-gradient(90deg,#fbbf24,#f87171)' :
  score > 60 ? 'linear-gradient(90deg,#6366f1,#fbbf24)' :
  '#e0e7ef';

const intentEmoji = (score: number) =>
  score > 80 ? '🔥' : score > 60 ? '😊' : '🥶';

const outreachChannels = [
  { label: 'Email', icon: <EmailIcon /> },
  { label: 'LinkedIn', icon: <LinkedInIcon /> },
  { label: 'Voice AI', icon: <RecordVoiceOverIcon /> },
];

const OmniProspector: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [favoriteLeads, setFavoriteLeads] = useState<string[]>([]);
  const [aiScriptIdx, setAiScriptIdx] = useState(0);
  const [activeChannels, setActiveChannels] = useState(['Email']);
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);
  const [tab, setTab] = useState(0);
  const isMobile = useMediaQuery('(max-width:900px)');

  // Smart search suggestions
  const suggestions = [
    "Find CTOs in Berlin",
    "Show B2B leads",
    "Find COOs who mentioned compliance",
    "Show high intent only"
  ];

  // Real-time scraping feed (mocked)
  const scrapingFeed = [
    "Scraping LinkedIn…",
    "Found: Amy Tan, COO at NeuroPulse",
    "Switching to X…",
    "Found: John Miller, CTO at FinBoost",
    "Enriching with Clearbit…",
    "Scoring intent with AI…"
  ];

  // Filtered leads
  const filteredLeads = leadsData
    .filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.title.toLowerCase().includes(search.toLowerCase()))
    .filter(l => sourceFilter.length === 0 || sourceFilter.includes(l.source));

  // AI script with lead info
  const getAIScript = (lead: Lead) => {
    if (!lead) return '';
    return aiScripts[aiScriptIdx]
      .replace('{name}', lead.name)
      .replace('{topic}', lead.summary.split(' ')[1] || 'AI')
      .replace('{company}', lead.company);
  };

  // Handle favorite toggle
  const handleFavorite = (id: string) => {
    setFavoriteLeads(fav =>
      fav.includes(id) ? fav.filter(f => f !== id) : [...fav, id]
    );
  };

  // Handle channel toggle
  const handleChannelToggle = (label: string) => {
    setActiveChannels(chs =>
      chs.includes(label) ? chs.filter(c => c !== label) : [...chs, label]
    );
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      fontFamily: 'Inter, Manrope, sans-serif',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
      p: isMobile ? 1 : 4
    }}>
      {/* Top Bar */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 2, mb: 4, flexWrap: 'wrap'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: 1, color: '#3b3b5c' }}>
          OmniProspector <span role="img" aria-label="radar">🛰️</span>
        </Typography>
        <Box sx={{ flexGrow: 1, position: 'relative', minWidth: 240 }}>
          <SearchIcon sx={{ position: 'absolute', top: '30%', left: 10, color: '#999' }} />
          <TextField
            fullWidth
            placeholder="Smart search: Find CTOs in Berlin"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{
              pl: 4,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.6)',
              boxShadow: '0 2px 8px rgba(80,80,255,0.04)',
              input: { fontWeight: 500, fontSize: 18, fontFamily: 'inherit' },
            }}
            variant="outlined"
            size="small"
            autoComplete="off"
          />
          {/* Suggestions */}
          {search === '' && (
            <Box sx={{
              position: 'absolute', left: 0, right: 0, top: 40, zIndex: 2,
              background: 'rgba(255,255,255,0.95)', borderRadius: 2, boxShadow: 2
            }}>
              {suggestions.map(s => (
                <Box
                  key={s}
                  sx={{ px: 2, py: 1, cursor: 'pointer', '&:hover': { background: '#f0f0ff' } }}
                  onClick={() => setSearch(s)}
                >
                  {s}
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Chip
          label={`${filteredLeads.length} leads`}
          sx={{
            background: 'linear-gradient(90deg,#6366f1,#fbbf24)',
            color: '#fff', fontWeight: 700, fontSize: 16
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Left - Lead Sources & Feed */}
        <Grid item xs={12} md={3}>
          <Box sx={{
            p: 3, borderRadius: 4, background: 'rgba(255,255,255,0.55)',
            boxShadow: '0 2px 16px rgba(80,80,255,0.08)', mb: 3, minHeight: 300,
            display: 'flex', flexDirection: 'column', gap: 2, backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Lead Sources
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {leadSources.map(src => (
                <Chip
                  key={src.label}
                  icon={src.icon}
                  label={src.label}
                  clickable
                  color={sourceFilter.includes(src.label) ? 'primary' : 'default'}
                  onClick={() =>
                    setSourceFilter(f =>
                      f.includes(src.label)
                        ? f.filter(l => l !== src.label)
                        : [...f, src.label]
                    )
                  }
                />
              ))}
            </Box>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>
              Real-Time Feed
            </Typography>
            <Box sx={{ fontSize: 15, color: '#6b7280', fontFamily: 'inherit', minHeight: 60 }}>
              {scrapingFeed.map((feed, i) => (
                <div
                  key={feed}
                >
                  {feed}
                </div>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Center - Leads List */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Leads that actually give a damn.
          </Typography>
          <Grid container spacing={2}>
            {filteredLeads.map((lead) => (
              <Grid item xs={12} key={lead.id}>
                <div
                  style={{ borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.8)' }}
                >
                  <Box
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 2, p: 2,
                      border: '1px solid #eee', borderRadius: 3, cursor: 'pointer',
                      position: 'relative'
                    }}
                    onClick={() => { handleSelectLead(lead); setDrawerOpen(true); }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Tooltip title={lead.score > 80 ? "High Intent" : "Medium/Low Intent"}>
                          <span style={{
                            fontSize: 22,
                            filter: 'drop-shadow(0 0 4px #fbbf24)'
                          }}>{intentEmoji(lead.score)}</span>
                        </Tooltip>
                      }
                    >
                      <Avatar src={lead.avatar} sx={{ width: 56, height: 56, border: '2px solid #6366f1' }} />
                    </Badge>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                        {lead.name} <Tooltip title="Favorite"><IconButton size="small" onClick={e => { e.stopPropagation(); handleFavorite(lead.id); }}>
                          {favoriteLeads.includes(lead.id) ? <StarIcon color="warning" /> : <StarBorderIcon />}
                        </IconButton></Tooltip>
                      </Typography>
                      <Typography sx={{ fontSize: 15, color: '#6366f1', fontWeight: 600 }}>
                        {lead.title} @ {lead.company}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#374151' }}>
                        {lead.summary}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                      {lead.badges.map(b => (
                        <Tooltip key={b} title={b}>
                          <Chip label={b} size="small" color="primary" />
                        </Tooltip>
                      ))}
                      <Tooltip title={lead.source}>
                        <span>{getSourceIcon(lead.source)}</span>
                      </Tooltip>
                    </Box>
                    {/* Hover reveal: more insights */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 16,
                        background: 'rgba(99,102,241,0.08)',
                        borderRadius: 12,
                        padding: '4px 12px',
                        fontSize: 13,
                        color: '#6366f1',
                        fontWeight: 600,
                        pointerEvents: 'none'
                      }}
                    >
                      {lead.insights}
                    </div>
                  </Box>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right - Campaign Drawer */}
        <Grid item xs={12} md={3}>
          <Drawer
            anchor={isMobile ? "bottom" : "right"}
            open={drawerOpen && !!selectedLead}
            onClose={() => setDrawerOpen(false)}
            variant={isMobile ? "temporary" : "persistent"}
            PaperProps={{
              sx: {
                width: isMobile ? '100%' : 340,
                p: 3,
                background: 'rgba(255,255,255,0.95)',
                borderLeft: isMobile ? 'none' : '1px solid #e0e0e0',
                borderTop: isMobile ? '1px solid #e0e0e0' : 'none',
                borderRadius: isMobile ? '24px 24px 0 0' : '24px 0 0 24px',
                boxShadow: '0 2px 32px #6366f122',
                overflow: 'visible',
              },
            }}
          >
            {selectedLead && (
              <Box>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                  <Tab label="Preview" />
                  <Tab label="Insights" />
                  <Tab label="History" />
                </Tabs>
                {tab === 0 && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar src={selectedLead.avatar} />
                      <Box>
                        <Typography fontWeight={600}>{selectedLead.name}</Typography>
                        <Typography variant="body2">{selectedLead.title} @ {selectedLead.company}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>{selectedLead.summary}</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Engagement Forecast</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Box sx={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: intentColor(selectedLead.score),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: 18, boxShadow: 2
                      }}>
                        {selectedLead.score}%
                      </Box>
                      <Typography variant="caption" sx={{ color: '#6366f1' }}>
                        "AI thinks {selectedLead.name.split(' ')[0]} will probably reply before her next coffee break."
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>AI Outreach Script</Typography>
                    <Box sx={{
                      background: 'rgba(240,240,255,0.7)',
                      borderRadius: 3,
                      p: 2,
                      mb: 2,
                      fontFamily: 'inherit',
                      fontSize: 15,
                      color: '#374151',
                      position: 'relative'
                    }}>
                      {getAIScript(selectedLead)}
                      <Tooltip title="Regenerate">
                        <IconButton
                          size="small"
                          sx={{ position: 'absolute', top: 4, right: 4 }}
                          onClick={() => setAiScriptIdx((i) => (i + 1) % aiScripts.length)}
                        >
                          <AutorenewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="subtitle2" gutterBottom>Channels</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {outreachChannels.map(ch => (
                        <Chip
                          key={ch.label}
                          icon={ch.icon}
                          label={ch.label}
                          color={activeChannels.includes(ch.label) ? 'primary' : 'default'}
                          onClick={() => handleChannelToggle(ch.label)}
                          clickable
                        />
                      ))}
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 3, fontWeight: 700, fontSize: 18, py: 1.5, boxShadow: '0 4px 24px #6366f144' }}
                      onClick={() => {
                        // Confetti animation could be triggered here
                        alert('Campaign launched for ' + selectedLead.name + ' 🎉');
                      }}
                    >
                      Launch Campaign 🚀
                    </Button>
                  </>
                )}
                {tab === 1 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>AI Insights</Typography>
                    <Typography variant="body2">{selectedLead.insights}</Typography>
                  </Box>
                )}
                {tab === 2 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>History</Typography>
                    <Typography variant="body2">No previous campaigns for this lead yet.</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Drawer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OmniProspector;
 