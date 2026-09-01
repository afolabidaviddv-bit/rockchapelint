import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  backend: "supabase";
}

const env = import.meta.env as Record<string, string | undefined>;
export const supabaseConfigured = Boolean(
  (env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL) &&
    (env.VITE_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY),
);

const AuthContext = createContext<AuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }
    let mounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (mounted && data.user) setUser({ id: data.user.id, email: data.user.email ?? "", name: data.user.user_metadata?.full_name ?? "Church Administrator", role: "admin" });
      if (mounted) setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? "", name: session.user.user_metadata?.full_name ?? "Church Administrator", role: "admin" } : null);
      setLoading(false);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabaseConfigured) throw new Error("Supabase is not configured for this preview.");
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) {
      const normalized = error?.message.toLowerCase() ?? "";
      if (normalized.includes("email not confirmed")) {
        throw new Error("Your email address is not confirmed. Check your inbox for the Supabase confirmation email.");
      }
      if (normalized.includes("invalid login credentials")) {
        throw new Error("Invalid email or password. Make sure this account was created in the connected Supabase project.");
      }
      throw new Error("Unable to sign in. Check your account details and try again.");
    }
    setUser({ id: data.user.id, email: data.user.email ?? email.trim(), name: data.user.user_metadata?.full_name ?? "Church Administrator", role: "admin" });
  }, []);

  const signOut = useCallback(async () => {
    if (!supabaseConfigured) {
      setUser(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signOut, backend: "supabase" }),
    [user, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}


