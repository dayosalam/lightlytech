import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Storage } from "@/utils/storage";
import { signIn, logOut } from "@/api";
import { User } from "@/interfaces";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = await Storage.getItem("userToken");

    if (token) {
      setIsAuthenticated(true);
      // Fetch user data here if needed
    }
  };

  const login = async (userData: User) => {
    const { email, password } = userData;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      const { user, access_token } = await signIn(email, password);

      // Store the access token from the response
      await Storage.setItem("userToken", access_token);
      setIsAuthenticated(true);
      setUser({
        email,
        token: access_token,
        id: user?.id,
        name: user?.user_metadata?.name,
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await Storage.removeItem("userToken");
    await logOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
