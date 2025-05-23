import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * Login component for user authentication.
 * This is a basic placeholder that can be enhanced with actual login functionality.
 * 
 * @returns {JSX.Element} The Login component
 */
const Login = () => {
  const navigate = useNavigate();

  const handleBackToJournal = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom textAlign="center">
            Daily Journal Login
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            This is a placeholder login page.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleBackToJournal}
          >
            Back to Journal
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
