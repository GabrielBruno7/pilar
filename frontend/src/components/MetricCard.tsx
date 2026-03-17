import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

export function MetricCard({ icon, label, value, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground leading-snug">
            {label}
          </p>
          <p className="mt-1.5 text-3xl font-bold tabular-nums text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
