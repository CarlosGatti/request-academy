"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  ACCESS_TOKEN_KEY,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/auth/token";

export type AuthUser = {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
  isAdmin?: boolean;
  apps: string[];
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasDefinedAccess: boolean;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
  updateUser: (user: AuthUser) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_STORAGE_KEY = "defined_academy_user";
const AUTH_CHANGE_EVENT = "defined-academy-auth-change";

function emitAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (
      event.key === ACCESS_TOKEN_KEY ||
      event.key === USER_STORAGE_KEY ||
      event.key === null
    ) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(AUTH_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(AUTH_CHANGE_EVENT, onStoreChange);
  };
}

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function getAuthSnapshot() {
  return JSON.stringify({
    token: getAccessToken(),
    user: readStoredUser(),
  });
}

function getServerAuthSnapshot() {
  return JSON.stringify({ token: null, user: null });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );

  const { token, user } = useMemo(() => {
    const parsed = JSON.parse(snapshot) as {
      token: string | null;
      user: AuthUser | null;
    };
    return parsed;
  }, [snapshot]);

  const setSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    setAccessToken(nextToken);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    emitAuthChange();
  }, []);

  const clearSession = useCallback(() => {
    clearAccessToken();
    window.localStorage.removeItem(USER_STORAGE_KEY);
    emitAuthChange();
  }, []);

  const updateUser = useCallback((nextUser: AuthUser) => {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    emitAuthChange();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading: false,
      hasDefinedAccess: Boolean(user?.apps?.includes("DEFINED")),
      setSession,
      clearSession,
      updateUser,
    }),
    [user, token, setSession, clearSession, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
