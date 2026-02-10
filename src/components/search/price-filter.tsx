"use client";

import { cn } from "@/lib/utils";

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  priceRange?: { min: number; max: number };
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
  className?: string;
}

export function PriceFilter({
  minPrice,
  maxPrice,
  priceRange,
  onMinChange,
  onMaxChange,
  className,
}: PriceFilterProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1">
        <input
          type="number"
          value={minPrice ?? ""}
          onChange={(e) =>
            onMinChange(e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder={
            priceRange ? `₦${priceRange.min.toLocaleString()}` : "Min"
          }
          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <span className="text-muted-foreground text-sm">—</span>
      <div className="flex-1">
        <input
          type="number"
          value={maxPrice ?? ""}
          onChange={(e) =>
            onMaxChange(e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder={
            priceRange ? `₦${priceRange.max.toLocaleString()}` : "Max"
          }
          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}