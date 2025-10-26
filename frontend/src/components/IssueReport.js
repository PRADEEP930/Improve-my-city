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
  Collapse
} from '@mui/material';
import { issueAPI } from '@/src/services/api';
import MapComponent from './MapComponent';
import { CloudUpload } from '@mui/icons-material';
import Image from 'next/image';

const IssueReport = ({ onIssueReported }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showMap, setShowMap] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');

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

  const handleLocationSelect = (location) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
      address: prevFormData.address 
        ? `${prevFormData.address} (Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)})`
        : `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
    }));
  };

  // Add file handling functions
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setFilePreview(e.target.result);
    reader.readAsDataURL(file);
  }
};

const removeFile = () => {
  setSelectedFile(null);
  setFilePreview('');
};

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage({ type: '', text: '' });
  
    try {
      const formDataToSend = new FormData();
      
      // PROPERLY append all form fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category_id', formData.category_id.toString()); // Ensure string
      formDataToSend.append('address', formData.address);
      formDataToSend.append('latitude', (parseFloat(formData.latitude) || 12.9716).toString());
      formDataToSend.append('longitude', (parseFloat(formData.longitude) || 77.5946).toString());
      formDataToSend.append('user_id', '1'); // String
      
      if (selectedFile) {
        formDataToSend.append('photo', selectedFile);
      }
  
      console.log('Sending FormData with fields:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key + ': ' + (value instanceof File ? value.name : value));
      }
  
      const response = await fetch('http://localhost:5000/api/issues/report', {
        method: 'POST',
        body: formDataToSend  // NO Content-Type header for FormData!
      });
  
      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Issue reported successfully with photo!' });
        // Reset form
        setFormData({
          title: '', description: '', category_id: '', address: '', latitude: '', longitude: ''
        });
        setSelectedFile(null);
        setFilePreview('');
        setShowMap(false);
        
        if (onIssueReported) {
          onIssueReported(result.issue);
        }
      } else {
        setMessage({ type: 'error', text: result.message });
      }
  
    } catch (error) {
      console.error('Full error:', error);
      setMessage({
        type: 'error',
        text: 'Failed to report issue. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
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
              placeholder="Please provide detailed description of the issue..."
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? 'Hide Map' : 'Set Location on Map'}
              </Button>
              <Typography variant="body2" color="text.secondary">
                {formData.latitude && formData.longitude 
                  ? `Location set: ${formData.latitude}, ${formData.longitude}`
                  : 'Click button to set location on map'}
              </Typography>
            </Box>

            <Collapse in={showMap}>
              <MapComponent 
                onLocationSelect={handleLocationSelect}
                initialLocation={formData.latitude && formData.longitude ? {
                  lat: parseFloat(formData.latitude),
                  lng: parseFloat(formData.longitude)
                } : null}
              />
            </Collapse>
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

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="12.9716"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="77.5946"
            />
          </Grid>

          {/* Photo Upload Section */}

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Add Photo (Optional)
            </Typography>
                        
            {!filePreview ? (
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ py: 2 }}
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </Button>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Image 
                  src={filePreview} 
                  alt="Preview" 
                  width={300}
                  height={200}
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto', 
                    borderRadius: 8,
                    marginBottom: 8
                  }} 
                />
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={removeFile}
                >
                  Remove Photo
                </Button>
              </Box>
            )}
            <Typography variant="caption" color="text.secondary">
              Upload a photo of the issue (JPEG, PNG, GIF - max 5MB)
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
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