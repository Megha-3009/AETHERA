import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl" />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 text-center lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-card/60 px-4 py-1.5 text-xs font-medium backdrop-blur"
        >
          <Sparkles className="h-3 w-3 text-accent" />
          AI-powered fitness, personalized for you
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto max-w-3xl text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
        >
          Your intelligent <span className="text-gradient-primary">fitness ecosystem</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg"
        >
          Personalized workouts, Indian meal planning, AI coaching, motion tracking, and voice
          guidance — all in one adaptive companion.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="bg-gradient-primary text-white shadow-lg shadow-primary/25 hover:opacity-90">
            <Link to="/signup">
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/login">I have an account</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
