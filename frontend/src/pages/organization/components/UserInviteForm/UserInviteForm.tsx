import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface Role {
  id: string;
  name: string;
  description?: string | null;
  wage: number;
}

interface UserInviteFormProps {
  roles: Role[];
  onSubmit: (values: { email: string; roleId: string }) => void;
}

export const UserInviteForm: React.FC<UserInviteFormProps> = ({
  roles,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    roleId: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    roleId: "",
  });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      email: event.target.value,
    }));
    // Clear error when user types
    setErrors((prev) => ({ ...prev, email: "" }));
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      roleId: event.target.value,
    }));
    // Clear error when user selects
    setErrors((prev) => ({ ...prev, roleId: "" }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Simple validation
    const newErrors = {
      email: !formData.email ? "Email is required" : "",
      roleId: !formData.roleId ? "Role is required" : "",
    };

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.roleId) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mt: 2 }}>
      <TextField
        fullWidth
        label="Email"
        value={formData.email}
        onChange={handleEmailChange}
        error={Boolean(errors.email)}
        helperText={errors.email}
        margin="normal"
      />

      <FormControl fullWidth error={Boolean(errors.roleId)} margin="normal">
        <InputLabel>Role</InputLabel>
        <Select
          value={formData.roleId}
          label="Role"
          onChange={handleRoleChange}
        >
          {roles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
        {errors.roleId && <FormHelperText>{errors.roleId}</FormHelperText>}
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Invite User
      </Button>
    </Box>
  );
};
