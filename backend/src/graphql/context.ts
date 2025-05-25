import { PrismaClient } from "@prisma/client";
import { Request } from "express";

export interface Context {
  prisma: PrismaClient;
  req: Request;
  // Add any additional context properties here
  organizationId?: string;
  userId?: string;
}
