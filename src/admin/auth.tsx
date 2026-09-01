import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/** Local demo authentication. Credentials are checked only in this client-side provider. */
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
  backend: "local";
}

const ADMIN_EMAIL = "okeolatunde60@gmail.com";
const ADMIN_PASSWORD = "Rockchapel";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const signIn = useCallback(async (email: string, password: string) => {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new Error("Invalid email or password.");
    }
    setUser({ id: "local-admin", email: ADMIN_EMAIL, name: "Church Administrator", role: "admin" });
  }, []);
  const signOut = useCallback(async () => setUser(null), []);
  const value = useMemo(() => ({ user, loading: false, signIn, signOut, backend: "local" as const }), [user, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}

export const adminAccountEmail = ADMIN_EMAIL;
