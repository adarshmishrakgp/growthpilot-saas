import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Chip, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import MusicNoteIcon from '@mui/icons-material/MusicNote'; // For TikTok
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface PostContent {
  type: 'image' | 'video' | 'text' | 'email';
  mediaUrl?: string;
  caption?: string;
  subject?: string; // for email
  preview?: string; // for email preview or WhatsApp message
  timestamp: string;
}

interface PostPreviewProps {
  channel: string;
  content: PostContent;
}

const channelConfig: { [key: string]: { icon: JSX.Element; color: string; label: string } } = {
  Instagram: { icon: <InstagramIcon />, color: '#E4405F', label: 'Instagram Post' },
  Facebook: { icon: <FacebookIcon />, color: '#1877F2', label: 'Facebook Post' },
  TikTok: { icon: <MusicNoteIcon />, color: '#000000', label: 'TikTok Video' },
  LinkedIn: { icon: <LinkedInIcon />, color: '#0A66C2', label: 'LinkedIn Post' },
  WhatsApp: { icon: <WhatsAppIcon />, color: '#25D366', label: 'WhatsApp Message' },
  Email: { icon: <EmailIcon />, color: '#EA4335', label: 'Email Campaign' }
};

const PostPreview: React.FC<PostPreviewProps> = ({ channel, content }) => {
  const channelInfo = channelConfig[channel];

  return (
    <Card sx={{ 
      mb: 3,
      borderRadius: 2,
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
    }}>
      {/* Media Content */}
      {content.type !== 'email' && content.mediaUrl && (
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height={content.type === 'video' ? 200 : 240}
            image={content.mediaUrl}
            alt={content.caption || 'Post media'}
            sx={{ objectFit: 'cover' }}
          />
          {content.type === 'video' && (
            <IconButton
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
              }}
            >
              <PlayArrowIcon sx={{ color: 'white', fontSize: 40 }} />
            </IconButton>
          )}
        </Box>
      )}

      {/* Content */}
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
          {channelInfo.icon}
          <Chip 
            label={channelInfo.label}
            size="small"
            sx={{ 
              backgroundColor: `${channelInfo.color}15`,
              color: channelInfo.color,
              fontWeight: 600
            }}
          />
          <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
            {content.timestamp}
          </Typography>
        </Box>

        {channel === 'Email' ? (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {content.subject}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ 
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {content.preview}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" sx={{ 
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}>
            {content.caption || content.preview}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PostPreview; 