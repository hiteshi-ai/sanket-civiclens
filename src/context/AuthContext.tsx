import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AuthUser,
  clearStoredToken,
  getCurrentUser,
  getStoredToken,
  login as apiLogin,
  register as apiRegister,
  UserRole,
} from "../api";

export interface DemoAccount {
  label: string;
  role: UserRole;
  email: string;
  password: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Citizen Portal",
    role: "CITIZEN",
    email: "citizen_demo@civiclens.in",
    password: "change-me",
  },
  {
    label: "Field Worker Operations",
    role: "FIELD_WORKER",
    email: "field_demo@civiclens.in",
    password: "change-me",
  },
  {
    label: "Municipal Command Center",
    role: "MUNICIPAL_OFFICER",
    email: "admin_demo@civiclens.in",
    password: "change-me",
  },
];

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    role?: UserRole;
  }) => Promise<AuthUser>;
  demoLogin: (role: "citizen" | "field" | "municipal" | "admin") => Promise<AuthUser>;
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
    const authedUser = await apiLogin(email, password);
    setUser(authedUser);
    return authedUser;
  };

  const register = async (input: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    role?: UserRole;
  }) => {
    const authedUser = await apiRegister(input);
    setUser(authedUser);
    return authedUser;
  };

  const demoLogin = async (role: "citizen" | "field" | "municipal" | "admin") => {
    const account =
      role === "citizen"
        ? DEMO_ACCOUNTS[0]
        : role === "field"
        ? DEMO_ACCOUNTS[1]
        : DEMO_ACCOUNTS[2];
    return login(account.email, account.password);
  };

  const logout = () => {
    clearStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
