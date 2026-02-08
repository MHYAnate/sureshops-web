"use client";

import { useState } from "react";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Badge, Select } from "@/components/ui";
import { LocationFilter } from "./location-filter";
import { PriceFilter } from "./price-filter";
import { CategoryFilter } from "./category-filter";
import { SearchFilters as SearchFiltersType, AvailableFilters, SortBy } from "@/types";
import { SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  filters: Partial<SearchFiltersType>;
  availableFilters?: AvailableFilters;
  onFilterChange: (key: keyof SearchFiltersType, value: any) => void;
  onClearFilters: () => void;
  className?: string;
}

export function SearchFilters({
  filters,
  availableFilters,
  onFilterChange,
  onClearFilters,
  className,
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== null && v !== ""
  ).length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort */}
        <Select
          value={filters.sortBy || "relevance"}
          onChange={(value) => onFilterChange("sortBy", value as SortBy)}
          options={SORT_OPTIONS}
          placeholder="Sort by"
          className="w-40"
        />

        {/* Location Filter */}
        <LocationFilter
          stateId={filters.stateId}
          areaId={filters.areaId}
          marketId={filters.marketId}
          onStateChange={(id:any) => onFilterChange("stateId", id)}
          onAreaChange={(id :any) => onFilterChange("areaId", id)}
          onMarketChange={(id :any) => onFilterChange("marketId", id)}
        />

        {/* More Filters Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </Button>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear all
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-border bg-muted/30">
              {/* Price Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                <PriceFilter
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  priceRange={availableFilters?.priceRange}
                  onMinChange={(value :any) => onFilterChange("minPrice", value)}
                  onMaxChange={(value :any) => onFilterChange("maxPrice", value)}
                />
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Category</h4>
                <CategoryFilter
                  selected={filters.category}
                  categories={availableFilters?.categories || []}
                  onChange={(value:any) => onFilterChange("category", value)}
                />
              </div>

              {/* Brand Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Brand</h4>
                <Select
                  value={filters.brand || ""}
                  onChange={(value) => onFilterChange("brand", value)}
                  options={[
                    { value: "", label: "All Brands" },
                    ...(availableFilters?.brands || []).map((b) => ({
                      value: b.name,
                      label: `${b.name} (${b.count})`,
                    })),
                  ]}
                  placeholder="Select brand"
                />
              </div>

              {/* Additional Filters */}
              <div className="md:col-span-3 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock === true}
                    onChange={(e) =>
                      onFilterChange("inStock", e.target.checked || undefined)
                    }
                    className="rounded border-input"
                  />
                  <span className="text-sm">In Stock Only</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly === true}
                    onChange={(e) =>
                      onFilterChange("verifiedOnly", e.target.checked || undefined)
                    }
                    className="rounded border-input"
                  />
                  <span className="text-sm">Verified Shops Only</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}