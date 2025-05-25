import React from "react";
import { Typography } from "@mui/material";
import UserList from "./components/UserList";

const Users: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <UserList />
    </div>
  );
};

export default Users;
