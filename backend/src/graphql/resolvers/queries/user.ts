import { Context } from "../../types";

export const userQueries = {
  users: async (_parent: any, _args: any, context: Context) => {
    return context.prisma.user.findMany();
  },
  user: async (_parent: any, args: { id: string }, context: Context) => {
    return context.prisma.user.findUnique({
      where: { id: args.id },
    });
  },
};
