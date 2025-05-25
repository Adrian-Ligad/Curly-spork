import { Context } from "../../types";

interface CreateOrganizationInput {
  name: string;
  description?: string;
}

export const organizationMutations = {
  createOrganization: async (
    _parent: any,
    args: { input: CreateOrganizationInput },
    context: Context
  ) => {
    return context.prisma.organization.create({
      data: {
        name: args.input.name,
        description: args.input.description,
      },
    });
  },

  updateOrganization: async (
    _parent: any,
    args: { id: string; input: CreateOrganizationInput },
    context: Context
  ) => {
    return context.prisma.organization.update({
      where: { id: args.id },
      data: {
        name: args.input.name,
        description: args.input.description,
      },
    });
  },
};
