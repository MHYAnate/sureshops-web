"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { locationService } from "@/services";
import { State, Area, Market } from "@/types";

interface UseLocationSelectOptions {
  initialStateId?: string;
  initialAreaId?: string;
  initialMarketId?: string;
  includeMarkets?: boolean;
}

interface UseLocationSelectReturn {
  states: State[];
  areas: Area[];
  markets: Market[];
  selectedStateId: string;
  selectedAreaId: string;
  selectedMarketId: string;
  loadingStates: boolean;
  loadingAreas: boolean;
  loadingMarkets: boolean;
  handleStateChange: (stateId: string) => void;
  handleAreaChange: (areaId: string) => void;
  handleMarketChange: (marketId: string) => void;
  reset: () => void;
}

export function useLocationSelect(
  options: UseLocationSelectOptions = {}
): UseLocationSelectReturn {
  const {
    initialStateId = "",
    initialAreaId = "",
    initialMarketId = "",
    includeMarkets = true,
  } = options;

  const [states, setStates] = useState<State[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);

  const [selectedStateId, setSelectedStateId] = useState(initialStateId);
  const [selectedAreaId, setSelectedAreaId] = useState(initialAreaId);
  const [selectedMarketId, setSelectedMarketId] = useState(initialMarketId);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingMarkets, setLoadingMarkets] = useState(false);

  // Track whether we are doing initial hydration vs user interaction
  const isInitialHydration = useRef(true);
  const hasFetchedAreas = useRef(false);
  const hasFetchedMarkets = useRef(false);

  // 1. Fetch states on mount
  useEffect(() => {
    let cancelled = false;

    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const data = await locationService.getStates();
        if (!cancelled) {
          setStates(data);
        }
      } catch (error) {
        console.error("Failed to fetch states:", error);
      } finally {
        if (!cancelled) setLoadingStates(false);
      }
    };

    fetchStates();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Fetch areas when selectedStateId changes
  useEffect(() => {
    let cancelled = false;

    if (!selectedStateId) {
      setAreas([]);
      setMarkets([]);
      // Don't clear selectedAreaId during initial hydration
      if (!isInitialHydration.current) {
        setSelectedAreaId("");
        setSelectedMarketId("");
      }
      return;
    }

    const fetchAreas = async () => {
      setLoadingAreas(true);
      try {
        const data = await locationService.getAreasByState(selectedStateId);
        if (!cancelled) {
          setAreas(data);
          hasFetchedAreas.current = true;

          // During initial hydration, check if initialAreaId exists in fetched areas
          if (isInitialHydration.current && initialAreaId) {
            const areaExists = data.find((a) => a.id === initialAreaId);
            if (areaExists) {
              setSelectedAreaId(initialAreaId);
            } else {
              setSelectedAreaId("");
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch areas:", error);
        if (!cancelled) {
          setAreas([]);
        }
      } finally {
        if (!cancelled) setLoadingAreas(false);
      }
    };

    fetchAreas();

    return () => {
      cancelled = true;
    };
  }, [selectedStateId, initialAreaId]);

  // 3. Fetch markets when selectedAreaId changes
  useEffect(() => {
    let cancelled = false;

    if (!selectedAreaId || !includeMarkets) {
      setMarkets([]);
      if (!isInitialHydration.current) {
        setSelectedMarketId("");
      }
      return;
    }

    const fetchMarkets = async () => {
      setLoadingMarkets(true);
      try {
        const data = await locationService.getMarketsByArea(selectedAreaId);
        if (!cancelled) {
          setMarkets(data);
          hasFetchedMarkets.current = true;

          // During initial hydration, check if initialMarketId exists
          if (isInitialHydration.current && initialMarketId) {
            const marketExists = data.find((m) => m.id === initialMarketId);
            if (marketExists) {
              setSelectedMarketId(initialMarketId);
            } else {
              setSelectedMarketId("");
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch markets:", error);
        if (!cancelled) setMarkets([]);
      } finally {
        if (!cancelled) setLoadingMarkets(false);
      }
    };

    fetchMarkets();

    return () => {
      cancelled = true;
    };
  }, [selectedAreaId, includeMarkets, initialMarketId]);

  // 4. Set initial state once states are loaded
  useEffect(() => {
    if (states.length > 0 && initialStateId && isInitialHydration.current) {
      const stateExists = states.find((s) => s.id === initialStateId);
      if (stateExists) {
        setSelectedStateId(initialStateId);
      }
    }
  }, [states, initialStateId]);

  // 5. Mark initial hydration complete after all initial data is loaded
  useEffect(() => {
    if (!isInitialHydration.current) return;

    const statesLoaded = states.length > 0;
    const areasResolved = !initialStateId || hasFetchedAreas.current;
    const marketsResolved =
      !initialAreaId || !includeMarkets || hasFetchedMarkets.current;

    if (statesLoaded && areasResolved && marketsResolved) {
      // Use timeout to ensure all state updates from hydration have settled
      const timer = setTimeout(() => {
        isInitialHydration.current = false;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [states, areas, markets, initialStateId, initialAreaId, includeMarkets]);

  const handleStateChange = useCallback((stateId: string) => {
    isInitialHydration.current = false;
    setSelectedStateId(stateId);
    setSelectedAreaId("");
    setSelectedMarketId("");
    setAreas([]);
    setMarkets([]);
  }, []);

  const handleAreaChange = useCallback((areaId: string) => {
    isInitialHydration.current = false;
    setSelectedAreaId(areaId);
    setSelectedMarketId("");
    setMarkets([]);
  }, []);

  const handleMarketChange = useCallback((marketId: string) => {
    isInitialHydration.current = false;
    setSelectedMarketId(marketId);
  }, []);

  const reset = useCallback(() => {
    isInitialHydration.current = false;
    setSelectedStateId("");
    setSelectedAreaId("");
    setSelectedMarketId("");
    setAreas([]);
    setMarkets([]);
  }, []);

  return {
    states,
    areas,
    markets,
    selectedStateId,
    selectedAreaId,
    selectedMarketId,
    loadingStates,
    loadingAreas,
    loadingMarkets,
    handleStateChange,
    handleAreaChange,
    handleMarketChange,
    reset,
  };
}