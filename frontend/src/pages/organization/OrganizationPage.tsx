import React from "react";
import { Typography } from "@mui/material";
import { OrganizationSettings } from "./components/OrganizationSettings/OrganizationSettings";
import { useAuth } from "../../contexts/AuthContext";

export const OrganizationPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Typography>Please log in to access organization settings.</Typography>
    );
  }

  if (!user?.isAdmin) {
    return (
      <Typography>
        You don't have permission to access organization settings.
      </Typography>
    );
  }

  return <OrganizationSettings />;
};
