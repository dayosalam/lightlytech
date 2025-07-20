import { useEffect, useState } from "react";
import { tokenManager } from "@/utils/tokenManager";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook to check if user is authenticated with valid tokens
 * This can be used in protected components to ensure authentication
 */
export const useAuthStatus = () => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      if (!isAuthenticated) {
        setIsValid(false);
        return;
      }

      const hasValidAuth = await tokenManager.hasValidAuth();
      setIsValid(hasValidAuth);

      // If authentication is invalid, logout the user
      if (!hasValidAuth) {
        console.log("❌ Authentication invalid, logging out user");
        await logout();
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    return await checkAuthStatus();
  };

  return {
    isValid,
    isLoading,
    refreshAuth,
  };
};

/**
 * Hook to get a valid token for API calls
 * This ensures the token is always valid before making requests
 */
export const useValidToken = () => {
  const getToken = async (): Promise<string | null> => {
    try {
      return await tokenManager.getValidToken();
    } catch (error) {
      console.error("Error getting valid token:", error);
      return null;
    }
  };

  return { getToken };
};

/**
 * Higher-order hook that combines authentication checks
 * Useful for protected screens and components
 */
export const useProtectedAuth = () => {
  const authStatus = useAuthStatus();
  const { getToken } = useValidToken();
  const { logout } = useAuth();

  const ensureAuthenticated = async (): Promise<boolean> => {
    const token = await getToken();
    if (!token) {
      console.log("❌ No valid token, logging out");
      await logout();
      return false;
    }
    return true;
  };

  return {
    ...authStatus,
    getToken,
    ensureAuthenticated,
    logout,
  };
};
