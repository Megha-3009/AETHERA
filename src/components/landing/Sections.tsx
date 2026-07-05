import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function About() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">About AETHERA</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            One companion. Every part of your fitness journey.
          </h2>
          <p className="mt-4 text-muted-foreground">
            AETHERA blends personalized programming, culturally-aware nutrition, on-device motion
            analysis, and voice-first coaching into a single adaptive experience. It listens, learns,
            and evolves with you — whether you train at home, at the gym, or somewhere in between.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {["Gym Mode", "Home Workout", "Zumba", "Walking & Cardio", "Home Gym", "Senior Fitness"].map((mode) => (
              <div key={mode} className="rounded-xl border bg-card p-4 text-sm font-medium shadow-sm">
                {mode}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 text-center text-white shadow-2xl shadow-primary/20 sm:p-16">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_80%,white,transparent_40%)]" />
        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to train smarter?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/80">
            Set up your profile in under two minutes and get a plan built around you.
          </p>
          <Button asChild size="lg" className="mt-6 bg-white text-primary hover:bg-white/90">
            <Link to="/signup">
              Start your journey <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
