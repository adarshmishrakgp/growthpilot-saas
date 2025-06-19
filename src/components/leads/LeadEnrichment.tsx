import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerifiedIcon from '@mui/icons-material/Verified';

interface EnrichedData {
  confidence: number;
  source: string;
  value: string;
  verified: boolean;
}

interface LeadEnrichmentProps {
  leadId: string;
  initialData?: {
    [key: string]: EnrichedData[];
  };
}

const LeadEnrichment: React.FC<LeadEnrichmentProps> = ({ leadId, initialData = {} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [enrichedData, setEnrichedData] = useState(initialData);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call to enrichment services
    setTimeout(() => {
      setEnrichedData({
        email: [
          {
            confidence: 95,
            source: 'Hunter.io',
            value: 'sarah.chen@fintechsolutions.de',
            verified: true
          },
          {
            confidence: 85,
            source: 'Clearbit',
            value: 's.chen@fintechsolutions.de',
            verified: false
          }
        ],
        phone: [
          {
            confidence: 90,
            source: 'Leadmagic',
            value: '+49 30 123456789',
            verified: true
          }
        ],
        social: [
          {
            confidence: 100,
            source: 'LinkedIn',
            value: 'linkedin.com/in/sarahchen',
            verified: true
          },
          {
            confidence: 95,
            source: 'Twitter',
            value: 'twitter.com/sarahchen',
            verified: true
          }
        ],
        company: [
          {
            confidence: 100,
            source: 'Clearbit',
            value: 'FinTech Solutions GmbH',
            verified: true
          }
        ]
      });
      setIsLoading(false);
    }, 1500);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const renderEnrichedField = (field: string, data: EnrichedData[]) => {
    const isExpanded = expandedSections.includes(field);
    const bestMatch = data.reduce((prev, current) => 
      (current.confidence > prev.confidence) ? current : prev
    );

    return (
      <Box sx={{ mb: 2 }} key={field}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer',
            p: 1,
            borderRadius: 1,
            '&:hover': {
              background: 'rgba(99,102,241,0.05)'
            }
          }}
          onClick={() => toggleSection(field)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {field === 'email' && <EmailIcon sx={{ color: '#6366F1' }} />}
            {field === 'phone' && <PhoneIcon sx={{ color: '#6366F1' }} />}
            {field === 'social' && <LinkedInIcon sx={{ color: '#6366F1' }} />}
            {field === 'company' && <LanguageIcon sx={{ color: '#6366F1' }} />}
            <Typography variant="subtitle2" sx={{ color: '#374151', fontWeight: 500 }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              size="small"
              label={`${bestMatch.confidence}% match`}
              sx={{
                background: 'rgba(99,102,241,0.1)',
                color: '#6366F1',
                fontWeight: 500
              }}
            />
            <ExpandMoreIcon 
              sx={{ 
                transform: isExpanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
                color: '#6B7280'
              }} 
            />
          </Box>
        </Box>

        <Collapse in={isExpanded}>
          <Box sx={{ pl: 4, pr: 2, pt: 1 }}>
            {data.map((item, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  background: item === bestMatch ? 'rgba(99,102,241,0.05)' : 'transparent'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#4B5563' }}>
                    {item.value}
                  </Typography>
                  {item.verified && (
                    <Tooltip title="Verified">
                      <VerifiedIcon sx={{ color: '#10B981', fontSize: 16 }} />
                    </Tooltip>
                  )}
                </Box>
                <Chip
                  size="small"
                  label={item.source}
                  sx={{ 
                    background: 'white',
                    border: '1px solid rgba(0,0,0,0.1)',
                    fontSize: '0.75rem'
                  }}
                />
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  };

  return (
    <Paper sx={{ 
      p: 3,
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937' }}>
          Enriched Data
        </Typography>
        <Button
          startIcon={isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
          onClick={handleRefresh}
          disabled={isLoading}
          sx={{
            color: '#6366F1',
            '&:hover': {
              background: 'rgba(99,102,241,0.05)'
            }
          }}
        >
          Refresh Data
        </Button>
      </Box>

      {Object.entries(enrichedData).map(([field, data]) => 
        renderEnrichedField(field, data)
      )}

      <Box sx={{ 
        mt: 3, 
        p: 2, 
        borderRadius: 2, 
        background: 'rgba(99,102,241,0.05)',
        border: '1px dashed rgba(99,102,241,0.2)'
      }}>
        <Typography variant="body2" sx={{ color: '#4B5563' }}>
          <strong>Data Quality:</strong> All critical fields verified with 90%+ confidence. 
          Email and phone verified through multiple sources.
        </Typography>
      </Box>
    </Paper>
  );
};

export default LeadEnrichment; 