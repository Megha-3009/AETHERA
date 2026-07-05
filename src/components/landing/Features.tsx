import { motion } from "framer-motion";
import { Brain, Camera, Mic, Utensils, Trophy, WifiOff } from "lucide-react";
import { Card } from "@/components/ui/card";

const FEATURES = [
  { icon: Brain, title: "AI Decision Engine", desc: "Adaptive plans that adjust to your sleep, recovery, and readiness." },
  { icon: Camera, title: "Motion Tracking", desc: "Real-time rep counting and form feedback with your camera." },
  { icon: Mic, title: "Voice Coach", desc: "Hands-free instructions, countdowns, and motivation during sets." },
  { icon: Utensils, title: "Indian Meal Planning", desc: "Regional recipes tuned to your budget, allergies, and macros." },
  { icon: Trophy, title: "Gamified Progress", desc: "XP, streaks, badges, squads, and weekly adventure challenges." },
  { icon: WifiOff, title: "Offline First", desc: "Download plans and recipes — sync automatically when back online." },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything for a smarter workout</h2>
        <p className="mt-3 text-muted-foreground">
          One platform that learns you, coaches you, and evolves with your goals.
        </p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
