import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-primary text-white shadow-lg shadow-primary/20">
        <Sparkles className="h-4 w-4" />
      </div>
      {!iconOnly && (
        <span className="text-lg font-black tracking-tight">
          AETH<span className="text-gradient-primary">ERA</span>
        </span>
      )}
    </div>
  );
}
