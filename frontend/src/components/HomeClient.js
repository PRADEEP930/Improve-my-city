'use client';
import { Container, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { LocationCity, VolunteerActivism, Public } from '@mui/icons-material';
import IssueReport from './IssueReport';

export default function HomeClient() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <LocationCity sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Report Issues',
      description: 'Quickly report civic problems in your neighborhood with detailed information.'
    },
    {
      icon: <Public sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Track Progress',
      description: 'Monitor the status of reported issues and see real-time updates.'
    },
    {
      icon: <VolunteerActivism sx={{ fontSize: 48, color: 'success.main' }} />,
      title: 'Community Impact',
      description: 'Join thousands of citizens making their cities cleaner and safer.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          py: { xs: 6, md: 10 },
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          borderRadius: 4,
          mt: 2,
          mb: 6,
          px: 3
        }}>
          <Typography 
            variant={isMobile ? "h2" : "h1"} 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🏙️ Improve My City
          </Typography>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h2" 
            color="text.secondary" 
            gutterBottom
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Together, we can build a better community
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 600, 
              margin: '0 auto', 
              opacity: 0.8,
              lineHeight: 1.6 
            }}
          >
            Report, track, and help resolve civic issues in your neighborhood. 
            Join thousands of proactive citizens making their cities cleaner, safer, and more beautiful.
          </Typography>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            How It Works
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
            mt: 4 
          }}>
            {features.map((feature, index) => (
              <Box 
                key={index}
                sx={{ 
                  textAlign: 'center',
                  p: 4,
                  background: 'white',
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.15)'
                  }
                }}
              >
                {feature.icon}
                <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Issue Report Section */}
        <IssueReport />
      </Container>
    </Box>
  );
}