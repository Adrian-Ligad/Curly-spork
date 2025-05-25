import React from "react";
import { Paper, Typography } from "@mui/material";

const TodaySchedule: React.FC = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Today's Schedule</Typography>
      {/* Add schedule summary implementation here */}
    </Paper>
  );
};

export default TodaySchedule;
