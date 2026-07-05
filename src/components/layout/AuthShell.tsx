import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      </div>
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/welcome" className="focus:outline-none">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>
      <main className="mx-auto flex max-w-md flex-col px-4 pb-16 pt-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-xl shadow-primary/5">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </main>
    </div>
  );
}
