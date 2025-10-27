import { Container, Typography, Box } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          🏙️ Improve My City
        </Typography>
        <Typography variant="h6" component="h2" color="text.secondary">
          Report civic issues in your neighborhood. Make your city better!
        </Typography>
        <Typography variant="body1" sx={{ mt: 3 }}>
          Application under construction... Features coming soon!
        </Typography>
      </Box>
    </Container>
  );
}