import { userQueries } from "./queries/user";
import { shiftQueries } from "./queries/shift";
import { userMutations } from "./mutations/user";
import { shiftMutations } from "./mutations/shift";
import { fieldResolvers } from "./fields";

export const resolvers = {
  Query: {
    ...userQueries,
    ...shiftQueries,
  },
  Mutation: {
    ...userMutations,
    ...shiftMutations,
  },
  ...fieldResolvers,
};
