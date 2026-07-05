import { createFileRoute } from "@tanstack/react-router";
import { Dumbbell } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/app/workouts")({
  component: () => (
    <PlaceholderPage
      icon={Dumbbell}
      title="Workouts"
      description="Your weekly plan, exercise library, motion tracking, and voice coach live here. Coming in the next phase."
    />
  ),
});
