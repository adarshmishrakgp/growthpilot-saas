import React from 'react';
import { Box, Typography, Avatar, Chip, Grid, IconButton, Tooltip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LinkIcon from '@mui/icons-material/Link';

interface UserProfileData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  avatar?: string;
  customerSince?: string;
  totalOrders?: number;
  totalSpent?: number;
  lastOrder?: string;
  tags?: string[];
  socialLinks?: {
    platform: string;
    url: string;
    followers?: number;
  }[];
  segments?: string[];
}

interface UserProfileProps {
  profile: UserProfileData;
}

const UserProfile: React.FC<UserProfileProps> = ({ profile }) => {
  return (
    <Box sx={{ p: 2 }}>
      {/* Header with Avatar and Basic Info */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        mb: 3,
        background: 'rgba(99,102,241,0.05)',
        p: 2,
        borderRadius: 2
      }}>
        <Avatar 
          src={profile.avatar} 
          sx={{ 
            width: 64, 
            height: 64,
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937' }}>
            {profile.name || 'Anonymous User'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
            {profile.customerSince && (
              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                Customer since {profile.customerSince}
              </Typography>
            )}
            {profile.segments?.map((segment, idx) => (
              <Chip
                key={idx}
                label={segment}
                size="small"
                sx={{ 
                  background: 'rgba(99,102,241,0.1)',
                  color: '#6366F1',
                  fontWeight: 500
                }}
              />
            ))}
          </Box>
        </Box>
        <Tooltip title="Add to CRM">
          <IconButton sx={{ color: '#6366F1' }}>
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Contact Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#4B5563', fontWeight: 600 }}>
          Contact Information
        </Typography>
        <Grid container spacing={2}>
          {profile.email && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#6B7280', fontSize: 20 }} />
                <Typography variant="body2">{profile.email}</Typography>
              </Box>
            </Grid>
          )}
          {profile.phone && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#6B7280', fontSize: 20 }} />
                <Typography variant="body2">{profile.phone}</Typography>
              </Box>
            </Grid>
          )}
          {profile.location && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ color: '#6B7280', fontSize: 20 }} />
                <Typography variant="body2">{profile.location}</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Purchase History */}
      {(profile.totalOrders || profile.totalSpent || profile.lastOrder) && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#4B5563', fontWeight: 600 }}>
            Purchase History
          </Typography>
          <Grid container spacing={2}>
            {profile.totalOrders && (
              <Grid item xs={6}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 1,
                  background: 'rgba(99,102,241,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <ShoppingBagIcon sx={{ color: '#6366F1', fontSize: 20 }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#1F2937', fontWeight: 600 }}>
                      {profile.totalOrders}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      Total Orders
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            {profile.totalSpent && (
              <Grid item xs={6}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 1,
                  background: 'rgba(99,102,241,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <TrendingUpIcon sx={{ color: '#6366F1', fontSize: 20 }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#1F2937', fontWeight: 600 }}>
                      ₹{profile.totalSpent}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      Total Spent
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
          {profile.lastOrder && (
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#6B7280' }}>
              Last order: {profile.lastOrder}
            </Typography>
          )}
        </Box>
      )}

      {/* Social Links */}
      {profile.socialLinks && profile.socialLinks.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#4B5563', fontWeight: 600 }}>
            Social Profiles
          </Typography>
          <Grid container spacing={1}>
            {profile.socialLinks.map((social, idx) => (
              <Grid item xs={12} key={idx}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  p: 1,
                  borderRadius: 1,
                  '&:hover': { background: 'rgba(99,102,241,0.05)' }
                }}>
                  <LinkIcon sx={{ color: '#6B7280', fontSize: 20 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#1F2937' }}>
                      {social.platform}
                    </Typography>
                    {social.followers && (
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        {social.followers.toLocaleString()} followers
                      </Typography>
                    )}
                  </Box>
                  <IconButton 
                    size="small" 
                    href={social.url} 
                    target="_blank"
                    sx={{ color: '#6366F1' }}
                  >
                    <LinkIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default UserProfile;
