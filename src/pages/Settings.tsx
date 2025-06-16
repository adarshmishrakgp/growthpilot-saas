import React from 'react';
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';

const Settings: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Paper sx={{ mt: 3 }}>
          <List>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Notifications"
                secondary="Manage your notification preferences"
              />
              <ListItemSecondaryAction>
                <Switch edge="end" defaultChecked />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText
                primary="Security"
                secondary="Manage your security settings"
              />
              <ListItemSecondaryAction>
                <Button variant="outlined" size="small">
                  Configure
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText
                primary="Language"
                secondary="Choose your preferred language"
              />
              <ListItemSecondaryAction>
                <Button variant="outlined" size="small">
                  English
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <PaletteIcon />
              </ListItemIcon>
              <ListItemText
                primary="Theme"
                secondary="Customize your interface"
              />
              <ListItemSecondaryAction>
                <Switch edge="end" />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <CloudIcon />
              </ListItemIcon>
              <ListItemText
                primary="Data Sync"
                secondary="Manage your data synchronization"
              />
              <ListItemSecondaryAction>
                <Switch edge="end" defaultChecked />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default Settings; 