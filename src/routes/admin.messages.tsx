import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/admin/components/ResourcePage";
import { messagesResource } from "@/admin/resources";

export const Route = createFileRoute("/admin/messages")({
  component: () => <ResourcePage config={messagesResource} />,
});
