'use client';
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import IssueReport from '@/src/components/IssueReport';
import IssueList from '@/src/components/IssueList';

export default function Home() {
  const handleIssueReported = (newIssue) => {
    console.log('New issue reported:', newIssue);
    // We'll add auto-refresh later
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          color="primary"
        >
          Improve My City
        </Typography>
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom 
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Report civic issues in your neighborhood. Make your city better!
        </Typography>
        
        <IssueReport onIssueReported={handleIssueReported} />
        <IssueList />
      </Box>
    </Container>
  );
}