import React from "react";
import { Typography } from "@mui/material";
import CalendarView from "./components/CalendarView";

const Schedule: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Schedule
      </Typography>
      <CalendarView />
    </div>
  );
};

export default Schedule;
