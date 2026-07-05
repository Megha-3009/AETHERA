import { createFileRoute } from "@tanstack/react-router";
import { Apple } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/app/nutrition")({
  component: () => (
    <PlaceholderPage
      icon={Apple}
      title="Nutrition"
      description="Weekly Indian meal plans, recipes, macros, and meal swaps arrive in the next phase."
    />
  ),
});
