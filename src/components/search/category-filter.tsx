"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected?: string;
  categories: { name: string; count: number }[];
  onChange: (category: string | undefined) => void;
}

export function CategoryFilter({
  selected,
  categories,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-1 max-h-48 overflow-y-auto">
      <button
        onClick={() => onChange(undefined)}
        className={cn(
          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
          !selected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
      >
        All Categories
      </button>
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => onChange(category.name)}
          className={cn(
            "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
            selected === category.name
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          <span>{category.name}</span>
          <span className="text-xs opacity-70">({category.count})</span>
        </button>
      ))}
    </div>
  );
}