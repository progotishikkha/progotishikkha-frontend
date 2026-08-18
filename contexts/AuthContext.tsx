"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { authService, AuthUser } from "@/services/authService";

interface AuthContextValue {
  user: AuthUser | null;
  /** True only while the initial session-restore check on page load is running. */
  isInitializing: boolean;
  /** True while a login submission is in flight. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  /** Re-fetches the current user from the server (e.g. after a profile edit). */
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authService.me();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  // On first mount (including a hard page refresh) there is no in-memory
  // access token, but a valid httpOnly refresh-token cookie may still exist.
  // Calling /auth/me triggers apiClient's 401 -> silent-refresh -> retry
  // flow automatically, so this quietly restores the session instead of
  // leaving `user` null (which is why profile pages previously fell back to
  // hardcoded placeholder data after every reload).
  useEffect(() => {
    refreshUser().finally(() => setIsInitializing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isInitializing, isLoading, login, logout, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
