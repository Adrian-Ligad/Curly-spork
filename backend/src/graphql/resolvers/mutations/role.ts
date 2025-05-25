import { Context } from "../../types";

interface CreateRoleInput {
  name: string;
  description?: string;
  wage: number;
  metadata?: any;
  organizationId: string;
}

interface UpdateRoleInput {
  name?: string;
  description?: string;
  wage?: number;
  metadata?: any;
}

export const roleMutations = {
  createRole: async (
    _parent: any,
    args: { input: CreateRoleInput },
    context: Context
  ) => {
    return context.prisma.role.create({
      data: {
        name: args.input.name,
        description: args.input.description,
        wage: args.input.wage,
        metadata: args.input.metadata || {},
        organizationId: args.input.organizationId,
      },
    });
  },

  updateRole: async (
    _parent: any,
    args: { id: string; input: UpdateRoleInput },
    context: Context
  ) => {
    const data: any = {};
    if (args.input.name) data.name = args.input.name;
    if (args.input.description !== undefined)
      data.description = args.input.description;
    if (args.input.wage !== undefined) data.wage = args.input.wage;
    if (args.input.metadata !== undefined) data.metadata = args.input.metadata;

    return context.prisma.role.update({
      where: { id: args.id },
      data,
    });
  },

  deleteRole: async (_parent: any, args: { id: string }, context: Context) => {
    return context.prisma.role.delete({
      where: { id: args.id },
    });
  },
};
