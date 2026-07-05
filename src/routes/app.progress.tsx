import { createFileRoute } from "@tanstack/react-router";
import { LineChart } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/app/progress")({
  component: () => (
    <PlaceholderPage
      icon={LineChart}
      title="Progress"
      description="Weight, BMI, sleep, water, steps, and body measurement charts land in the next phase."
    />
  ),
});
