"use client";

import { useState } from "react";
import { MapPin, ChevronDown, X, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Badge } from "@/components/ui";
import { useLocationSelector } from "@/hooks/use-location";
import { cn } from "@/lib/utils";

interface LocationFilterProps {
  stateId?: string;
  areaId?: string;
  marketId?: string;
  onStateChange: (id: string) => void;
  onAreaChange: (id: string) => void;
  onMarketChange: (id: string) => void;
  className?: string;
}

export function LocationFilter({
  stateId,
  areaId,
  marketId,
  onStateChange,
  onAreaChange,
  onMarketChange,
  className,
}: LocationFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    states,
    areas,
    markets,
    statesLoading,
    areasLoading,
    marketsLoading,
    selectedLocation,
    handleStateChange,
    handleAreaChange,
    handleMarketChange,
    clearLocation,
  } = useLocationSelector();

  const onSelectState = (id: string) => {
    handleStateChange(id);
    onStateChange(id);
    onAreaChange("");
    onMarketChange("");
  };

  const onSelectArea = (id: string) => {
    handleAreaChange(id);
    onAreaChange(id);
    onMarketChange("");
  };

  const onSelectMarket = (id: string) => {
    handleMarketChange(id);
    onMarketChange(id);
  };

  const onClear = () => {
    clearLocation();
    onStateChange("");
    onAreaChange("");
    onMarketChange("");
    setIsOpen(false);
  };

  const hasLocation = stateId || areaId || marketId;

  const getLabel = () => {
    if (selectedLocation.marketName) return selectedLocation.marketName;
    if (selectedLocation.areaName)
      return `${selectedLocation.areaName}, ${selectedLocation.stateName}`;
    if (selectedLocation.stateName) return selectedLocation.stateName;
    return "Location";
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn("gap-2", hasLocation && "border-primary text-primary")}
      >
        <MapPin className="h-4 w-4" />
        <span className="max-w-[150px] truncate">{getLabel()}</span>
        {hasLocation && (
          <Badge
            variant="secondary"
            className="ml-1 h-5 w-5 p-0 flex items-center justify-center"
          >
            {[stateId, areaId, marketId].filter(Boolean).length}
          </Badge>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-background p-4 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Select Location
                </h4>
                {hasLocation && (
                  <button
                    onClick={onClear}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </button>
                )}
              </div>

              {/* State */}
              <div className="mb-3">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  State
                </label>
                <select
                  value={stateId || selectedLocation.stateId || ""}
                  onChange={(e) => onSelectState(e.target.value)}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={statesLoading}
                >
                  <option value="">
                    {statesLoading ? "Loading states..." : "Select state"}
                  </option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area */}
              <div className="mb-3">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Area / LGA
                </label>
                <select
                  value={areaId || selectedLocation.areaId || ""}
                  onChange={(e) => onSelectArea(e.target.value)}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  disabled={
                    (!stateId && !selectedLocation.stateId) || areasLoading
                  }
                >
                  <option value="">
                    {areasLoading
                      ? "Loading areas..."
                      : !stateId && !selectedLocation.stateId
                        ? "Select state first"
                        : areas.length === 0
                          ? "No areas available"
                          : "Select area"}
                  </option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                      {area.localGovernment
                        ? ` (${area.localGovernment})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Market */}
              <div className="mb-4">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Market / Mall
                </label>
                <select
                  value={marketId || selectedLocation.marketId || ""}
                  onChange={(e) => onSelectMarket(e.target.value)}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  disabled={
                    (!areaId && !selectedLocation.areaId) || marketsLoading
                  }
                >
                  <option value="">
                    {marketsLoading
                      ? "Loading markets..."
                      : !areaId && !selectedLocation.areaId
                        ? "Select area first"
                        : markets.length === 0
                          ? "No markets available"
                          : "All markets (optional)"}
                  </option>
                  {markets.map((market) => (
                    <option key={market.id} value={market.id}>
                      {market.name}
                      {market.type
                        ? ` — ${market.type.replace(/_/g, " ")}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Use Current Location */}
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        console.log(
                          "Location:",
                          position.coords.latitude,
                          position.coords.longitude
                        );
                        setIsOpen(false);
                      },
                      (error) => {
                        console.error("Geolocation error:", error);
                      }
                    );
                  }
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                <Navigation className="h-4 w-4" />
                Use my current location
              </button>

              <Button
                className="w-full mt-3"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Apply Location
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}