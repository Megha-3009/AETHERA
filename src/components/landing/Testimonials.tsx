import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TESTIMONIALS = [
  { name: "Priya S.", role: "Home workout", quote: "The AI meal plans finally fit my Indian kitchen — no more guesswork." },
  { name: "Arjun M.", role: "Gym goer", quote: "Motion tracking caught form mistakes my trainer missed. Game changer." },
  { name: "Meera V.", role: "Senior fitness", quote: "Senior mode is gentle, encouraging, and actually adapts to my knees." },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Loved by our early athletes</h2>
        <p className="mt-3 text-muted-foreground">Real stories will appear here soon.</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="h-full p-6">
              <p className="text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-primary text-white text-xs">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
