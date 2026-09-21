import { LayoutDashboard, Dumbbell, Apple, LineChart, User, ClipboardCheck,

 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = { to: string; label: string; icon: LucideIcon; exact?: boolean };

export const APP_NAV: readonly NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/app/nutrition", label: "Nutrition", icon: Apple },
  { to: "/app/progress", label: "Progress", icon: LineChart },
  { to: "/app/profile", label: "Profile", icon: User },
  {to: "/app/checkin",label: "Check-in",icon: ClipboardCheck,},
];
