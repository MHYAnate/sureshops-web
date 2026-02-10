"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ArrowRight, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui";
import { useLocationSelector } from "@/hooks/use-location";
import { useSearchStore } from "@/store/search-store";
import { cn } from "@/lib/utils";

export function HomeSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  const { addRecentSearch } = useSearchStore();

  const {
    states,
    areas,
    markets,
    statesLoading,
    areasLoading,
    marketsLoading,
    selectedLocation,
    locationLabel,
    handleStateChange,
    handleAreaChange,
    handleMarketChange,
    clearLocation,
  } = useLocationSelector();

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("query", query.trim());
      addRecentSearch(query.trim());
    }

    if (selectedLocation.stateId) {
      params.set("stateId", selectedLocation.stateId);
    }
    if (selectedLocation.areaId) {
      params.set("areaId", selectedLocation.areaId);
    }
    if (selectedLocation.marketId) {
      params.set("marketId", selectedLocation.marketId);
    }

    params.set("_t", Date.now().toString());

    router.push(`/search?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const hasLocation = !!(
    selectedLocation.stateId ||
    selectedLocation.areaId ||
    selectedLocation.marketId
  );

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center rounded-2xl bg-background shadow-2xl ring-1 ring-border">
          <Search className="absolute left-4 h-6 w-6 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="w-full h-16 bg-transparent pl-14 pr-14 text-lg outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="absolute right-3 rounded-xl bg-primary p-3 text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Location Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowLocation(!showLocation)}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all",
            hasLocation
              ? "bg-primary/10 text-primary ring-1 ring-primary/30"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <MapPin className="h-4 w-4" />
          <span className="max-w-[200px] truncate">
            {hasLocation ? locationLabel : "Set your location"}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              showLocation && "rotate-180"
            )}
          />
        </button>

        {hasLocation && (
          <button
            onClick={() => {
              clearLocation();
              setShowLocation(false);
            }}
            className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Location Selectors */}
      <AnimatePresence>
        {showLocation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border bg-background p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Where are you shopping?
                </h4>
                {hasLocation && (
                  <button
                    onClick={clearLocation}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* State */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    State
                  </label>
                  <select
                    value={selectedLocation.stateId || ""}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={statesLoading}
                  >
                    <option value="">
                      {statesLoading ? "Loading..." : "Select state"}
                    </option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Area */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Area
                  </label>
                  <select
                    value={selectedLocation.areaId || ""}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    disabled={!selectedLocation.stateId || areasLoading}
                  >
                    <option value="">
                      {areasLoading
                        ? "Loading..."
                        : !selectedLocation.stateId
                          ? "Select state first"
                          : areas.length === 0
                            ? "No areas"
                            : "Select area"}
                    </option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Market */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Market
                  </label>
                  <select
                    value={selectedLocation.marketId || ""}
                    onChange={(e) => handleMarketChange(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    disabled={!selectedLocation.areaId || marketsLoading}
                  >
                    <option value="">
                      {marketsLoading
                        ? "Loading..."
                        : !selectedLocation.areaId
                          ? "Select area first"
                          : markets.length === 0
                            ? "No markets"
                            : "All markets"}
                    </option>
                    {markets.map((market) => (
                      <option key={market.id} value={market.id}>
                        {market.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {hasLocation && (
                <div className="flex items-center gap-2 pt-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm text-primary font-medium">
                    {locationLabel}
                  </span>
                </div>
              )}

              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => setShowLocation(false)}
              >
                Done
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}