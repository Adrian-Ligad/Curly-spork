import { gql } from "apollo-server-express";

export const typeDefs = gql`
  enum Role {
    ADMIN
    NURSE
    SUPERVISOR
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: Role!
    shifts: [Shift!]!
    createdAt: String!
    updatedAt: String!
  }

  type Shift {
    id: ID!
    startTime: String!
    endTime: String!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    shifts: [Shift!]!
    shift(id: ID!): Shift
  }

  type Mutation {
    createUser(email: String!, name: String!, role: Role!): User!
    createShift(userId: ID!, startTime: String!, endTime: String!): Shift!
    updateShift(id: ID!, startTime: String, endTime: String): Shift!
    deleteShift(id: ID!): Shift!
  }
`;
