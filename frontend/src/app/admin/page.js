'use client';
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import AdminDashboard from '@/src/components/AdminDashboard';

export default function AdminPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <AdminDashboard />
      </Box>
    </Container>
  );
}