import React, { useState } from "react";
import {
  Typography,
  Paper,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { RoleForm } from "./components/RoleForm/RoleForm";
import { RoleList } from "./components/RoleList/RoleList";

const Roles: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  return (
    <div>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Grid item>
          <Typography variant="h4">Roles</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            Create New Role
          </Button>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <RoleList roles={[]} onEdit={() => {}} onDelete={() => {}} />
      </Paper>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Role</DialogTitle>
        <DialogContent>
          <RoleForm onSubmit={handleCloseDialog} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Roles;
