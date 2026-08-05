import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/admin/components/ResourcePage";
import { announcementsResource } from "@/admin/resources";

export const Route = createFileRoute("/admin/announcements")({
  component: () => <ResourcePage config={announcementsResource} />,
});
