import { organizationQueries } from "./queries/organization";
import { roleQueries } from "./queries/role";
import { userQueries } from "./queries/user";
import { shiftQueries } from "./queries/shift";

import { organizationMutations } from "./mutations/organization";
import { roleMutations } from "./mutations/role";
import { userMutations } from "./mutations/user";
import { shiftMutations } from "./mutations/shift";

import { fieldResolvers } from "./fields";
import { GraphQLJSON } from "graphql-type-json";

export const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    ...organizationQueries,
    ...roleQueries,
    ...userQueries,
    ...shiftQueries,
  },
  Mutation: {
    ...organizationMutations,
    ...roleMutations,
    ...userMutations,
    ...shiftMutations,
  },
  ...fieldResolvers,
};
