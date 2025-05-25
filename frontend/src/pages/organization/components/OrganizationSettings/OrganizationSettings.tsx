import React from "react";
import {
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { UserInviteForm } from "../UserInviteForm/UserInviteForm";
import { Container } from "./styles";
import {
  useGetOrganizationQuery,
  useCreateUserMutation,
} from "../../../../generated/graphql";

interface Role {
  id: string;
  name: string;
  description?: string | null;
  wage: number;
}

export const OrganizationSettings: React.FC = () => {
  const { data, loading } = useGetOrganizationQuery();
  const [createUser] = useCreateUserMutation();

  const handleInviteUser = async (values: {
    email: string;
    roleId: string;
  }) => {
    try {
      await createUser({
        variables: {
          input: {
            ...values,
            auth0Id: `auth0|${Math.random().toString(36).substring(2)}`,
            firstName: "",
            lastName: "",
            orgId: organization?.id || "",
          },
        },
      });
      // You might want to add a success notification here
    } catch (error) {
      // Handle error
      console.error("Failed to invite user:", error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const organization = data?.myOrganization;

  if (!organization) {
    return <Typography>No organization found</Typography>;
  }

  const roles: Role[] = organization.roles.map((role) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    wage: role.wage,
  }));

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Organization Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Organization Details
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Name" secondary={organization.name} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Created At"
                  secondary={
                    organization.createdAt
                      ? new Date(organization.createdAt).toLocaleDateString()
                      : "N/A"
                  }
                />
              </ListItem>
            </List>
          </Paper>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Invite User
            </Typography>
            <UserInviteForm roles={roles} onSubmit={handleInviteUser} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
