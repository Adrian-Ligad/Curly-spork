import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { Request } from "express";

export const auth0Middleware = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

export interface Auth0Request extends Request {
  auth?: {
    sub: string;
    [key: string]: any;
  };
}
