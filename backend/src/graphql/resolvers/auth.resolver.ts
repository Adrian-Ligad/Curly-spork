import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import { Auth0Request } from "../../middleware/auth0";
import { PrismaClient } from "@prisma/client";

interface Context {
  req: Auth0Request;
  prisma: PrismaClient;
}

interface User {
  id: string;
  email: string;
  auth0Id: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isAdmin: boolean;
  permissions: string[];
  orgId: string;
  roleId?: string;
}

interface CreateUserInput {
  email: string;
  auth0Id: string;
  firstName: string;
  lastName: string;
  orgId: string;
  roleId?: string;
}

interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  roleId?: string;
  isActive?: boolean;
  isAdmin?: boolean;
  permissions?: string[];
}

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, { req, prisma }: Context) => {
      const auth0Req = req as Auth0Request;
      if (!auth0Req.auth?.sub) {
        throw new AuthenticationError("Not authenticated");
      }

      const user = await prisma.user.findUnique({
        where: { auth0Id: auth0Req.auth.sub },
        include: {
          organization: true,
          role: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    },

    userByAuth0Id: async (
      _: unknown,
      { auth0Id }: { auth0Id: string },
      { prisma }: Context
    ) => {
      return prisma.user.findUnique({
        where: { auth0Id },
        include: {
          organization: true,
          role: true,
        },
      });
    },

    organization: async (_: unknown, __: unknown, { req, prisma }: Context) => {
      const auth0Req = req as Auth0Request;
      if (!auth0Req.auth?.sub) {
        throw new AuthenticationError("Not authenticated");
      }

      const user = await prisma.user.findUnique({
        where: { auth0Id: auth0Req.auth.sub },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const organization = await prisma.organization.findUnique({
        where: { id: user.orgId },
        include: {
          users: true,
          roles: true,
          shifts: true,
        },
      });

      if (!organization) {
        throw new Error("Organization not found");
      }

      return organization;
    },
  },

  Mutation: {
    createUser: async (
      _: unknown,
      { input }: { input: CreateUserInput },
      { req, prisma }: Context
    ) => {
      const auth0Req = req as Auth0Request;
      if (!auth0Req.auth?.sub) {
        throw new AuthenticationError("Not authenticated");
      }

      const currentUser = await prisma.user.findUnique({
        where: { auth0Id: auth0Req.auth.sub },
      });

      if (!currentUser?.isAdmin) {
        throw new ForbiddenError("Only admins can create users");
      }

      return prisma.user.create({
        data: input,
        include: {
          organization: true,
          role: true,
        },
      });
    },

    updateUser: async (
      _: unknown,
      { id, input }: { id: string; input: UpdateUserInput },
      { req, prisma }: Context
    ) => {
      const auth0Req = req as Auth0Request;
      if (!auth0Req.auth?.sub) {
        throw new AuthenticationError("Not authenticated");
      }

      const currentUser = await prisma.user.findUnique({
        where: { auth0Id: auth0Req.auth.sub },
      });

      if (!currentUser?.isAdmin) {
        throw new ForbiddenError("Only admins can update users");
      }

      return prisma.user.update({
        where: { id },
        data: input,
        include: {
          organization: true,
          role: true,
        },
      });
    },

    deleteUser: async (
      _: unknown,
      { id }: { id: string },
      { req, prisma }: Context
    ) => {
      const auth0Req = req as Auth0Request;
      if (!auth0Req.auth?.sub) {
        throw new AuthenticationError("Not authenticated");
      }

      const currentUser = await prisma.user.findUnique({
        where: { auth0Id: auth0Req.auth.sub },
      });

      if (!currentUser?.isAdmin) {
        throw new ForbiddenError("Only admins can delete users");
      }

      await prisma.user.delete({ where: { id } });
      return true;
    },
  },

  User: {
    organization: async (parent: User, _: unknown, { prisma }: Context) => {
      return prisma.organization.findUnique({
        where: { id: parent.orgId },
      });
    },
    role: async (parent: User, _: unknown, { prisma }: Context) => {
      if (!parent.roleId) return null;
      return prisma.role.findUnique({
        where: { id: parent.roleId },
      });
    },
  },
};
