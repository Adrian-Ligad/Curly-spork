import React from "react";
import { Typography, Grid } from "@mui/material";
import TodaySchedule from "./components/TodaySchedule";
import StaffOverview from "./components/StaffOverview";

const Dashboard: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TodaySchedule />
        </Grid>
        <Grid item xs={12} md={6}>
          <StaffOverview />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
