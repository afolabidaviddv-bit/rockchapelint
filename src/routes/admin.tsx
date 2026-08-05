import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AdminAuthProvider, useAdminAuth } from "@/admin/auth";
import { AdminLogin } from "@/admin/components/AdminLogin";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Portal — Rock Chapel International" },
      {
        name: "description",
        content: "Secure content management portal for Rock Chapel International.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminGate() {
  const { user, loading } = useAdminAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoginRoute = pathname.startsWith("/admin/login");

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-muted/40">
        <div className="flex flex-col items-center gap-3">
          <span className="size-8 animate-spin rounded-full border-2 border-navy/20 border-t-gold" />
          <p className="text-sm text-muted-foreground">Loading admin portal…</p>
        </div>
      </div>
    );
  }

  if (isLoginRoute) return <Outlet />;
  if (!user) return <AdminLogin />;

  return <Outlet />;
}

function AdminLayout() {
  return (
    <AdminAuthProvider>
      <AdminGate />
    </AdminAuthProvider>
  );
}
