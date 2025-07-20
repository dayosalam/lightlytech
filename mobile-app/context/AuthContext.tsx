import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { SecureStorage } from "@/utils/storage";
import { signIn, logOut, refreshToken } from "@/api";
import { setAuthFailureCallback } from "@/api/newRequest";
import { tokenManager } from "@/utils/tokenManager";
import { useRouter } from "expo-router";
import { User } from "@/interfaces";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  loading: boolean;
  refreshAuthToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();

    // Set up auth failure callback for automatic logout
    setAuthFailureCallback(() => {
      console.log("🔄 Auth failure callback triggered - forcing logout");
      forceLogout();
    });
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const hasValidAuth = await tokenManager.hasValidAuth();

      if (hasValidAuth) {
        setIsAuthenticated(true);

        const userData = await SecureStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } else {
        console.log("❌ No valid authentication found");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshAuthToken = async (): Promise<boolean> => {
    try {
      return await tokenManager.refreshTokens();
    } catch (error) {
      console.error("❌ Error refreshing auth token:", error);
      return false;
    }
  };

  const forceLogout = async () => {
    try {
      await tokenManager.clearTokens();
      setIsAuthenticated(false);
      setUser(null);
      console.log("🔄 Force logout completed");
    } catch (error) {
      console.error("Error during force logout:", error);
    }
  };

  const login = async (userData: User) => {
    const { email, password } = userData;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      const response = await signIn(email, password);

      if (response && response.access_token) {
        // Store tokens with proper expiry
        await SecureStorage.setTokens(
          response.access_token,
          response.refresh_token,
          response.expires_in
        );
        await SecureStorage.setItem("user", JSON.stringify(response.user));
        await SecureStorage.setIsAuthenticated(true);

        setIsAuthenticated(true);
        setUser({
          email,
          token: response.access_token,
          id: response.user?.id,
          name: response.user?.name,
          condo_name: response.user?.condo_name,
          emoji: response.user?.emoji,
          mood: response.user?.mood,
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout if possible
      try {
        await logOut();
      } catch (error) {
        console.warn(
          "Backend logout failed, continuing with local logout:",
          error
        );
      }

      // Clear all stored data using TokenManager
      await tokenManager.clearTokens();
      setIsAuthenticated(false);
      setUser(null);

      console.log("✅ Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, clear local state
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };

    setUser(updatedUser);

    await SecureStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateUser,
        loading,
        refreshAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
