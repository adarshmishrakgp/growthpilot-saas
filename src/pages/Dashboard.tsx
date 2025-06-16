import React from 'react';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ padding: '24px' }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        {/* Add your dashboard components here */}
      </div>
    </motion.div>
  );
};

export default Dashboard; 