import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/admin/components/ResourcePage";
import { prayerResource } from "@/admin/resources";

export const Route = createFileRoute("/admin/prayer")({
  component: () => <ResourcePage config={prayerResource} />,
});
