import React from "react";
import { Typography, Paper } from "@mui/material";

const Users: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          User management interface will be implemented here.
        </Typography>
      </Paper>
    </div>
  );
};

export default Users;
