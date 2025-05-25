import { useQuery, gql } from "@apollo/client";

const GET_ORGANIZATION = gql`
  query GetOrganization {
    organization {
      id
      name
      slug
      createdAt
      users {
        id
        email
        firstName
        lastName
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

export const useOrganizationSettings = () => {
  const { data, loading, error } = useQuery(GET_ORGANIZATION);

  return {
    organization: data?.organization,
    loading,
    error,
  };
};
