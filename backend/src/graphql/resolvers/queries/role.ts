import { Context } from "../../types";
import { AuthenticationError } from "apollo-server-express";
import { Auth0Request } from "../../../middleware/auth0";

export const roleQueries = {
  roles: async (
    _parent: any,
    args: { organizationId: string },
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    return prisma.role.findMany({
      where: { orgId: args.organizationId },
      include: {
        users: true,
      },
    });
  },

  role: async (
    _parent: any,
    args: { id: string },
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    return prisma.role.findUnique({
      where: { id: args.id },
      include: {
        users: true,
        organization: true,
      },
    });
  },
};
