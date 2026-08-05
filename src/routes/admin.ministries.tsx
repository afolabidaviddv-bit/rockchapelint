import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/admin/components/ResourcePage";
import { ministriesResource } from "@/admin/resources";

export const Route = createFileRoute("/admin/ministries")({
  component: () => <ResourcePage config={ministriesResource} />,
});
