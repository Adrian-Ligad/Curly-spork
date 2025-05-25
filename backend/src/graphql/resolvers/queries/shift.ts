import { Context } from "../../types";

export const shiftQueries = {
  shifts: async (_parent: any, _args: any, context: Context) => {
    return context.prisma.shift.findMany();
  },
  shift: async (_parent: any, args: { id: string }, context: Context) => {
    return context.prisma.shift.findUnique({
      where: { id: args.id },
    });
  },
};
