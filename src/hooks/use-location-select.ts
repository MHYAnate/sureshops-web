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

  // Track whether user triggered the change vs initial load
  const userChangedState = useRef(false);
  const userChangedArea = useRef(false);

  // 1. Fetch states on mount
  useEffect(() => {
    let cancelled = false;

    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const data = await locationService.getStates();
        if (!cancelled) {
          setStates(data);
          // If we have an initial state, make sure it's set
          if (initialStateId) {
            setSelectedStateId(initialStateId);
          }
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
  }, []); // Only run once on mount

  // 2. Fetch areas when selectedStateId changes
  useEffect(() => {
    let cancelled = false;

    if (!selectedStateId) {
      setAreas([]);
      setMarkets([]);
      setSelectedAreaId("");
      setSelectedMarketId("");
      return;
    }

    const fetchAreas = async () => {
      setLoadingAreas(true);

      // Only clear selections if USER changed the state (not initial load)
      if (userChangedState.current) {
        setSelectedAreaId("");
        setSelectedMarketId("");
        setMarkets([]);
        userChangedState.current = false;
      }

      try {
        const data = await locationService.getAreasByState(selectedStateId);
        if (!cancelled) {
          setAreas(data);

          // If we have an initial area and it exists in the fetched data, select it
          if (initialAreaId && !userChangedState.current) {
            const areaExists = data.find((a) => a.id === initialAreaId);
            if (areaExists) {
              setSelectedAreaId(initialAreaId);
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
  }, [selectedStateId]); // Only depend on selectedStateId

  // 3. Fetch markets when selectedAreaId changes
  useEffect(() => {
    let cancelled = false;

    if (!selectedAreaId || !includeMarkets) {
      setMarkets([]);
      if (userChangedArea.current) {
        setSelectedMarketId("");
        userChangedArea.current = false;
      }
      return;
    }

    const fetchMarkets = async () => {
      setLoadingMarkets(true);

      if (userChangedArea.current) {
        setSelectedMarketId("");
        userChangedArea.current = false;
      }

      try {
        const data = await locationService.getMarketsByArea(selectedAreaId);
        if (!cancelled) {
          setMarkets(data);

          // If we have an initial market and it exists, select it
          if (initialMarketId && !userChangedArea.current) {
            const marketExists = data.find((m) => m.id === initialMarketId);
            if (marketExists) {
              setSelectedMarketId(initialMarketId);
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
  }, [selectedAreaId, includeMarkets]); // Only depend on selectedAreaId

  const handleStateChange = useCallback((stateId: string) => {
    userChangedState.current = true;
    setSelectedStateId(stateId);
  }, []);

  const handleAreaChange = useCallback((areaId: string) => {
    userChangedArea.current = true;
    setSelectedAreaId(areaId);
  }, []);

  const handleMarketChange = useCallback((marketId: string) => {
    setSelectedMarketId(marketId);
  }, []);

  const reset = useCallback(() => {
    userChangedState.current = true;
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