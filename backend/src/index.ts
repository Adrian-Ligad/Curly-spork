import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { auth0Middleware } from "./middleware/auth0";
import cors from "cors";
import { introspectionFromSchema } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";

const prisma = new PrismaClient();

async function startServer() {
  const app: Application = express();

  // Enable CORS
  app.use(cors());

  // Create the schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // Add public schema endpoint
  app.get("/graphql/public-schema", async (_, res) => {
    const introspection = introspectionFromSchema(schema);
    res.setHeader("Content-Type", "application/json");
    res.json({ data: introspection });
  });

  // Apply Auth0 middleware to all other routes
  app.use("/graphql", auth0Middleware);

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => ({
      prisma,
      req,
    }),
  });

  await apolloServer.start();

  // Apply Apollo middleware with explicit typing
  apolloServer.applyMiddleware({
    app: app as any,
    cors: false, // We're handling CORS with the express middleware
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
});
