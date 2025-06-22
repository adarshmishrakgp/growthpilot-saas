import React from 'react';
import { useNavigate,Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Avatar,
  Typography,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Inbox as InboxIcon,
  PersonSearch as PersonSearchIcon,
  Campaign as CampaignIcon,
  Forum as UnifiedInboxIcon,
  ShoppingCart,
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 280,
    boxSizing: 'border-box',
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const UserProfile = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Smart Inbox', icon: <InboxIcon />, path: '/inbox' },
    { text: 'Lead Generator', icon: <PersonSearchIcon />, path: '/leads' },
    { text: 'Campaigns', icon: <CampaignIcon />, path: '/campaigns' },
    { text: 'Unified Inbox', icon: <UnifiedInboxIcon />, path: '/unified-inbox' },
    { text: 'AI Commerce', icon: <ShoppingCart />, path: '/ai-commerce' },
    { text: 'Workflow Automation', icon: <ShoppingCart />, path: '/workflow-automation' },
    { text: 'AI Voice Agent', icon: <ShoppingCart />, path: '/voice-agent' },
    { text: 'Multi-Channel Campaign', icon: <ShoppingCart />, path: '/multi-channel' },
    { text: 'CRM', icon: <ShoppingCart />, path: '/crm' },
    { text: 'Success Engine', icon: <ShoppingCart />, path: '/success-engine' },
   
  ];

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          GrowthPilot
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Tooltip
            key={item.text}
            title={item.text}
            placement="right"
            arrow
          >
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
        <Tooltip
          title="Prospector"
          placement="right"
          arrow
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate('/prospector');
                onClose();
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === '/prospector' ? 'primary.main' : 'inherit',
                }}
              >
                <SearchIcon />
              </ListItemIcon>
              <ListItemText
                primary="Prospector"
                primaryTypographyProps={{
                  fontWeight: location.pathname === '/prospector' ? 'bold' : 'normal',
                }}
              />
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>
    </Drawer>
  );
};

export default Sidebar; 