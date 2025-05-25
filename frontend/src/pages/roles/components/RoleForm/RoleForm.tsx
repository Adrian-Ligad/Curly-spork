import React from "react";
import { TextField, Button } from "@mui/material";
import { FormContainer } from "./styles";
import { useRoleForm } from "./useRoleForm";

interface RoleFormProps {
  onSubmit: () => void;
  initialValues?: {
    name: string;
    description: string;
    wage: number;
  };
}

export const RoleForm: React.FC<RoleFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useRoleForm({
      onSubmit,
      initialValues,
    });

  return (
    <form onSubmit={handleSubmit}>
      <FormContainer spacing={3}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Role Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
        />

        <TextField
          fullWidth
          id="description"
          name="description"
          label="Description"
          multiline
          rows={3}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.description && Boolean(errors.description)}
          helperText={touched.description && errors.description}
        />

        <TextField
          fullWidth
          id="wage"
          name="wage"
          label="Hourly Wage"
          type="number"
          value={values.wage}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.wage && Boolean(errors.wage)}
          helperText={touched.wage && errors.wage}
          InputProps={{
            startAdornment: "$",
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          Save Role
        </Button>
      </FormContainer>
    </form>
  );
};
