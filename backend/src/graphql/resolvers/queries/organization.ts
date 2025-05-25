import { Context } from "../../types";
import { AuthenticationError } from "apollo-server-express";
import { Auth0Request } from "../../../middleware/auth0";

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

  myOrganization: async (
    _parent: any,
    _args: any,
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { auth0Id: auth0Req.auth.sub },
      include: {
        organization: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.organization) {
      throw new Error("User is not associated with an organization");
    }

    return user.organization;
  },
};
