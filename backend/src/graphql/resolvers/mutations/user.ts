import { Context } from "../../types";

export const userMutations = {
  createUser: async (
    _parent: any,
    args: { email: string; name: string; role: string },
    context: Context
  ) => {
    return context.prisma.user.create({
      data: {
        email: args.email,
        name: args.name,
        role: args.role,
      },
    });
  },
};
