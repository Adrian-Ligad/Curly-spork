import React from "react";
import { Typography, Paper, Grid } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Recent Schedules</Typography>
            {/* Add schedule summary content here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Staff Overview</Typography>
            {/* Add staff overview content here */}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
