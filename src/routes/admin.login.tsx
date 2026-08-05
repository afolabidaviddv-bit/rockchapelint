import { createFileRoute } from "@tanstack/react-router";
import { AdminLogin } from "@/admin/components/AdminLogin";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Rock Chapel Admin" },
      { name: "description", content: "Secure sign in for Rock Chapel International administrators." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});
