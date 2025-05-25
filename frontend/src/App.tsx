import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Navbar from "./shared-components/Navbar";
import Dashboard from "./pages/dashboard";
import Schedule from "./pages/schedule";
import Users from "./pages/users";
import Roles from "./pages/roles";

const App: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/users" element={<Users />} />
          <Route path="/roles" element={<Roles />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
