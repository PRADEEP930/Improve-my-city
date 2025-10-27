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
  Grid
} from '@mui/material';
import { issueAPI } from '../services/api';

const IssueReport = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    { id: 1, name: 'Potholes' },
    { id: 2, name: 'Garbage' },
    { id: 3, name: 'Street Lights' },
    { id: 4, name: 'Water Supply' },
    { id: 5, name: 'Sewage' }
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

      console.log('Submitting to:', API_BASE_URL);
      
      const response = await issueAPI.reportIssue(submitData);
      
      setMessage({
        type: 'success',
        text: 'Issue reported successfully!'
      });
      
      setFormData({
        title: '',
        description: '',
        category_id: '',
        address: ''
      });

    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to report issue. Please try again.'
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Report Civic Issue
      </Typography>
      
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Issue Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Large pothole on Main Street"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              select
              label="Category"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide detailed description..."
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Address/Location"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., Near City Center, Main Street"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Report Issue'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default IssueReport;