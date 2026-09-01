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

export const supabaseConfigured = Boolean(import.meta.env?.VITE_SUPABASE_URL && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY);

const AuthContext = createContext<AuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) throw new Error(error?.message ?? "Invalid email or password.");
    setUser({ id: data.user.id, email: data.user.email ?? email.trim(), name: data.user.user_metadata?.full_name ?? "Church Administrator", role: "admin" });
  }, []);

  const signOut = useCallback(async () => {
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


