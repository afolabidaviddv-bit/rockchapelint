import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAdminAuth } from "@/admin/auth";

export function AdminLogin({ redirectTo = "/admin" }: { redirectTo?: string }) {
  const { signIn, backend } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email, password);
      toast.success("Welcome back", { description: "You are signed in to the admin portal." });
      void navigate({ to: redirectTo, replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to sign in.";
      setError(message);
      toast.error("Sign in failed", { description: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-navy p-12 lg:flex">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-gold font-display text-lg font-semibold text-navy">
            R
          </span>
          <span className="font-display text-lg font-semibold text-primary-foreground">
            Rock Chapel International
          </span>
        </Link>
        <div className="max-w-md">
          <h2 className="font-display text-4xl leading-tight font-semibold text-primary-foreground">
            Steward the story of the house.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
            Manage sermons, events, ministries, prayer requests and every word that appears on the
            public website — from one secure place.
          </p>
        </div>
        <p className="flex items-center gap-2 text-xs text-primary-foreground/50">
          <ShieldCheck className="size-4" />
          {backend === "supabase"
            ? "Secured by Supabase authentication"
            : "Secure authentication is unavailable"}
        </p>
      </div>

      <div className="flex items-center justify-center bg-muted/40 px-4 py-16">
        <Card className="animate-in fade-in slide-in-from-bottom-3 w-full max-w-md rounded-2xl border-border/70 p-8 shadow-lift duration-500">
          <div className="text-center">
            <h1 className="font-display text-3xl font-semibold text-navy">Admin sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="admin-email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rockchapelinternational.org"
                  className="rounded-xl pl-9"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl pl-9"
                />
              </div>
            </div>

            {error ? (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-full bg-navy text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-navy/90"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="underline underline-offset-4 hover:text-navy">
              Back to the public website
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
