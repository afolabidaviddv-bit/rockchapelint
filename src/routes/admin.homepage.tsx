import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/admin/components/ResourcePage";
import { homepageResource } from "@/admin/resources";

export const Route = createFileRoute("/admin/homepage")({
  component: () => <ResourcePage config={homepageResource} />,
});
