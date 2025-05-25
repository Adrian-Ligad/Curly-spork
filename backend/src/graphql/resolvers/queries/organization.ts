import { Context } from "../../types";

export const organizationQueries = {
  organizations: async (_parent: any, _args: any, context: Context) => {
    return context.prisma.organization.findMany();
  },

  organization: async (
    _parent: any,
    args: { id: string },
    context: Context
  ) => {
    return context.prisma.organization.findUnique({
      where: { id: args.id },
    });
  },

  // TODO: Implement authentication to get current user's organization
  myOrganization: async (_parent: any, _args: any, context: Context) => {
    // This is a placeholder. In reality, you would get the organization ID from the authenticated user
    throw new Error("Not implemented - requires authentication");
  },
};
