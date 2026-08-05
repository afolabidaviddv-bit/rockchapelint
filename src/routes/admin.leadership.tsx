import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/admin/components/ResourcePage";
import { leadershipResource } from "@/admin/resources";

export const Route = createFileRoute("/admin/leadership")({
  component: () => <ResourcePage config={leadershipResource} />,
});
