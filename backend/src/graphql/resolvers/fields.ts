import { Context } from "../types";
import { Organization, Role, User, Shift } from "@prisma/client";

interface OrganizationParent extends Organization {
  id: string;
}

interface RoleParent extends Role {
  id: string;
  orgId: string;
}

interface UserParent extends User {
  id: string;
  orgId: string;
  roleId: string | null;
}

interface ShiftParent extends Shift {
  id: string;
  orgId: string;
  userId: string | null;
}

export const fieldResolvers = {
  Organization: {
    users: async (
      parent: OrganizationParent,
      _args: any,
      { prisma }: Context
    ) => {
      return prisma.user.findMany({
        where: { orgId: parent.id },
      });
    },
    roles: async (
      parent: OrganizationParent,
      _args: any,
      { prisma }: Context
    ) => {
      return prisma.role.findMany({
        where: { orgId: parent.id },
      });
    },
    shifts: async (
      parent: OrganizationParent,
      _args: any,
      { prisma }: Context
    ) => {
      return prisma.shift.findMany({
        where: { orgId: parent.id },
      });
    },
  },

  Role: {
    organization: async (
      parent: RoleParent,
      _args: any,
      { prisma }: Context
    ) => {
      return prisma.organization.findUnique({
        where: { id: parent.orgId },
      });
    },
    users: async (parent: RoleParent, _args: any, { prisma }: Context) => {
      return prisma.user.findMany({
        where: { roleId: parent.id },
      });
    },
  },

  User: {
    role: async (parent: UserParent, _args: any, { prisma }: Context) => {
      if (!parent.roleId) return null;
      return prisma.role.findUnique({
        where: { id: parent.roleId },
      });
    },
    organization: async (
      parent: UserParent,
      _args: any,
      { prisma }: Context
    ) => {
      return prisma.organization.findUnique({
        where: { id: parent.orgId },
      });
    },
    shifts: async (parent: UserParent, _args: any, { prisma }: Context) => {
      return prisma.shift.findMany({
        where: { userId: parent.id },
      });
    },
  },

  Shift: {
    user: async (parent: ShiftParent, _args: any, { prisma }: Context) => {
      if (!parent.userId) return null;
      return prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    organization: async (
      parent: ShiftParent,
      _args: any,
      { prisma }: Context
    ) => {
      return prisma.organization.findUnique({
        where: { id: parent.orgId },
      });
    },
  },
};
