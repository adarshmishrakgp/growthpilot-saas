import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TiktokIcon from '@mui/icons-material/MusicNote'; // Substitute for TikTok

const channels = [
  { label: 'WhatsApp', icon: <WhatsAppIcon />, color: '#25D366' },
  { label: 'Instagram', icon: <InstagramIcon />, color: '#E4405F' },
  { label: 'TikTok', icon: <TiktokIcon />, color: '#000000' },
  { label: 'Facebook', icon: <FacebookIcon />, color: '#1877F2' },
  { label: 'Email', icon: <EmailIcon />, color: '#EA4335' },
  { label: 'LinkedIn', icon: <LinkedInIcon />, color: '#0A66C2' },
];

interface Props {
  selectedChannels: string[];
  onChange: (channels: string[]) => void;
}

const ChannelFilterSidebar: React.FC<Props> = ({ selectedChannels, onChange }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 1.5,
    p: 2,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: 2,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  }}>
    <Typography variant="h6" sx={{ 
      fontWeight: 700, 
      mb: 2,
      color: '#1F2937'
    }}>
      Channels
    </Typography>
    <Stack spacing={1.5}>
      {channels.map(ch => (
        <Button
          key={ch.label}
          variant={selectedChannels.includes(ch.label) ? "contained" : "outlined"}
          startIcon={ch.icon}
          onClick={() => onChange([ch.label])} // Only select one channel at a time
          fullWidth
          sx={{
            justifyContent: 'flex-start',
            py: 1.5,
            px: 2,
            borderRadius: 2,
            color: selectedChannels.includes(ch.label) ? '#fff' : ch.color,
            borderColor: ch.color,
            backgroundColor: selectedChannels.includes(ch.label) ? ch.color : 'transparent',
            '&:hover': {
              backgroundColor: selectedChannels.includes(ch.label) 
                ? ch.color 
                : `${ch.color}10`,
              borderColor: ch.color,
            },
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.9rem'
          }}
        >
          {ch.label}
        </Button>
      ))}
    </Stack>
  </Box>
);

export default ChannelFilterSidebar;
