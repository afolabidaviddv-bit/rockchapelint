import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * Admin authentication layer.
 *
 * Supabase-ready: when Lovable Cloud is connected, replace the three marked
 * blocks below with `supabase.auth.getSession()`,
 * `supabase.auth.signInWithPassword()` and `supabase.auth.signOut()`, and wire
 * `supabase.auth.onAuthStateChange`. The context shape (`user`, `loading`,
 * `signIn`, `signOut`) already matches, so no admin screen changes.
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin";
}

interface AuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  backend: "supabase" | "local";
}

const SESSION_KEY = "rc_admin_session_v1";

/** Flips to true automatically once Cloud env vars exist. */
export const supabaseConfigured = Boolean(
  typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_URL"],
);

const DEMO_EMAIL = "admin@rockchapelinternational.org";
const DEMO_PASSWORD = "rockchapel";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Restore session
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as AdminUser);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  // 2. Sign in
  const signIn = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const normalized = email.trim().toLowerCase();
    if (normalized !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new Error("Invalid email or password.");
    }
    const next: AdminUser = {
      id: "local-admin",
      email: normalized,
      name: "Church Administrator",
      role: "admin",
    };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setUser(next);
  }, []);

  // 3. Sign out
  const signOut = useCallback(async () => {
    window.localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signOut, backend: supabaseConfigured ? "supabase" : "local" }),
    [user, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}

export const demoCredentials = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
