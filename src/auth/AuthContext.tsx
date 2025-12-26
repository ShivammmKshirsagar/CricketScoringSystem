import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Role = "admin" | "customer";

type AuthUser = {
  username: string;
  role: Role;
};

type LoginParams = {
  username: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (params: LoginParams) => AuthUser;
  logout: () => void;
};

const AUTH_STORAGE_KEY = "cricket_auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function parseStoredUser(raw: string | null): AuthUser | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed || typeof parsed.username !== "string") return null;
    if (parsed.role !== "admin" && parsed.role !== "customer") return null;
    return parsed;
  } catch {
    return null;
  }
}

function getUserFromCredentials({ username, password }: LoginParams): AuthUser | null {
  const u = username.trim();
  const p = password;

  if (u === "admin" && p === "admin123") {
    return { username: u, role: "admin" };
  }

  if (u === "customer" && p === "customer123") {
    return { username: u, role: "customer" };
  }

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => parseStoredUser(localStorage.getItem(AUTH_STORAGE_KEY)));

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const login = useCallback((params: LoginParams): AuthUser => {
    const nextUser = getUserFromCredentials(params);
    if (!nextUser) {
      throw new Error("Invalid username or password");
    }
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export type { Role, AuthUser };
