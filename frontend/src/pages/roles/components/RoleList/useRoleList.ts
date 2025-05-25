import { useState } from "react";

interface Role {
  id: string;
  name: string;
  description: string;
  wage: number;
}

interface UseRoleListProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
}

export const useRoleList = ({ roles, onEdit, onDelete }: UseRoleListProps) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    onEdit(role);
  };

  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRole) {
      onDelete(selectedRole.id);
      setDeleteDialogOpen(false);
      setSelectedRole(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedRole(null);
  };

  return {
    selectedRole,
    deleteDialogOpen,
    handleEditClick,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};
