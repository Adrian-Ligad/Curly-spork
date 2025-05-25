import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Helper to convert Prisma types to GraphQL types
const prismaToGraphQLType = (field: any): string => {
  const type = field.type;
  const isRequired = !field.isNullable;
  const isList = field.isList;

  let gqlType = "";

  switch (type) {
    case "String":
      gqlType = "String";
      break;
    case "Int":
      gqlType = "Int";
      break;
    case "Float":
      gqlType = "Float";
      break;
    case "Boolean":
      gqlType = "Boolean";
      break;
    case "DateTime":
      gqlType = "String";
      break;
    case "Json":
      gqlType = "JSON";
      break;
    default:
      gqlType = type;
  }

  if (isList) {
    gqlType = `[${gqlType}!]`;
  }

  return `${gqlType}${isRequired ? "!" : ""}`;
};

// Helper to convert Prisma types to TypeScript types
const prismaToTSType = (field: any): string => {
  const type = field.type;
  const isRequired = !field.isNullable;
  const isList = field.isList;

  let tsType = "";

  switch (type) {
    case "String":
      tsType = "string";
      break;
    case "Int":
    case "Float":
      tsType = "number";
      break;
    case "Boolean":
      tsType = "boolean";
      break;
    case "DateTime":
      tsType = "Date";
      break;
    case "Json":
      tsType = "any";
      break;
    default:
      tsType = type;
  }

  if (isList) {
    tsType = `${tsType}[]`;
  }

  return `${tsType}${isRequired ? "" : " | null"}`;
};

const generateSchema = async () => {
  const dmmfClient = (prisma as any)._baseDmmf;
  const models = dmmfClient.modelMap;

  // Generate GraphQL Schema
  let schemaContent = `import { gql } from 'apollo-server-express';

export const typeDefs = gql\`
  scalar JSON
  scalar DateTime

  # Types
${Object.values(models)
  .map(
    (model: any) => `  type ${model.name} {
${model.fields
  .map((field: any) => `    ${field.name}: ${prismaToGraphQLType(field)}`)
  .join("\n")}
  }`
  )
  .join("\n\n")}

  # Inputs
${Object.values(models)
  .map(
    (model: any) => `  input Create${model.name}Input {
${model.fields
  .filter((f: any) => !f.isId && !f.isReadOnly)
  .map(
    (field: any) =>
      `    ${field.name}: ${prismaToGraphQLType({
        ...field,
        isNullable: true,
      })}`
  )
  .join("\n")}
  }

  input Update${model.name}Input {
${model.fields
  .filter((f: any) => !f.isId && !f.isReadOnly)
  .map(
    (field: any) =>
      `    ${field.name}: ${prismaToGraphQLType({
        ...field,
        isNullable: true,
      })}`
  )
  .join("\n")}
  }`
  )
  .join("\n\n")}

  # Queries
  type Query {
${Object.values(models)
  .map(
    (model: any) => `    # ${model.name} queries
    ${model.name.toLowerCase()}s(organizationId: ID!): [${model.name}!]!
    ${model.name.toLowerCase()}(id: ID!): ${model.name}`
  )
  .join("\n\n")}
  }

  # Mutations
  type Mutation {
${Object.values(models)
  .map(
    (model: any) => `    # ${model.name} mutations
    create${model.name}(input: Create${model.name}Input!): ${model.name}!
    update${model.name}(id: ID!, input: Update${model.name}Input!): ${model.name}!
    delete${model.name}(id: ID!): ${model.name}!`
  )
  .join("\n\n")}
  }
\`;`;

  // Generate Types
  let typesContent = `import { Context } from './context';

${Object.values(models)
  .map(
    (model: any) => `export interface ${model.name} {
${model.fields
  .map((field: any) => `  ${field.name}: ${prismaToTSType(field)};`)
  .join("\n")}
}

export interface Create${model.name}Input {
${model.fields
  .filter((f: any) => !f.isId && !f.isReadOnly)
  .map(
    (field: any) =>
      `  ${field.name}?: ${prismaToTSType({ ...field, isNullable: true })};`
  )
  .join("\n")}
}

export interface Update${model.name}Input {
${model.fields
  .filter((f: any) => !f.isId && !f.isReadOnly)
  .map(
    (field: any) =>
      `  ${field.name}?: ${prismaToTSType({ ...field, isNullable: true })};`
  )
  .join("\n")}
}`
  )
  .join("\n\n")}

export interface QueryResolvers {
${Object.values(models)
  .map(
    (
      model: any
    ) => `  ${model.name.toLowerCase()}s: (parent: any, args: { organizationId: string }, context: Context) => Promise<${
      model.name
    }[]>;
  ${model.name.toLowerCase()}: (parent: any, args: { id: string }, context: Context) => Promise<${
      model.name
    } | null>;`
  )
  .join("\n\n")}
}

export interface MutationResolvers {
${Object.values(models)
  .map(
    (
      model: any
    ) => `  create${model.name}: (parent: any, args: { input: Create${model.name}Input }, context: Context) => Promise<${model.name}>;
  update${model.name}: (parent: any, args: { id: string, input: Update${model.name}Input }, context: Context) => Promise<${model.name}>;
  delete${model.name}: (parent: any, args: { id: string }, context: Context) => Promise<${model.name}>;`
  )
  .join("\n\n")}
}`;

  // Generate Query Resolvers
  let queryResolversContent = `import { QueryResolvers } from '../types';

export const queryResolvers: QueryResolvers = {
${Object.values(models)
  .map(
    (
      model: any
    ) => `  ${model.name.toLowerCase()}s: async (_parent, args, context) => {
    return context.prisma.${model.name.toLowerCase()}.findMany({
      where: { organizationId: args.organizationId },
    });
  },

  ${model.name.toLowerCase()}: async (_parent, args, context) => {
    return context.prisma.${model.name.toLowerCase()}.findUnique({
      where: { id: args.id },
    });
  }`
  )
  .join(",\n\n")}
};`;

  // Generate Mutation Resolvers
  let mutationResolversContent = `import { MutationResolvers } from '../types';

export const mutationResolvers: MutationResolvers = {
${Object.values(models)
  .map(
    (model: any) => `  create${model.name}: async (_parent, args, context) => {
    return context.prisma.${model.name.toLowerCase()}.create({
      data: args.input,
    });
  },

  update${model.name}: async (_parent, args, context) => {
    return context.prisma.${model.name.toLowerCase()}.update({
      where: { id: args.id },
      data: args.input,
    });
  },

  delete${model.name}: async (_parent, args, context) => {
    return context.prisma.${model.name.toLowerCase()}.delete({
      where: { id: args.id },
    });
  }`
  )
  .join(",\n\n")}
};`;

  // Generate Field Resolvers
  let fieldResolversContent = `import { Context } from '../types';

export const fieldResolvers = {
${Object.values(models)
  .map(
    (model: any) => `  ${model.name}: {
${model.fields
  .filter((field: any) => field.kind === "object")
  .map(
    (field: any) => `    ${
      field.name
    }: async (parent: any, _args: any, context: Context) => {
      return context.prisma.${field.type.toLowerCase()}.findUnique({
        where: { id: parent.${field.name}Id },
      });
    }`
  )
  .join(",\n")}
  }`
  )
  .join(",\n\n")}
};`;

  // Write files
  const baseDir = path.join(__dirname, "../src/graphql");

  // Ensure directories exist
  ["", "/resolvers", "/resolvers/queries", "/resolvers/mutations"].forEach(
    (dir) => {
      const fullPath = path.join(baseDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
  );

  fs.writeFileSync(path.join(baseDir, "schema.ts"), schemaContent);
  fs.writeFileSync(path.join(baseDir, "types.ts"), typesContent);
  fs.writeFileSync(
    path.join(baseDir, "resolvers/queries/index.ts"),
    queryResolversContent
  );
  fs.writeFileSync(
    path.join(baseDir, "resolvers/mutations/index.ts"),
    mutationResolversContent
  );
  fs.writeFileSync(
    path.join(baseDir, "resolvers/fields.ts"),
    fieldResolversContent
  );

  console.log("✨ GraphQL code generation completed successfully!");
  await prisma.$disconnect();
};

generateSchema().catch(console.error);
