import { gql } from "@apollo/client";

export const GET_USER_BY_AUTH0_ID = gql`
  query GetUserByAuth0Id($auth0Id: String!) {
    userByAuth0Id(auth0Id: $auth0Id) {
      id
      email
      firstName
      lastName
      isAdmin
      permissions
      organization {
        id
        name
      }
      role {
        id
        name
      }
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query GetOrganization {
    organization {
      id
      name
      users {
        id
        firstName
        lastName
        email
        isAdmin
        role {
          id
          name
        }
      }
      roles {
        id
        name
        description
        wage
      }
    }
  }
`;
