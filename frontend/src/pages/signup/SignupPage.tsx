import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { OrganizationSignupForm } from "./components/OrganizationSignupForm/OrganizationSignupForm";

export const SignupPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create Your Organization
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Get started with your nurse scheduling platform
        </Typography>
        <OrganizationSignupForm />
      </Box>
    </Container>
  );
};
