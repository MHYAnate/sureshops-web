"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  priceRange?: { min: number; max: number };
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
}

export function PriceFilter({
  minPrice,
  maxPrice,
  priceRange,
  onMinChange,
  onMaxChange,
}: PriceFilterProps) {
  const [localMin, setLocalMin] = useState(minPrice?.toString() || "");
  const [localMax, setLocalMax] = useState(maxPrice?.toString() || "");

  useEffect(() => {
    setLocalMin(minPrice?.toString() || "");
  }, [minPrice]);

  useEffect(() => {
    setLocalMax(maxPrice?.toString() || "");
  }, [maxPrice]);

  const handleMinBlur = () => {
    const value = localMin ? parseInt(localMin, 10) : undefined;
    onMinChange(value);
  };

  const handleMaxBlur = () => {
    const value = localMax ? parseInt(localMax, 10) : undefined;
    onMaxChange(value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Min"
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          onBlur={handleMinBlur}
          className="h-9"
        />
        <span className="text-muted-foreground">-</span>
        <Input
          type="number"
          placeholder="Max"
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          onBlur={handleMaxBlur}
          className="h-9"
        />
      </div>
      {priceRange && (
        <p className="text-xs text-muted-foreground">
          Range: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
        </p>
      )}
    </div>
  );
}