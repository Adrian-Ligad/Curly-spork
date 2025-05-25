import { Context } from "../types";

export const fieldResolvers = {
  Organization: {
    users: async (parent: any, _args: any, context: Context) => {
      return context.prisma.user.findMany({
        where: { organizationId: parent.id },
      });
    },
    roles: async (parent: any, _args: any, context: Context) => {
      return context.prisma.role.findMany({
        where: { organizationId: parent.id },
      });
    },
    shifts: async (parent: any, _args: any, context: Context) => {
      return context.prisma.shift.findMany({
        where: { organizationId: parent.id },
      });
    },
  },

  Role: {
    organization: async (parent: any, _args: any, context: Context) => {
      return context.prisma.organization.findUnique({
        where: { id: parent.organizationId },
      });
    },
    users: async (parent: any, _args: any, context: Context) => {
      return context.prisma.user.findMany({
        where: { roleId: parent.id },
      });
    },
  },

  User: {
    role: async (parent: any, _args: any, context: Context) => {
      return context.prisma.role.findUnique({
        where: { id: parent.roleId },
      });
    },
    organization: async (parent: any, _args: any, context: Context) => {
      return context.prisma.organization.findUnique({
        where: { id: parent.organizationId },
      });
    },
    shifts: async (parent: any, _args: any, context: Context) => {
      return context.prisma.shift.findMany({
        where: { userId: parent.id },
      });
    },
  },

  Shift: {
    user: async (parent: any, _args: any, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    organization: async (parent: any, _args: any, context: Context) => {
      return context.prisma.organization.findUnique({
        where: { id: parent.organizationId },
      });
    },
  },
};
