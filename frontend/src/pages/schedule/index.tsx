import React from "react";
import { Typography, Paper } from "@mui/material";

const Schedule: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Schedule
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          Schedule management interface will be implemented here.
        </Typography>
      </Paper>
    </div>
  );
};

export default Schedule;
