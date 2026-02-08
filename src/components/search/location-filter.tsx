"use client";

import { useState, useEffect } from "react";
import { MapPin, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Select } from "@/components/ui";
import { useLocation } from "@/hooks";
import { cn } from "@/lib/utils";

interface LocationFilterProps {
  stateId?: string;
  areaId?: string;
  marketId?: string;
  onStateChange: (id: string | undefined) => void;
  onAreaChange: (id: string | undefined) => void;
  onMarketChange: (id: string | undefined) => void;
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
    selectedState,
    selectedArea,
    selectedMarket,
    setSelectedState,
    setSelectedArea,
    setSelectedMarket,
    loading,
    getLocationString,
    clearLocationFilters,
  } = useLocation();

  // Sync with external props
  useEffect(() => {
    if (stateId && states.length > 0) {
      const state = states.find((s) => s.id === stateId);
      if (state && state.id !== selectedState?.id) {
        setSelectedState(state);
      }
    }
  }, [stateId, states]);

  const handleStateChange = (id: string) => {
    const state = states.find((s) => s.id === id);
    setSelectedState(state || null);
    onStateChange(id || undefined);
    onAreaChange(undefined);
    onMarketChange(undefined);
  };

  const handleAreaChange = (id: string) => {
    const area = areas.find((a) => a.id === id);
    setSelectedArea(area || null);
    onAreaChange(id || undefined);
    onMarketChange(undefined);
  };

  const handleMarketChange = (id: string) => {
    const market = markets.find((m) => m.id === id);
    setSelectedMarket(market || null);
    onMarketChange(id || undefined);
  };

  const handleClear = () => {
    clearLocationFilters();
    onStateChange(undefined);
    onAreaChange(undefined);
    onMarketChange(undefined);
    setIsOpen(false);
  };

  const locationText = getLocationString() || "All Locations";
  const hasSelection = selectedState || selectedArea || selectedMarket;

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <MapPin className="h-4 w-4" />
        <span className="max-w-[150px] truncate">{locationText}</span>
        {hasSelection ? (
          <X
            className="h-4 w-4 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 z-50 mt-2 w-72 rounded-xl border border-border bg-background p-4 shadow-xl"
            >
              <div className="space-y-4">
                <h4 className="font-medium">Filter by Location</h4>

                {/* State */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    State
                  </label>
                  <Select
                    value={selectedState?.id || ""}
                    onChange={handleStateChange}
                    options={[
                      { value: "", label: "All States" },
                      ...states.map((s) => ({ value: s.id, label: s.name })),
                    ]}
                    placeholder="Select state"
                    disabled={loading}
                  />
                </div>

                {/* Area */}
                {selectedState && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">
                      Area
                    </label>
                    <Select
                      value={selectedArea?.id || ""}
                      onChange={handleAreaChange}
                      options={[
                        { value: "", label: "All Areas" },
                        ...areas.map((a) => ({ value: a.id, label: a.name })),
                      ]}
                      placeholder="Select area"
                      disabled={loading || areas.length === 0}
                    />
                  </div>
                )}

                {/* Market */}
                {selectedArea && markets.length > 0 && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">
                      Market / Mall
                    </label>
                    <Select
                      value={selectedMarket?.id || ""}
                      onChange={handleMarketChange}
                      options={[
                        { value: "", label: "All Markets" },
                        ...markets.map((m) => ({ value: m.id, label: m.name })),
                      ]}
                      placeholder="Select market"
                      disabled={loading}
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}