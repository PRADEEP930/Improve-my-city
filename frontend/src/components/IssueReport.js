'use client';
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ReportProblem,
  LocationOn,
  Category,
  Description,
  Send
} from '@mui/icons-material';
import { issueAPI } from '../services/api';

const IssueReport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    { id: 1, name: '🚧 Potholes', icon: '🚧' },
    { id: 2, name: '🗑️ Garbage', icon: '🗑️' },
    { id: 3, name: '💡 Street Lights', icon: '💡' },
    { id: 4, name: '💧 Water Supply', icon: '💧' },
    { id: 5, name: '🔄 Sewage', icon: '🔄' },
    { id: 6, name: '🌳 Parks & Green', icon: '🌳' },
    { id: 7, name: '🚦 Traffic Signals', icon: '🚦' },
    { id: 8, name: '其他 Other', icon: '❓' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const submitData = {
        ...formData,
        user_id: 1,
        latitude: 12.9716,
        longitude: 77.5946
      };

      const response = await issueAPI.reportIssue(submitData);
      
      setMessage({
        type: 'success',
        text: '✅ Issue reported successfully! Our team will review it shortly.'
      });
      
      // Reset form with smooth transition
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          category_id: '',
          address: ''
        });
      }, 500);

    } catch (error) {
      setMessage({
        type: 'error',
        text: '❌ Failed to report issue. Please check your connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Zoom in={true} timeout={800}>
      <Paper 
        elevation={8} 
        sx={{ 
          p: { xs: 3, md: 6 }, 
          maxWidth: 800, 
          margin: 'auto', 
          mt: 4,
          mb: 6,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}
      >
        {/* Header Section */}
        <Box textAlign="center" mb={4}>
          <Box 
            sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'primary.main',
              color: 'white',
              p: 2,
              borderRadius: 3,
              mb: 2
            }}
          >
            <ReportProblem sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h4" component="h2" fontWeight="bold">
              Report an Issue
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ opacity: 0.8 }}>
            Help us make our city cleaner and safer
          </Typography>
        </Box>

        {/* Message Alert */}
        <Fade in={!!message.text}>
          <Box mb={3}>
            <Alert 
              severity={message.type} 
              sx={{ 
                borderRadius: 2,
                fontSize: '1rem',
                alignItems: 'center'
              }}
            >
              {message.text}
            </Alert>
          </Box>
        </Fade>

        {/* Form Section */}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Issue Title */}
            <Grid item xs={12}>
              <Card 
                elevation={2} 
                sx={{ 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    borderColor: 'primary.light'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Description sx={{ mr: 1, color: 'primary.main' }} />
                    Issue Title
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Briefly describe the issue (e.g., Large pothole on Main Street)"
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: '1rem'
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Category Selection */}
            <Grid item xs={12}>
              <Card 
                elevation={2} 
                sx={{ 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    borderColor: 'primary.light'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Category sx={{ mr: 1, color: 'primary.main' }} />
                    Category
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: '1rem'
                      }
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id} sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                          <span style={{ marginRight: 12, fontSize: '1.2rem' }}>{category.icon}</span>
                          {category.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </CardContent>
              </Card>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Card 
                elevation={2} 
                sx={{ 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    borderColor: 'primary.light'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Description sx={{ mr: 1, color: 'primary.main' }} />
                    Detailed Description
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Please provide detailed information about the issue. Include specific location details, severity, and any safety concerns..."
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: '1rem'
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Location */}
            <Grid item xs={12}>
              <Card 
                elevation={2} 
                sx={{ 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    borderColor: 'primary.light'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                    Location
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter the exact address or location (e.g., 123 Main Street, near Central Park)"
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: '1rem'
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box textAlign="center" mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={!loading && <Send />}
                  sx={{
                    px: 6,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                    minWidth: 200,
                    '&:hover': {
                      boxShadow: '0 12px 35px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      background: 'linear-gradient(45deg, #90caf9 30%, #bbdefb 90%)'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Submit Report'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Footer Note */}
        <Box textAlign="center" mt={4} pt={3} borderTop="1px solid" borderColor="divider">
          <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
            💡 Your reports help us prioritize and resolve issues faster. Thank you for contributing to a better city!
          </Typography>
        </Box>
      </Paper>
    </Zoom>
  );
};

export default IssueReport;