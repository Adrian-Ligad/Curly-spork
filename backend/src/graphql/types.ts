import { PrismaClient } from "@prisma/client";
import { Auth0Request } from "../middleware/auth0";

export interface Context {
  prisma: PrismaClient;
  req: Auth0Request;
}
