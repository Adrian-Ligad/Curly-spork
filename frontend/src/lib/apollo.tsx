import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const httpLink = createHttpLink({
  uri:
    process.env.REACT_APP_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      // Handle authentication errors
      if (
        message === "Not authenticated" ||
        message === "Invalid token" ||
        message.includes("jwt")
      ) {
        // Redirect to login if not authenticated
        window.location.href = "/login";
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

export const CustomApolloProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const authLink = setContext(async (_, { headers }) => {
    if (!isAuthenticated) return { headers };

    try {
      const token = await getAccessTokenSilently();
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    } catch (error) {
      console.error("Error getting auth token:", error);
      return { headers };
    }
  });

  const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
