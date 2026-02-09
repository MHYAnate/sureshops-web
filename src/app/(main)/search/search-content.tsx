// src/app/(main)/search/search-content.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { SearchBar, SearchFilters, SearchResults } from "@/components/search";
import { BackButton, LoadingState } from "@/components/common";
import { useSearch } from "@/hooks";
import { SearchType } from "@/types";

export function SearchPageContent() {
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);

  const initialQuery = searchParams.get("query") || "";
  const initialStateId = searchParams.get("stateId") || "";
  const initialAreaId = searchParams.get("areaId") || "";
  const initialMarketId = searchParams.get("marketId") || "";
  const initialSearchType =
    (searchParams.get("searchType") as SearchType) || "all";

  const {
    query,
    filters,
    results,
    isLoading,
    setQuery,
    updateFilter,
    clearFilters,
  } = useSearch();

  const [searchType, setSearchType] = useState<SearchType>(initialSearchType);

  // Initialize from URL params once
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (initialQuery) setQuery(initialQuery);
    if (initialStateId) updateFilter("stateId", initialStateId);
    if (initialAreaId) updateFilter("areaId", initialAreaId);
    if (initialMarketId) updateFilter("marketId", initialMarketId);
    if (initialSearchType !== "all")
      updateFilter("searchType", initialSearchType);
  }, []);

  const handlePageChange = (page: number) => {
    updateFilter("page", page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type);
    updateFilter("searchType", type);
  };

  return (
    <div className="container-premium py-6">
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="mb-6">
        <SearchBar
          placeholder="Search products, shops, brands..."
          autoFocus={!initialQuery}
        />
      </div>

      <SearchFilters
        filters={filters}
        availableFilters={results?.availableFilters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        className="mb-6"
      />

      <SearchResults
        results={results}
        isLoading={isLoading}
        searchType={searchType}
        onSearchTypeChange={handleSearchTypeChange}
        onPageChange={handlePageChange}
        currentPage={filters.page || 1}
      />
    </div>
  );
}