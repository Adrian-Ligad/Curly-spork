import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Nurse Scheduler
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/schedule">
            Schedule
          </Button>
          <Button color="inherit" component={RouterLink} to="/users">
            Users
          </Button>
          <Button color="inherit" component={RouterLink} to="/roles">
            Roles
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
