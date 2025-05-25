import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Navbar from "./shared-components/Navbar";
import Dashboard from "./pages/dashboard";
import Schedule from "./pages/schedule";
import Users from "./pages/users";
import Roles from "./pages/roles";
import { LoginPage } from "./pages/login/LoginPage";
import { ProtectedRoute } from "./auth/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <Roles />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
