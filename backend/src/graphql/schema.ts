import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Organization {
    id: ID!
    name: String!
    description: String
    users: [User!]!
    roles: [Role!]!
    shifts: [Shift!]!
    createdAt: String!
    updatedAt: String!
  }

  type Role {
    id: ID!
    name: String!
    description: String
    wage: Float!
    metadata: JSON
    organization: Organization!
    users: [User!]!
    lastUpdated: String!
    createdAt: String!
    updatedAt: String!
  }

  scalar JSON

  type User {
    id: ID!
    email: String!
    name: String!
    role: Role!
    organization: Organization!
    shifts: [Shift!]!
    createdAt: String!
    updatedAt: String!
  }

  type Shift {
    id: ID!
    startTime: String!
    endTime: String!
    user: User!
    organization: Organization!
    createdAt: String!
    updatedAt: String!
  }

  input CreateOrganizationInput {
    name: String!
    description: String
  }

  input CreateRoleInput {
    name: String!
    description: String
    wage: Float!
    metadata: JSON
    organizationId: ID!
  }

  input UpdateRoleInput {
    name: String
    description: String
    wage: Float
    metadata: JSON
  }

  input CreateUserInput {
    email: String!
    name: String!
    roleId: ID!
    organizationId: ID!
  }

  input CreateShiftInput {
    startTime: String!
    endTime: String!
    userId: ID!
    organizationId: ID!
  }

  type Query {
    # Organization queries
    organizations: [Organization!]!
    organization(id: ID!): Organization
    myOrganization: Organization

    # Role queries
    roles(organizationId: ID!): [Role!]!
    role(id: ID!): Role

    # User queries
    users(organizationId: ID!): [User!]!
    user(id: ID!): User

    # Shift queries
    shifts(organizationId: ID!): [Shift!]!
    shift(id: ID!): Shift
  }

  type Mutation {
    # Organization mutations
    createOrganization(input: CreateOrganizationInput!): Organization!
    updateOrganization(id: ID!, input: CreateOrganizationInput!): Organization!

    # Role mutations
    createRole(input: CreateRoleInput!): Role!
    updateRole(id: ID!, input: UpdateRoleInput!): Role!
    deleteRole(id: ID!): Role!

    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: CreateUserInput!): User!
    deleteUser(id: ID!): User!

    # Shift mutations
    createShift(input: CreateShiftInput!): Shift!
    updateShift(id: ID!, input: CreateShiftInput!): Shift!
    deleteShift(id: ID!): Shift!
  }
`;
