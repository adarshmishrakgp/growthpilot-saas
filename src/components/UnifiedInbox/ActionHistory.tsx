import React from 'react';
import { List, ListItem, ListItemAvatar, ListItemText , Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const ActionHistory: React.FC<{ actions: string[] }> = ({ actions }) => (
  <>
    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Action History</Typography>
    <List>
      {actions.map((a, i) => (
        <ListItem key={i}>
          <ListItemAvatar>
            <PersonIcon />
          </ListItemAvatar>
          <ListItemText primary={a} />
        </ListItem>
      ))}
    </List>
  </>
);

export default ActionHistory;
