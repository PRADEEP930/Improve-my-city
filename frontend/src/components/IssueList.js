'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { issueAPI } from '@/src/services/api';
import Image from 'next/image';

const IssueList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await issueAPI.getAllIssues();
      setIssues(response.data.issues);
    } catch (err) {
      setError('Failed to load issues');
      console.error('Error fetching issues:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'in_progress': return 'warning';
      default: return 'error';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Public Issues Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track the status of civic issues in your neighborhood
      </Typography>

      {issues.length === 0 ? (
        <Alert severity="info">No issues reported yet. Be the first to report one!</Alert>
      ) : (
        <Grid container spacing={3}>
          {issues.map((issue) => (
            <Grid item xs={12} md={6} key={issue.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="h3">
                      {issue.title}
                    </Typography>
                    <Chip 
                      label={issue.status.replace('_', ' ')} 
                      color={getStatusColor(issue.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Category: {issue.category_name}
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    {issue.description}
                  </Typography>
                  
                  {issue.photo_url && (
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                      <img 
                        src={`http://localhost:5000${issue.photo_url}`}
                        alt="Issue photo"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 200,
                          borderRadius: 4,
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  )}
                  
                  <Typography variant="caption" color="text.secondary">
                    Reported by: {issue.user_name} • {new Date(issue.created_at).toLocaleDateString()}
                  </Typography>
                  
                  {issue.address && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      Location: {issue.address}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default IssueList;