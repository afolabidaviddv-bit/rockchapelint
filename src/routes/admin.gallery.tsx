import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/admin/components/ResourcePage";
import { galleryResource } from "@/admin/resources";

export const Route = createFileRoute("/admin/gallery")({
  component: () => <ResourcePage config={galleryResource} />,
});
