import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/admin/components/ResourcePage";
import { subscribersResource } from "@/admin/resources";

export const Route = createFileRoute("/admin/subscribers")({
  component: () => <ResourcePage config={subscribersResource} />,
});
