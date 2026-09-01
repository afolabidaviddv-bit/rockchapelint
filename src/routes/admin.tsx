import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminAuthProvider } from "@/admin/auth";

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
  return <Outlet />;
}

function AdminLayout() {
  return (
    <AdminAuthProvider>
      <AdminGate />
    </AdminAuthProvider>
  );
}
