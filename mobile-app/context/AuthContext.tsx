import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { SecureStorage } from "@/utils/storage";
import { signIn, logOut } from "@/api";
import { User } from "@/interfaces";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const token = await SecureStorage.getItem("userToken");
      const isAuthenticatedFlag = await SecureStorage.getIsAuthenticated();

      if (token && isAuthenticatedFlag) {
        setIsAuthenticated(true);
        
        const userData = await SecureStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } else {
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

  const login = async (userData: User) => {
    const { email, password } = userData;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      const { user, access_token } = await signIn(email, password);


      await SecureStorage.setItem("userToken", access_token);
      await SecureStorage.setItem("user", JSON.stringify(user));
      await SecureStorage.setIsAuthenticated(true);
      setIsAuthenticated(true);
      setUser({
        email,
        token: access_token,
        id: user?.id,
        name: user?.name,
        condo_name: user?.condo_name,
        emoji: user?.emoji,
        mood: user?.mood,
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await SecureStorage.removeItem("userToken");
    await SecureStorage.removeItem("user");
    await SecureStorage.setIsAuthenticated(false);
    await logOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    
    setUser(updatedUser);
    
    await SecureStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser, loading }}>
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
