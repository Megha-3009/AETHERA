import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Dumbbell,
  Flame,
  Footprints,
  GlassWater,
  Moon,
  Trophy,
  UtensilsCrossed,
  Weight,
  Zap,
  Sparkles,
  Beef,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/StatCard";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  calculateBMI,
  bmiCategory,
  calculateBMR,
  calculateCalories,
  calculateProtein,
  calculateWater,
} from "@/lib/fitness";
export const Route = createFileRoute("/app/")({
  component: DashboardPage,
});

function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);

  const bmi =
  profile && profile.height && profile.weight
    ? calculateBMI(profile.height, profile.weight)
    : 0;

const bmr =
  profile && profile.gender && profile.weight && profile.height && profile.age
    ? calculateBMR(
        profile.gender,
        profile.weight,
        profile.height,
        profile.age
      )
    : 0;

const calories =
  profile && bmr
    ? calculateCalories(
        bmr,
        profile.activity_level,
        profile.fitness_goal
      )
    : 0;

const protein =
  profile && profile.weight
    ? calculateProtein(profile.weight, profile.fitness_goal)
    : 0;

const water =
  profile && profile.weight
    ? calculateWater(profile.weight)
    : "0";

useEffect(() => {
  loadProfile();
}, []);

async function loadProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  setProfile(data);
  console.log("Profile:", data);
}
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Good morning</p>
            <h1 className="mt-1 truncate text-2xl font-black tracking-tight sm:text-3xl">
              Ready to move,
<span className="text-gradient-primary">
  {profile?.full_name || "User"}
</span>
?
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Your body's telling us it's a strong day.</p>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex gap-1">
            <Sparkles className="h-3 w-3" /> Readiness 82
          </Badge>
        </div>
      </motion.div>

      {/* Readiness + streak hero */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden p-0">
          <div className="relative bg-gradient-primary p-5 text-white">
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%)]" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/70">AI Readiness Score</p>
                <p className="mt-1 text-5xl font-black">82</p>
                <p className="mt-1 text-sm text-white/80">Sleep +8 · Recovery +6 · Load −3</p>
              </div>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                <Zap className="h-7 w-7" />
              </div>
            </div>
            <Button size="sm" className="mt-4 bg-white text-primary hover:bg-white/90">
              Start today's workout
            </Button>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-warning/15 text-warning-foreground">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Daily streak</p>
                <p className="text-2xl font-bold">12 days</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Level 7</p>
                <p className="text-2xl font-bold">1,240 XP</p>
              </div>
            </div>
            <Progress value={62} className="mt-3 h-1.5" />
          </Card>
        </div>
      </div>

      {/* Today's plan */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">Today's workout</p>
            <Badge variant="outline">45 min</Badge>
          </div>
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold">{profile?.fitness_goal || "Today's Workout"}</h3>
              <p className="text-sm text-muted-foreground">6 exercises · Intermediate</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary">Chest</Badge>
                <Badge variant="secondary">Shoulders</Badge>
                <Badge variant="secondary">Triceps</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">Today's meal</p>
            <Badge variant="outline">{profile?.daily_calories || 2000} kcal</Badge>
          </div>
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold">Paneer Bhurji Bowl</h3>
              <p className="text-sm text-muted-foreground">High protein · Vegetarian · 30 min</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary">Protein 42g</Badge>
                <Badge variant="secondary">Carbs 55g</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Stat grid */}
      <div>
        <p className="mb-3 text-sm font-semibold">Today's stats</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard
  icon={Flame}
  label="Calories"
  value={`${calories}`}
  hint="Daily Target"
  tone="warning"
/>

<StatCard
  icon={Beef}
  label="Protein"
  value={`${protein} g`}
  hint="Daily Target"
  tone="primary"
/>

<StatCard
  icon={GlassWater}
  label="Water"
  value={`${water} L`}
  hint="Daily Target"
  tone="accent"
/>
          <StatCard icon={Moon} label="Sleep" value="7h 24m" hint="Quality 82%" progress={82} tone="primary" />
          <StatCard icon={Footprints} label="Steps" value="6,240" hint="of 10,000" progress={62} tone="success" />
          <StatCard icon={Weight} label="Weight" value={`${profile?.weight || 0} kg`} hint="−0.3 kg week" tone="accent" />
          <StatCard
  icon={Activity}
  label="BMI"
  value={`${bmi}`}
  hint={bmiCategory(bmi)}
  tone="success"
/>
          <StatCard icon={Trophy} label="Weekly challenge" value="4 / 6" hint="Push routine" progress={66} tone="warning" />
        </div>
      </div>

      {/* Notifications */}
      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">Notifications</p>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </div>
        <ul className="divide-y">
          {[
            { title: "Hydration nudge", body: "You're 1.2L behind your goal — sip some water.", time: "12m" },
            { title: "AI recommendation", body: "Add a 10 min walk after dinner for better sleep.", time: "1h" },
            { title: "Streak protected", body: "Nice — you've extended your streak to 12 days.", time: "3h" },
          ].map((n) => (
            <li key={n.title} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.body}</p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
