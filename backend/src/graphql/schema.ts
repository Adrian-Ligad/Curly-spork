import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Organization {
    id: ID!
    name: String!
    slug: String!
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
    createdAt: String!
    updatedAt: String!
  }

  scalar JSON

  type User {
    id: ID!
    email: String!
    auth0Id: String!
    firstName: String!
    lastName: String!
    isActive: Boolean!
    isAdmin: Boolean!
    permissions: [String!]!
    organization: Organization!
    role: Role
    shifts: [Shift!]!
    createdAt: String!
    updatedAt: String!
  }

  type Shift {
    id: ID!
    startTime: String!
    endTime: String!
    user: User
    organization: Organization!
    createdAt: String!
    updatedAt: String!
  }

  input CreateOrganizationInput {
    name: String!
    slug: String!
  }

  input CreateRoleInput {
    name: String!
    description: String
    wage: Float!
    metadata: JSON
    orgId: ID!
  }

  input UpdateRoleInput {
    name: String
    description: String
    wage: Float
    metadata: JSON
  }

  input CreateUserInput {
    email: String!
    auth0Id: String!
    firstName: String!
    lastName: String!
    roleId: ID
    orgId: ID!
    isAdmin: Boolean
    permissions: [String!]
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    roleId: ID
    isActive: Boolean
    isAdmin: Boolean
    permissions: [String!]
  }

  input CreateShiftInput {
    startTime: String!
    endTime: String!
    userId: ID
    orgId: ID!
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
    me: User

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
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): User!

    # Shift mutations
    createShift(input: CreateShiftInput!): Shift!
    updateShift(id: ID!, input: CreateShiftInput!): Shift!
    deleteShift(id: ID!): Shift!
  }
`;
