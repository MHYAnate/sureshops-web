"use client";

import { useEffect, useRef } from "react";
import { Select } from "@/components/ui";
import { useLocationSelect } from "@/hooks/use-location-select";

interface LocationSelectProps {
  initialStateId?: string;
  initialAreaId?: string;
  initialMarketId?: string;
  includeMarkets?: boolean;
  showMarket?: boolean;
  onStateChange?: (stateId: string) => void;
  onAreaChange?: (areaId: string) => void;
  onMarketChange?: (marketId: string) => void;
  stateError?: string;
  areaError?: string;
  marketError?: string;
  disabled?: boolean;
}

export function LocationSelect({
  initialStateId,
  initialAreaId,
  initialMarketId,
  includeMarkets = true,
  showMarket = true,
  onStateChange,
  onAreaChange,
  onMarketChange,
  stateError,
  areaError,
  marketError,
  disabled = false,
}: LocationSelectProps) {
  const {
    states,
    areas,
    markets,
    selectedStateId,
    selectedAreaId,
    selectedMarketId,
    loadingStates,
    loadingAreas,
    loadingMarkets,
    handleStateChange: internalStateChange,
    handleAreaChange: internalAreaChange,
    handleMarketChange: internalMarketChange,
  } = useLocationSelect({
    initialStateId,
    initialAreaId,
    initialMarketId,
    includeMarkets: includeMarkets && showMarket,
  });

  // Track previous values to avoid duplicate callbacks
  const prevStateId = useRef(initialStateId || "");
  const prevAreaId = useRef(initialAreaId || "");
  const prevMarketId = useRef(initialMarketId || "");

  // Sync selected values back to parent form via callbacks
  useEffect(() => {
    if (selectedStateId !== prevStateId.current) {
      prevStateId.current = selectedStateId;
      onStateChange?.(selectedStateId);
    }
  }, [selectedStateId, onStateChange]);

  useEffect(() => {
    if (selectedAreaId !== prevAreaId.current) {
      prevAreaId.current = selectedAreaId;
      onAreaChange?.(selectedAreaId);
    }
  }, [selectedAreaId, onAreaChange]);

  useEffect(() => {
    if (selectedMarketId !== prevMarketId.current) {
      prevMarketId.current = selectedMarketId;
      onMarketChange?.(selectedMarketId);
    }
  }, [selectedMarketId, onMarketChange]);

  const handleStateSelect = (stateId: string) => {
    internalStateChange(stateId);
    onStateChange?.(stateId);
    onAreaChange?.("");
    onMarketChange?.("");
  };

  const handleAreaSelect = (areaId: string) => {
    internalAreaChange(areaId);
    onAreaChange?.(areaId);
    onMarketChange?.("");
  };

  const handleMarketSelect = (marketId: string) => {
    internalMarketChange(marketId);
    onMarketChange?.(marketId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* State Select */}
      <div>
        <label className="block text-sm font-medium mb-2">
          State <span className="text-destructive">*</span>
        </label>
        <Select
          value={selectedStateId}
          onChange={handleStateSelect}
          options={states.map((s) => ({ value: s.id, label: s.name }))}
          placeholder={loadingStates ? "Loading states..." : "Select state"}
          disabled={disabled || loadingStates}
          error={stateError}
        />
      </div>

      {/* Area Select */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Area <span className="text-destructive">*</span>
        </label>
        <Select
          value={selectedAreaId}
          onChange={handleAreaSelect}
          options={areas.map((a) => ({ value: a.id, label: a.name }))}
          placeholder={
            loadingAreas
              ? "Loading areas..."
              : !selectedStateId
                ? "Select state first"
                : areas.length === 0
                  ? "No areas found"
                  : "Select area"
          }
          disabled={disabled || !selectedStateId || loadingAreas || areas.length === 0}
          error={areaError}
        />
      </div>

      {/* Market Select (optional) */}
      {showMarket && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Market / Mall
          </label>
          <Select
            value={selectedMarketId}
            onChange={handleMarketSelect}
            options={[
              { value: "", label: "None (Home-based / Street)" },
              ...markets.map((m) => ({
                value: m.id,
                label: `${m.name}${m.type ? ` (${m.type.replace(/_/g, " ")})` : ""}`,
              })),
            ]}
            placeholder={
              loadingMarkets
                ? "Loading markets..."
                : !selectedAreaId
                  ? "Select area first"
                  : markets.length === 0
                    ? "No markets in this area"
                    : "Select market (optional)"
            }
            disabled={disabled || !selectedAreaId || loadingMarkets}
            error={marketError}
          />
        </div>
      )}
    </div>
  );
}