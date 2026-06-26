import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  count: number;
  size?: "sm" | "md";
  className?: string;
}

/**
 * StarRating Component
 * Displays 5 stars (filled or empty based on product score) and the review count.
 */
export function StarRating({ rating, count, size = "sm", className }: StarRatingProps) {
  const rounded = Math.round(rating);
  const sizeClass = size === "sm" ? 12 : 16;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, idx) => {
          const isFilled = idx < rounded;
          return (
            <Star
              key={idx}
              size={sizeClass}
              className={cn(
                "stroke-gold",
                isFilled ? "fill-gold text-gold" : "text-sand/30"
              )}
            />
          );
        })}
      </div>
      <span className="text-[11px] text-espresso/70 font-semibold">({count})</span>
    </div>
  );
}

export default StarRating;
