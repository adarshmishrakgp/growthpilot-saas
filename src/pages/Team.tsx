import React from 'react';
import { Typography, Grid, Card, CardContent, Avatar, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Add as AddIcon } from '@mui/icons-material';

const teamMembers = [
  {
    name: 'John Doe',
    role: 'Team Lead',
    avatar: 'https://i.pravatar.cc/150?img=1',
    email: 'john@example.com',
  },
  {
    name: 'Jane Smith',
    role: 'Sales Manager',
    avatar: 'https://i.pravatar.cc/150?img=2',
    email: 'jane@example.com',
  },
  {
    name: 'Mike Johnson',
    role: 'Marketing Specialist',
    avatar: 'https://i.pravatar.cc/150?img=3',
    email: 'mike@example.com',
  },
  {
    name: 'Sarah Williams',
    role: 'Customer Success',
    avatar: 'https://i.pravatar.cc/150?img=4',
    email: 'sarah@example.com',
  },
];

const Team: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Team Members
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Member
          </Button>
        </Box>
        <Grid container spacing={3}>
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={member.email}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Avatar
                      src={member.avatar}
                      sx={{ width: 80, height: 80, mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.email}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </motion.div>
  );
};

export default Team; 