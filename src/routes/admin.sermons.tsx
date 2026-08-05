import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/admin/components/ResourcePage";
import { sermonsResource } from "@/admin/resources";

export const Route = createFileRoute("/admin/sermons")({
  component: () => <ResourcePage config={sermonsResource} />,
});
