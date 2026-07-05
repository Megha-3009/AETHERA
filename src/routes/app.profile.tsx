import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/app/profile")({
  component: () => (
    <PlaceholderPage
      icon={User}
      title="Profile"
      description="Preferences, units, voice, notifications, theme, and account controls land in the next phase."
    />
  ),
});
