// import { create } from "zustand";
// import { SearchFilters, AvailableFilters } from "@/types";

// interface SearchState {
//   query: string;
//   filters: Partial<SearchFilters>;
//   availableFilters: AvailableFilters | null;
//   recentSearches: string[];
//   setQuery: (query: string) => void;
//   setFilters: (filters: Partial<SearchFilters>) => void;
//   updateFilter: (key: keyof SearchFilters, value: any) => void;
//   clearFilters: () => void;
//   setAvailableFilters: (filters: AvailableFilters) => void;
//   addRecentSearch: (search: string) => void;
//   clearRecentSearches: () => void;
// }

// export const useSearchStore = create<SearchState>((set, get) => ({
//   query: "",
//   filters: {},
//   availableFilters: null,
//   recentSearches: [],
  
//   setQuery: (query) => set({ query }),
  
//   setFilters: (filters) => set({ filters }),
  
//   updateFilter: (key, value) =>
//     set((state) => ({
//       filters: { ...state.filters, [key]: value },
//     })),
  
//   clearFilters: () => set({ filters: {}, query: "" }),
  
//   setAvailableFilters: (availableFilters) => set({ availableFilters }),
  
//   addRecentSearch: (search) =>
//     set((state) => ({
//       recentSearches: [search, ...state.recentSearches.filter((s) => s !== search)].slice(0, 10),
//     })),
  
//   clearRecentSearches: () => set({ recentSearches: [] }),
// }));

import { SearchFilters, AvailableFilters } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LocationSelection } from "@/types/location";

interface SearchState {
  query: string;
  filters: Partial<SearchFilters>;
  availableFilters: AvailableFilters | null;
  recentSearches: string[];
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  clearFilters: () => void;
  setAvailableFilters: (filters: AvailableFilters) => void;
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
  initializeFromParams: (params: {
    query?: string;
    filters?: Partial<SearchFilters>;
  }) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: "",
  filters: {},
  availableFilters: null,
  recentSearches: [],

  setQuery: (query) => set({ query }),

  setFilters: (filters) => set({ filters }),

  updateFilter: (key, value) =>
    set((state) => {
      const newFilters = { ...state.filters };
      if (value === undefined || value === null || value === "") {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return { filters: newFilters };
    }),

  clearFilters: () => set({ filters: {}, query: "" }),

  setAvailableFilters: (availableFilters) => set({ availableFilters }),

  addRecentSearch: (search) =>
    set((state) => ({
      recentSearches: [
        search,
        ...state.recentSearches.filter((s) => s !== search),
      ].slice(0, 10),
    })),

  clearRecentSearches: () => set({ recentSearches: [] }),

  // Single atomic update — no race conditions
  initializeFromParams: ({ query, filters }) =>
    set({
      query: query || "",
      filters: filters || {},
    }),
}));



interface LocationState {
  selectedLocation: LocationSelection;
  setLocation: (location: LocationSelection) => void;
  setState: (stateId: string, stateName: string) => void;
  setArea: (areaId: string, areaName: string) => void;
  setMarket: (marketId: string, marketName: string) => void;
  clearLocation: () => void;
  clearArea: () => void;
  clearMarket: () => void;
  getLocationLabel: () => string;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      selectedLocation: {},

      setLocation: (location) => set({ selectedLocation: location }),

      setState: (stateId, stateName) =>
        set({
          selectedLocation: {
            stateId,
            stateName,
            areaId: undefined,
            areaName: undefined,
            marketId: undefined,
            marketName: undefined,
          },
        }),

      setArea: (areaId, areaName) =>
        set((state) => ({
          selectedLocation: {
            ...state.selectedLocation,
            areaId,
            areaName,
            marketId: undefined,
            marketName: undefined,
          },
        })),

      setMarket: (marketId, marketName) =>
        set((state) => ({
          selectedLocation: {
            ...state.selectedLocation,
            marketId,
            marketName,
          },
        })),

      clearLocation: () => set({ selectedLocation: {} }),

      clearArea: () =>
        set((state) => ({
          selectedLocation: {
            ...state.selectedLocation,
            areaId: undefined,
            areaName: undefined,
            marketId: undefined,
            marketName: undefined,
          },
        })),

      clearMarket: () =>
        set((state) => ({
          selectedLocation: {
            ...state.selectedLocation,
            marketId: undefined,
            marketName: undefined,
          },
        })),

      getLocationLabel: () => {
        const loc = get().selectedLocation;
        const parts: string[] = [];
        if (loc.marketName) parts.push(loc.marketName);
        else if (loc.areaName) parts.push(loc.areaName);
        if (loc.stateName) parts.push(loc.stateName);
        return parts.join(", ") || "All Locations";
      },
    }),
    {
      name: "sureshops-location",
      partialize: (state) => ({
        selectedLocation: state.selectedLocation,
      }),
    }
  )
);