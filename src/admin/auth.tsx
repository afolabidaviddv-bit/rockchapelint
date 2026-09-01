import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Supabase-backed admin authentication. Authorization must be enforced server-side/RLS. */

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

export const supabaseConfigured = true;

const ADMIN_EMAIL = "okeolatunde60@gmail.com";

function toAdminUser(user: { id: string; email?: string | null; user_metadata?: { full_name?: string } | null }): AdminUser | null {
  if (!user.email) return null;
  return { id: user.id, email: user.email, name: user.user_metadata?.full_name ?? "Church Administrator", role: "admin" };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setUser(data.session?.user ? toAdminUser(data.session.user) : null);
        setLoading(false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? toAdminUser(session.user) : null);
      setLoading(false);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalized, password });
    if (error || !data.user || normalized !== ADMIN_EMAIL && !data.user.user_metadata?.is_admin) {
      throw new Error("Invalid email or password.");
    }
    setUser(toAdminUser(data.user));
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
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

export const adminAccountEmail = ADMIN_EMAIL;
