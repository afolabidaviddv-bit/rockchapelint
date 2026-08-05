import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/admin/components/ResourcePage";
import { eventsResource } from "@/admin/resources";

export const Route = createFileRoute("/admin/events")({
  component: () => <ResourcePage config={eventsResource} />,
});
