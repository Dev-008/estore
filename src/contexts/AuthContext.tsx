import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import Logger from "@/lib/logger";
import { AuthError, getErrorMessage } from "@/lib/errors";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("authUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        Logger.info("User session restored from localStorage");
      }
    } catch (error) {
      Logger.error("Failed to restore user session", error);
      localStorage.removeItem("authUser");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        if (!email) {
          throw new AuthError("Email is required");
        }

        // Mock login - replace with real API
        let newUser: User;

        if (email === "admin@shop.com") {
          newUser = { id: "1", name: "Admin", email, isAdmin: true };
        } else {
          const nameFromEmail = email.split("@")[0];
          if (!nameFromEmail) {
            throw new AuthError("Invalid email format");
          }
          newUser = { id: Date.now().toString(), name: nameFromEmail, email, isAdmin: false };
        }

        setUser(newUser);
        localStorage.setItem("authUser", JSON.stringify(newUser));
        Logger.info(`User logged in: ${email}`);
        return { success: true };
      } catch (error) {
        const message = getErrorMessage(error);
        Logger.error("Login failed", error);
        return { success: false, error: message };
      }
    },
    []
  );

  const register = useCallback(
    async (name: string, email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        if (!name || !email) {
          throw new AuthError("Name and email are required");
        }

        const newUser: User = { id: Date.now().toString(), name, email, isAdmin: false };
        setUser(newUser);
        localStorage.setItem("authUser", JSON.stringify(newUser));
        Logger.info(`User registered: ${email}`);
        return { success: true };
      } catch (error) {
        const message = getErrorMessage(error);
        Logger.error("Registration failed", error);
        return { success: false, error: message };
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("authUser");
    Logger.info("User logged out");
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
