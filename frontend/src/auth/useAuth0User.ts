import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_AUTH0_ID } from "../graphql/queries";
import { AuthUser } from "../types";

interface UseAuth0UserReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth0User = (): UseAuth0UserReturn => {
  const {
    isAuthenticated,
    isLoading: auth0Loading,
    user: auth0User,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const { data: userData, loading: userLoading } = useQuery(
    GET_USER_BY_AUTH0_ID,
    {
      variables: { auth0Id: auth0User?.sub },
      skip: !auth0User?.sub,
    }
  );

  const login = () => loginWithRedirect();
  const logoutUser = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });

  return {
    isAuthenticated,
    isLoading: auth0Loading || userLoading,
    user: userData?.userByAuth0Id || null,
    login,
    logout: logoutUser,
  };
};
