import { Context } from "../../types";

export const shiftMutations = {
  createShift: async (
    _parent: any,
    args: { userId: string; startTime: string; endTime: string },
    context: Context
  ) => {
    return context.prisma.shift.create({
      data: {
        userId: args.userId,
        startTime: new Date(args.startTime),
        endTime: new Date(args.endTime),
      },
    });
  },
  updateShift: async (
    _parent: any,
    args: { id: string; startTime?: string; endTime?: string },
    context: Context
  ) => {
    const data: any = {};
    if (args.startTime) data.startTime = new Date(args.startTime);
    if (args.endTime) data.endTime = new Date(args.endTime);

    return context.prisma.shift.update({
      where: { id: args.id },
      data,
    });
  },
  deleteShift: async (_parent: any, args: { id: string }, context: Context) => {
    return context.prisma.shift.delete({
      where: { id: args.id },
    });
  },
};
