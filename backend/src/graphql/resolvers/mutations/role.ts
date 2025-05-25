import { Context } from "../../types";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { Auth0Request } from "../../../middleware/auth0";

interface CreateRoleInput {
  name: string;
  description?: string;
  wage: number;
  metadata?: any;
  orgId: string;
}

interface UpdateRoleInput {
  name?: string;
  description?: string;
  wage?: number;
  metadata?: any;
}

export const roleMutations = {
  createRole: async (
    _parent: any,
    args: { input: CreateRoleInput },
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    // Check if user has permission to create roles
    const user = await prisma.user.findUnique({
      where: { auth0Id: auth0Req.auth.sub },
      include: { organization: true },
    });

    if (!user?.isAdmin) {
      throw new AuthenticationError("Not authorized to create roles");
    }

    // Verify the organization exists and user belongs to it
    if (user.orgId !== args.input.orgId) {
      throw new UserInputError("Cannot create role for another organization");
    }

    // Check if role with same name exists in the organization
    const existingRole = await prisma.role.findFirst({
      where: {
        name: args.input.name,
        orgId: args.input.orgId,
      },
    });

    if (existingRole) {
      throw new UserInputError(
        "Role with this name already exists in the organization"
      );
    }

    return prisma.role.create({
      data: {
        name: args.input.name,
        description: args.input.description,
        wage: args.input.wage,
        metadata: args.input.metadata || {},
        orgId: args.input.orgId,
      },
      include: {
        organization: true,
        users: true,
      },
    });
  },

  updateRole: async (
    _parent: any,
    args: { id: string; input: UpdateRoleInput },
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    // Check if user has permission to update roles
    const user = await prisma.user.findUnique({
      where: { auth0Id: auth0Req.auth.sub },
    });

    if (!user?.isAdmin) {
      throw new AuthenticationError("Not authorized to update roles");
    }

    // Get the role to verify it belongs to user's organization
    const role = await prisma.role.findUnique({
      where: { id: args.id },
    });

    if (!role) {
      throw new UserInputError("Role not found");
    }

    if (role.orgId !== user.orgId) {
      throw new AuthenticationError(
        "Cannot update role from another organization"
      );
    }

    // If name is being updated, check for uniqueness in the organization
    if (args.input.name) {
      const existingRole = await prisma.role.findFirst({
        where: {
          name: args.input.name,
          orgId: role.orgId,
          id: { not: args.id }, // Exclude current role
        },
      });

      if (existingRole) {
        throw new UserInputError(
          "Role with this name already exists in the organization"
        );
      }
    }

    const data: any = {};
    if (args.input.name) data.name = args.input.name;
    if (args.input.description !== undefined)
      data.description = args.input.description;
    if (args.input.wage !== undefined) data.wage = args.input.wage;
    if (args.input.metadata !== undefined) data.metadata = args.input.metadata;

    return prisma.role.update({
      where: { id: args.id },
      data,
      include: {
        organization: true,
        users: true,
      },
    });
  },

  deleteRole: async (
    _parent: any,
    args: { id: string },
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    // Check if user has permission to delete roles
    const user = await prisma.user.findUnique({
      where: { auth0Id: auth0Req.auth.sub },
    });

    if (!user?.isAdmin) {
      throw new AuthenticationError("Not authorized to delete roles");
    }

    // Get the role to verify it belongs to user's organization
    const role = await prisma.role.findUnique({
      where: { id: args.id },
      include: {
        users: true,
        organization: true,
      },
    });

    if (!role) {
      throw new UserInputError("Role not found");
    }

    if (role.orgId !== user.orgId) {
      throw new AuthenticationError(
        "Cannot delete role from another organization"
      );
    }

    // Check if role has any users
    if (role.users.length > 0) {
      throw new UserInputError("Cannot delete role that has assigned users");
    }

    return prisma.role.delete({
      where: { id: args.id },
      include: {
        organization: true,
        users: true,
      },
    });
  },
};
