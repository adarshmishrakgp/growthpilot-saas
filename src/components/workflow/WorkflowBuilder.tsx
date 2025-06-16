import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

const WorkflowBuilder: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Workflow Builder
      </Typography>
      
      <Paper sx={{ p: 3, minHeight: 400 }}>
        <Typography variant="h6" gutterBottom>
          Create New Workflow
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary">
            Add Step
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default WorkflowBuilder; 