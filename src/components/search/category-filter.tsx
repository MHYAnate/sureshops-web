"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected?: string;
  categories: { name: string; count: number }[];
  onChange: (value: string) => void;
  className?: string;
}

export function CategoryFilter({
  selected,
  categories,
  onChange,
  className,
}: CategoryFilterProps) {
  return (
    <div className={cn(className)}>
      <select
        value={selected || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name} ({cat.count})
          </option>
        ))}
      </select>
    </div>
  );
}