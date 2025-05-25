import { Context } from "../../types";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { Auth0Request } from "../../../middleware/auth0";

interface CreateShiftInput {
  startTime: string;
  endTime: string;
  userId?: string;
  orgId: string;
}

export const shiftMutations = {
  createShift: async (
    _parent: any,
    args: { input: CreateShiftInput },
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    // Check if user has permission to create shifts
    const currentUser = await prisma.user.findUnique({
      where: { auth0Id: auth0Req.auth.sub },
    });

    if (!currentUser?.isAdmin) {
      throw new AuthenticationError("Not authorized to create shifts");
    }

    // Verify the organization exists and user belongs to it
    if (currentUser.orgId !== args.input.orgId) {
      throw new UserInputError("Cannot create shift for another organization");
    }

    // If userId is provided, verify the user exists and belongs to the organization
    if (args.input.userId) {
      const user = await prisma.user.findUnique({
        where: { id: args.input.userId },
      });

      if (!user) {
        throw new UserInputError("User not found");
      }

      if (user.orgId !== args.input.orgId) {
        throw new UserInputError(
          "User does not belong to the specified organization"
        );
      }
    }

    // Validate shift times
    const startTime = new Date(args.input.startTime);
    const endTime = new Date(args.input.endTime);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new UserInputError("Invalid date format");
    }

    if (startTime >= endTime) {
      throw new UserInputError("Start time must be before end time");
    }

    if (startTime < new Date()) {
      throw new UserInputError("Cannot create shifts in the past");
    }

    // Check for overlapping shifts if user is assigned
    if (args.input.userId) {
      const overlappingShift = await prisma.shift.findFirst({
        where: {
          userId: args.input.userId,
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
          ],
        },
      });

      if (overlappingShift) {
        throw new UserInputError("User already has a shift during this time");
      }
    }

    return prisma.shift.create({
      data: {
        startTime,
        endTime,
        userId: args.input.userId,
        orgId: args.input.orgId,
      },
      include: {
        organization: true,
        user: true,
      },
    });
  },

  updateShift: async (
    _parent: any,
    args: { id: string; input: CreateShiftInput },
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    // Check if user has permission to update shifts
    const currentUser = await prisma.user.findUnique({
      where: { auth0Id: auth0Req.auth.sub },
    });

    if (!currentUser?.isAdmin) {
      throw new AuthenticationError("Not authorized to update shifts");
    }

    // Get the shift to verify it belongs to user's organization
    const shift = await prisma.shift.findUnique({
      where: { id: args.id },
    });

    if (!shift) {
      throw new UserInputError("Shift not found");
    }

    if (shift.orgId !== currentUser.orgId) {
      throw new AuthenticationError(
        "Cannot update shift from another organization"
      );
    }

    // Validate shift times
    const startTime = new Date(args.input.startTime);
    const endTime = new Date(args.input.endTime);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new UserInputError("Invalid date format");
    }

    if (startTime >= endTime) {
      throw new UserInputError("Start time must be before end time");
    }

    if (
      startTime < new Date() &&
      startTime.getTime() !== shift.startTime.getTime()
    ) {
      throw new UserInputError("Cannot modify shifts in the past");
    }

    // If userId is provided, verify the user exists and belongs to the organization
    if (args.input.userId) {
      const user = await prisma.user.findUnique({
        where: { id: args.input.userId },
      });

      if (!user) {
        throw new UserInputError("User not found");
      }

      if (user.orgId !== shift.orgId) {
        throw new UserInputError(
          "User does not belong to the shift's organization"
        );
      }

      // Check for overlapping shifts
      const overlappingShift = await prisma.shift.findFirst({
        where: {
          id: { not: args.id },
          userId: args.input.userId,
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
          ],
        },
      });

      if (overlappingShift) {
        throw new UserInputError("User already has a shift during this time");
      }
    }

    return prisma.shift.update({
      where: { id: args.id },
      data: {
        startTime,
        endTime,
        userId: args.input.userId,
      },
      include: {
        organization: true,
        user: true,
      },
    });
  },

  deleteShift: async (
    _parent: any,
    args: { id: string },
    { req, prisma }: Context
  ) => {
    const auth0Req = req as Auth0Request;
    if (!auth0Req.auth?.sub) {
      throw new AuthenticationError("Not authenticated");
    }

    // Check if user has permission to delete shifts
    const currentUser = await prisma.user.findUnique({
      where: { auth0Id: auth0Req.auth.sub },
    });

    if (!currentUser?.isAdmin) {
      throw new AuthenticationError("Not authorized to delete shifts");
    }

    // Get the shift to verify it belongs to user's organization
    const shift = await prisma.shift.findUnique({
      where: { id: args.id },
    });

    if (!shift) {
      throw new UserInputError("Shift not found");
    }

    if (shift.orgId !== currentUser.orgId) {
      throw new AuthenticationError(
        "Cannot delete shift from another organization"
      );
    }

    // Prevent deleting past shifts
    if (new Date(shift.startTime) < new Date()) {
      throw new UserInputError("Cannot delete shifts in the past");
    }

    return prisma.shift.delete({
      where: { id: args.id },
      include: {
        organization: true,
        user: true,
      },
    });
  },
};
