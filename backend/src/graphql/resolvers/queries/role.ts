import { Context } from "../../types";

export const roleQueries = {
  roles: async (
    _parent: any,
    args: { organizationId: string },
    context: Context
  ) => {
    return context.prisma.role.findMany({
      where: { organizationId: args.organizationId },
    });
  },

  role: async (_parent: any, args: { id: string }, context: Context) => {
    return context.prisma.role.findUnique({
      where: { id: args.id },
    });
  },
};
