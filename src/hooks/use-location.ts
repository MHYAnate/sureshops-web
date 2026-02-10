"use client";

import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/services/location.service";
import { useLocationStore } from "../store/search-store";

export function useStates() {
  return useQuery({
    queryKey: ["states"],
    queryFn: () => locationService.getStates(),
    staleTime: 1000 * 60 * 60,
  });
}

export function useAreasByState(stateId?: string) {
  return useQuery({
    queryKey: ["areas", stateId],
    queryFn: () => locationService.getAreasByState(stateId!),
    enabled: !!stateId,
    staleTime: 1000 * 60 * 30,
  });
}

export function useMarketsByArea(areaId?: string) {
  return useQuery({
    queryKey: ["markets", areaId],
    queryFn: () => locationService.getMarketsByArea(areaId!),
    enabled: !!areaId,
    staleTime: 1000 * 60 * 30,
  });
}

export function useLocationSelector() {
  const {
    selectedLocation,
    setState: setStoreState,
    setArea: setStoreArea,
    setMarket: setStoreMarket,
    clearLocation,
    clearArea,
    clearMarket,
    getLocationLabel,
  } = useLocationStore();

  const { data: states, isLoading: statesLoading } = useStates();

  const { data: areas, isLoading: areasLoading } = useAreasByState(
    selectedLocation.stateId
  );

  const { data: markets, isLoading: marketsLoading } = useMarketsByArea(
    selectedLocation.areaId
  );

  const handleStateChange = (stateId: string) => {
    if (!stateId) {
      clearLocation();
      return;
    }
    // Use .id because api.ts transforms _id → id
    const state = states?.find((s) => s.id === stateId);
    if (state) {
      setStoreState(stateId, state.name);
    }
  };

  const handleAreaChange = (areaId: string) => {
    if (!areaId) {
      clearArea();
      return;
    }
    const area = areas?.find((a) => a.id === areaId);
    if (area) {
      setStoreArea(areaId, area.name);
    }
  };

  const handleMarketChange = (marketId: string) => {
    if (!marketId) {
      clearMarket();
      return;
    }
    const market = markets?.find((m) => m.id === marketId);
    if (market) {
      setStoreMarket(marketId, market.name);
    }
  };

  return {
    states: states || [],
    areas: areas || [],
    markets: markets || [],
    statesLoading,
    areasLoading,
    marketsLoading,
    selectedLocation,
    locationLabel: getLocationLabel(),
    handleStateChange,
    handleAreaChange,
    handleMarketChange,
    clearLocation,
  };
}