"use client";

import { useState, useEffect, useCallback } from "react";
import { useFilterStore } from "@/store";
import { locationService } from "@/services";

export function useLocation() {
  const {
    selectedState,
    selectedArea,
    selectedMarket,
    states,
    areas,
    markets,
    setSelectedState,
    setSelectedArea,
    setSelectedMarket,
    setStates,
    setAreas,
    setMarkets,
    clearLocationFilters,
  } = useFilterStore();

  const [loading, setLoading] = useState(false);

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const data = await locationService.getStates();
        setStates(data);
      } catch (error) {
        console.error("Failed to fetch states:", error);
      } finally {
        setLoading(false);
      }
    };

    if (states.length === 0) {
      fetchStates();
    }
  }, [states.length, setStates]);

  // Fetch areas when state changes
  useEffect(() => {
    const fetchAreas = async () => {
      if (!selectedState) {
        setAreas([]);
        return;
      }

      try {
        setLoading(true);
        const data = await locationService.getAreasByState(selectedState.id);
        setAreas(data);
      } catch (error) {
        console.error("Failed to fetch areas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [selectedState, setAreas]);

  // Fetch markets when area changes
  useEffect(() => {
    const fetchMarkets = async () => {
      if (!selectedArea) {
        setMarkets([]);
        return;
      }

      try {
        setLoading(true);
        const data = await locationService.getMarketsByArea(selectedArea.id);
        setMarkets(data);
      } catch (error) {
        console.error("Failed to fetch markets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [selectedArea, setMarkets]);

  const getLocationString = useCallback(() => {
    const parts = [];
    if (selectedMarket) parts.push(selectedMarket.name);
    if (selectedArea) parts.push(selectedArea.name);
    if (selectedState) parts.push(selectedState.name);
    return parts.join(", ");
  }, [selectedState, selectedArea, selectedMarket]);

  return {
    states,
    areas,
    markets,
    selectedState,
    selectedArea,
    selectedMarket,
    loading,
    setSelectedState,
    setSelectedArea,
    setSelectedMarket,
    clearLocationFilters,
    getLocationString,
    locationFilters: {
      stateId: selectedState?.id,
      areaId: selectedArea?.id,
      marketId: selectedMarket?.id,
    },
  };
}