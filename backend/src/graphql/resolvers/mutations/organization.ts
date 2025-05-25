import { Context } from "../../types";
import { AuthenticationError } from "apollo-server-express";
import { Auth0Request } from "../../../middleware/auth0";

interface CreateOrganizationInput {
  name: string;
  slug: string;
}

export const organizationMutations = {
  createOrganization: async (
    _parent: any,
    args: { input: CreateOrganizationInput },
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    // Check if organization with slug already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: args.input.slug },
    });

    if (existingOrg) {
      throw new Error("Organization with this slug already exists");
    }

    // Create the organization
    const organization = await prisma.organization.create({
      data: {
        name: args.input.name,
        slug: args.input.slug,
      },
      include: {
        users: true,
        roles: true,
        shifts: true,
      },
    });

    // Create an admin user for the organization
    await prisma.user.create({
      data: {
        email: auth0Req.auth.email || "",
        auth0Id: auth0Req.auth.sub,
        firstName: auth0Req.auth.given_name || "",
        lastName: auth0Req.auth.family_name || "",
        isAdmin: true,
        orgId: organization.id,
        permissions: ["ADMIN"],
      },
    });

    return organization;
  },

  updateOrganization: async (
    _parent: any,
    args: { id: string; input: CreateOrganizationInput },
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    // Check if user has permission to update this organization
    const user = await prisma.user.findUnique({
      where: { auth0Id: auth0Req.auth.sub },
    });

    if (!user?.isAdmin) {
      throw new AuthenticationError("Not authorized to update organization");
    }

    // If slug is being changed, check if new slug is available
    if (args.input.slug) {
      const existingOrg = await prisma.organization.findFirst({
        where: {
          slug: args.input.slug,
          id: { not: args.id }, // Exclude current organization
        },
      });

      if (existingOrg) {
        throw new Error("Organization with this slug already exists");
      }
    }

    return prisma.organization.update({
      where: { id: args.id },
      data: {
        name: args.input.name,
        slug: args.input.slug,
      },
      include: {
        users: true,
        roles: true,
        shifts: true,
      },
    });
  },
};
