import { create } from "zustand";
import { State, Area, Market } from "@/types";

interface FilterState {
  selectedState: State | null;
  selectedArea: Area | null;
  selectedMarket: Market | null;
  states: State[];
  areas: Area[];
  markets: Market[];
  setSelectedState: (state: State | null) => void;
  setSelectedArea: (area: Area | null) => void;
  setSelectedMarket: (market: Market | null) => void;
  setStates: (states: State[]) => void;
  setAreas: (areas: Area[]) => void;
  setMarkets: (markets: Market[]) => void;
  clearLocationFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedState: null,
  selectedArea: null,
  selectedMarket: null,
  states: [],
  areas: [],
  markets: [],
  
  setSelectedState: (selectedState) =>
    set({ selectedState, selectedArea: null, selectedMarket: null, areas: [], markets: [] }),
  
  setSelectedArea: (selectedArea) =>
    set({ selectedArea, selectedMarket: null, markets: [] }),
  
  setSelectedMarket: (selectedMarket) => set({ selectedMarket }),
  
  setStates: (states) => set({ states }),
  
  setAreas: (areas) => set({ areas }),
  
  setMarkets: (markets) => set({ markets }),
  
  clearLocationFilters: () =>
    set({
      selectedState: null,
      selectedArea: null,
      selectedMarket: null,
      areas: [],
      markets: [],
    }),
}));