import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AuthUser,
  clearStoredToken,
  getCurrentUser,
  getStoredToken,
  login as apiLogin,
  register as apiRegister,
} from "../api";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { email: string; password: string; full_name: string; phone?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!getStoredToken()) {
      setIsLoading(false);
      return;
    }
    getCurrentUser()
      .then(setUser)
      .catch(() => {
        clearStoredToken();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearStoredToken();
      setUser(null);
    };
    window.addEventListener("civiclens:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("civiclens:unauthorized", handleUnauthorized);
  }, []);

  const login = async (email: string, password: string) => {
    setUser(await apiLogin(email, password));
  };

  const register = async (input: { email: string; password: string; full_name: string; phone?: string }) => {
    setUser(await apiRegister(input));
  };

  const logout = () => {
    clearStoredToken();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
