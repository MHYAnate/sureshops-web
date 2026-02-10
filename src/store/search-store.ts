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
import { create } from "zustand";
import { SearchFilters, AvailableFilters } from "@/types";

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