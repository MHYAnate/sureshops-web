"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchStore } from "@/store";
import { searchService } from "@/services";
import { SearchFilters, SearchResults } from "@/types";
import { useDebounce } from "./use-debounce";

export function useSearch() {
  const { query, filters, setQuery, setFilters, updateFilter, clearFilters, addRecentSearch } = useSearchStore();
  const debouncedQuery = useDebounce(query, 300);

  const searchFilters: SearchFilters = {
    query: debouncedQuery,
    ...filters,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["search", searchFilters],
    queryFn: () => searchService.search(searchFilters),
    enabled: debouncedQuery.length > 0 || Object.keys(filters).length > 0,
    staleTime: 30000,
  });

  const handleSearch = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      if (newQuery.trim()) {
        addRecentSearch(newQuery.trim());
      }
    },
    [setQuery, addRecentSearch]
  );

  return {
    query,
    filters,
    results: data,
    isLoading,
    error,
    setQuery: handleSearch,
    setFilters,
    updateFilter,
    clearFilters,
    refetch,
  };
}