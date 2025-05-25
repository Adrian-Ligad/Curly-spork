import { Context } from "../../types";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { Auth0Request } from "../../../middleware/auth0";
import { Shift } from "@prisma/client";

interface CreateUserInput {
  email: string;
  auth0Id: string;
  firstName: string;
  lastName: string;
  roleId?: string;
  orgId: string;
  isAdmin?: boolean;
  permissions?: string[];
}

interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  roleId?: string;
  isActive?: boolean;
  isAdmin?: boolean;
  permissions?: string[];
}

export const userMutations = {
  createUser: async (
    _parent: any,
    args: { input: CreateUserInput },
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    // Check if user has permission to create users
    const currentUser = await prisma.user.findUnique({
      where: { auth0Id: auth0Req.auth.sub },
    });

    if (!currentUser?.isAdmin) {
      throw new AuthenticationError("Not authorized to create users");
    }

    // Verify the organization exists and user belongs to it
    if (currentUser.orgId !== args.input.orgId) {
      throw new UserInputError("Cannot create user for another organization");
    }

    // Check if user with same email or auth0Id exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: args.input.email }, { auth0Id: args.input.auth0Id }],
      },
    });

    if (existingUser) {
      throw new UserInputError(
        "User with this email or Auth0 ID already exists"
      );
    }

    // If roleId is provided, verify it exists and belongs to the organization
    if (args.input.roleId) {
      const role = await prisma.role.findUnique({
        where: { id: args.input.roleId },
      });

      if (!role) {
        throw new UserInputError("Role not found");
      }

      if (role.orgId !== args.input.orgId) {
        throw new UserInputError(
          "Role does not belong to the specified organization"
        );
      }
    }

    return prisma.user.create({
      data: {
        email: args.input.email,
        auth0Id: args.input.auth0Id,
        firstName: args.input.firstName,
        lastName: args.input.lastName,
        roleId: args.input.roleId,
        orgId: args.input.orgId,
        isAdmin: args.input.isAdmin || false,
        permissions: args.input.permissions || [],
        isActive: true,
      },
      include: {
        organization: true,
        role: true,
        shifts: true,
      },
    });
  },

  updateUser: async (
    _parent: any,
    args: { id: string; input: UpdateUserInput },
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    // Check if user has permission to update users
    const currentUser = await prisma.user.findUnique({
      where: { auth0Id: auth0Req.auth.sub },
    });

    if (!currentUser?.isAdmin) {
      throw new AuthenticationError("Not authorized to update users");
    }

    // Get the user to verify they belong to the same organization
    const targetUser = await prisma.user.findUnique({
      where: { id: args.id },
    });

    if (!targetUser) {
      throw new UserInputError("User not found");
    }

    if (targetUser.orgId !== currentUser.orgId) {
      throw new AuthenticationError(
        "Cannot update user from another organization"
      );
    }

    // If roleId is provided, verify it exists and belongs to the organization
    if (args.input.roleId) {
      const role = await prisma.role.findUnique({
        where: { id: args.input.roleId },
      });

      if (!role) {
        throw new UserInputError("Role not found");
      }

      if (role.orgId !== targetUser.orgId) {
        throw new UserInputError(
          "Role does not belong to the user's organization"
        );
      }
    }

    // Prevent removing admin status from the last admin
    if (args.input.isAdmin === false && targetUser.isAdmin) {
      const adminCount = await prisma.user.count({
        where: {
          orgId: targetUser.orgId,
          isAdmin: true,
        },
      });

      if (adminCount === 1) {
        throw new UserInputError(
          "Cannot remove admin status from the last admin user"
        );
      }
    }

    return prisma.user.update({
      where: { id: args.id },
      data: {
        firstName: args.input.firstName,
        lastName: args.input.lastName,
        roleId: args.input.roleId,
        isActive: args.input.isActive,
        isAdmin: args.input.isAdmin,
        permissions: args.input.permissions,
      },
      include: {
        organization: true,
        role: true,
        shifts: true,
      },
    });
  },

  deleteUser: async (
    _parent: any,
    args: { id: string },
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    // Check if user has permission to delete users
    const currentUser = await prisma.user.findUnique({
      where: { auth0Id: auth0Req.auth.sub },
    });

    if (!currentUser?.isAdmin) {
      throw new AuthenticationError("Not authorized to delete users");
    }

    // Get the user to verify they belong to the same organization
    const targetUser = await prisma.user.findUnique({
      where: { id: args.id },
      include: {
        shifts: true,
      },
    });

    if (!targetUser) {
      throw new UserInputError("User not found");
    }

    if (targetUser.orgId !== currentUser.orgId) {
      throw new AuthenticationError(
        "Cannot delete user from another organization"
      );
    }

    // Prevent deleting the last admin
    if (targetUser.isAdmin) {
      const adminCount = await prisma.user.count({
        where: {
          orgId: targetUser.orgId,
          isAdmin: true,
        },
      });

      if (adminCount === 1) {
        throw new UserInputError("Cannot delete the last admin user");
      }
    }

    // Check if user has any future shifts
    const hasActiveShifts = targetUser.shifts.some(
      (shift: Shift) => new Date(shift.startTime) > new Date()
    );

    if (hasActiveShifts) {
      throw new UserInputError("Cannot delete user with future shifts");
    }

    return prisma.user.delete({
      where: { id: args.id },
      include: {
        organization: true,
        role: true,
        shifts: true,
      },
    });
  },
};
