import React from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { FormContainer } from "./styles";
import { useOrganizationSignupForm } from "./useOrganizationSignupForm";

export const OrganizationSignupForm: React.FC = () => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useOrganizationSignupForm();

  return (
    <form onSubmit={handleSubmit}>
      <FormContainer spacing={3}>
        <Typography variant="h5" gutterBottom>
          Create Your Organization
        </Typography>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Organization Details
          </Typography>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Organization Name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
            margin="normal"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Admin Account
          </Typography>
          <TextField
            fullWidth
            id="adminEmail"
            name="adminEmail"
            label="Email"
            type="email"
            value={values.adminEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.adminEmail && Boolean(errors.adminEmail)}
            helperText={touched.adminEmail && errors.adminEmail}
            margin="normal"
          />
          <TextField
            fullWidth
            id="adminPassword"
            name="adminPassword"
            label="Password"
            type="password"
            value={values.adminPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.adminPassword && Boolean(errors.adminPassword)}
            helperText={touched.adminPassword && errors.adminPassword}
            margin="normal"
          />
          <TextField
            fullWidth
            id="adminFirstName"
            name="adminFirstName"
            label="First Name"
            value={values.adminFirstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.adminFirstName && Boolean(errors.adminFirstName)}
            helperText={touched.adminFirstName && errors.adminFirstName}
            margin="normal"
          />
          <TextField
            fullWidth
            id="adminLastName"
            name="adminLastName"
            label="Last Name"
            value={values.adminLastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.adminLastName && Boolean(errors.adminLastName)}
            helperText={touched.adminLastName && errors.adminLastName}
            margin="normal"
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={isSubmitting}
        >
          Create Organization
        </Button>
      </FormContainer>
    </form>
  );
};
