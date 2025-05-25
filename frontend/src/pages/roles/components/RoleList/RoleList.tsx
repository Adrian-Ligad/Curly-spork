import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { StyledTableContainer, StyledPaper } from "./styles";
import { useRoleList } from "./useRoleList";

interface Role {
  id: string;
  name: string;
  description: string;
  wage: number;
}

interface RoleListProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
}

export const RoleList: React.FC<RoleListProps> = ({
  roles,
  onEdit,
  onDelete,
}) => {
  const {
    selectedRole,
    deleteDialogOpen,
    handleEditClick,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = useRoleList({ roles, onEdit, onDelete });

  return (
    <>
      <StyledPaper>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Hourly Wage</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>${role.wage}/hr</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(role)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(role)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledPaper>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the role "{selectedRole?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
