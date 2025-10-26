'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { issueAPI } from '@/src/services/api';
import Image from 'next/image';

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      await issueAPI.updateIssueStatus(issueId, newStatus);
      // Refresh the issues list
      fetchIssues();
    } catch (err) {
      setError('Failed to update issue status');
      console.error('Error updating status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'in_progress': return 'warning';
      default: return 'error';
    }
  };

  const filteredIssues = statusFilter === 'all' 
    ? issues 
    : issues.filter(issue => issue.status === statusFilter);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Manage and update issue status
        </Typography>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Issues</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {filteredIssues.length === 0 ? (
        <Alert severity="info">No issues found for the selected filter.</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredIssues.map((issue) => (
            <Grid item xs={12} md={6} lg={4} key={issue.id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="h3" sx={{ flex: 1, mr: 1 }}>
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
                  
                  <Typography variant="body2" paragraph sx={{ minHeight: 60 }}>
                    {issue.description}
                  </Typography>

                  {issue.photo_url && (
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                      <img 
                        src={`http://localhost:5000${issue.photo_url}`}
                        alt="Issue photo"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 150,
                          borderRadius: 4,
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  )}
                  
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Reported by: {issue.user_name}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    {new Date(issue.created_at).toLocaleDateString()} • {issue.address}
                  </Typography>

                  {/* Status Update Buttons */}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {issue.status !== 'in_progress' && (
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="warning"
                        onClick={() => updateIssueStatus(issue.id, 'in_progress')}
                      >
                        Mark In Progress
                      </Button>
                    )}
                    {issue.status !== 'resolved' && (
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="success"
                        onClick={() => updateIssueStatus(issue.id, 'resolved')}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    {issue.status !== 'pending' && (
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error"
                        onClick={() => updateIssueStatus(issue.id, 'pending')}
                      >
                        Reopen
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminDashboard;