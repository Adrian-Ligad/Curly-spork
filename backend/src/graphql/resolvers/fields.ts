import { Context } from "../types";

export const fieldResolvers = {
  User: {
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
  },
};
