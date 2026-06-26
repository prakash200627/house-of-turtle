import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant: "gold" | "sale" | "new" | "low-stock";
  className?: string;
}

/**
 * Badge Component
 * Renders small descriptive tags on product listings.
 */
export function Badge({ label, variant, className }: BadgeProps) {
  const styles = {
    gold: "bg-gold text-espresso",
    sale: "bg-red-100 text-red-700",
    new: "bg-green-100 text-green-700",
    "low-stock": "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={cn(
        "inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-pill select-none",
        styles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}

export default Badge;
