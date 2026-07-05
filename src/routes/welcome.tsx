import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { About, CTA } from "@/components/landing/Sections";
import { Testimonials } from "@/components/landing/Testimonials";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
});

function Welcome() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-primary text-white hover:opacity-90">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main>
        <Hero />
        <About />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        © 2026 AETHERA. Built for smarter training.
      </footer>
    </div>
  );
}
