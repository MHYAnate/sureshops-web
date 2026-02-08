"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchBar, SearchFilters, SearchResults } from "@/components/search";
import { BackButton } from "@/components/common";
import { useSearch } from "@/hooks";
import { SearchType } from "@/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("query") || "";
  
  const {
    query,
    filters,
    results,
    isLoading,
    setQuery,
    updateFilter,
    clearFilters,
  } = useSearch();

  const [searchType, setSearchType] = useState<SearchType>("all");

  useEffect(() => {
    if (initialQuery && !query) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

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
      {/* Header */}
      <div className="mb-6">
        <BackButton />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          placeholder="Search products, shops, brands..."
          autoFocus
        />
      </div>

      {/* Filters */}
      <SearchFilters
        filters={filters}
        availableFilters={results?.availableFilters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        className="mb-6"
      />

      {/* Results */}
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