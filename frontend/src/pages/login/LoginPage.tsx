import React, { useEffect } from "react";
import { useAuth0User } from "../../auth/useAuth0User";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

export const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading, login } = useAuth0User();
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome to Nurse Scheduler
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Please sign in to continue
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => login()}
          sx={{ mt: 3 }}
        >
          Sign In with Auth0
        </Button>
      </Box>
    </Container>
  );
};
