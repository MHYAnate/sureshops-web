// // // src/app/(main)/search/search-content.tsx
// // "use client";

// // import { useSearchParams } from "next/navigation";
// // import { useEffect, useState, useRef } from "react";
// // import { SearchBar, SearchFilters, SearchResults } from "@/components/search";
// // import { BackButton, LoadingState } from "@/components/common";
// // import { useSearch } from "@/hooks";
// // import { SearchType } from "@/types";

// // export function SearchPageContent() {
// //   const searchParams = useSearchParams();
// //   const initializedRef = useRef(false);

// //   const initialQuery = searchParams.get("query") || "";
// //   const initialStateId = searchParams.get("stateId") || "";
// //   const initialAreaId = searchParams.get("areaId") || "";
// //   const initialMarketId = searchParams.get("marketId") || "";
// //   const initialSearchType =
// //     (searchParams.get("searchType") as SearchType) || "all";

// //   const {
// //     query,
// //     filters,
// //     results,
// //     isLoading,
// //     setQuery,
// //     updateFilter,
// //     clearFilters,
// //   } = useSearch();

// //   const [searchType, setSearchType] = useState<SearchType>(initialSearchType);

// //   // Initialize from URL params once
// //   useEffect(() => {
// //     if (initializedRef.current) return;
// //     initializedRef.current = true;

// //     if (initialQuery) setQuery(initialQuery);
// //     if (initialStateId) updateFilter("stateId", initialStateId);
// //     if (initialAreaId) updateFilter("areaId", initialAreaId);
// //     if (initialMarketId) updateFilter("marketId", initialMarketId);
// //     if (initialSearchType !== "all")
// //       updateFilter("searchType", initialSearchType);
// //   }, []);

// //   const handlePageChange = (page: number) => {
// //     updateFilter("page", page);
// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   };

// //   const handleSearchTypeChange = (type: SearchType) => {
// //     setSearchType(type);
// //     updateFilter("searchType", type);
// //   };

// //   return (
// //     <div className="container-premium py-6">
// //       <div className="mb-6">
// //         <BackButton />
// //       </div>

// //       <div className="mb-6">
// //         <SearchBar
// //           placeholder="Search products, shops, brands..."
// //           autoFocus={!initialQuery}
// //         />
// //       </div>

// //       <SearchFilters
// //         filters={filters}
// //         availableFilters={results?.availableFilters}
// //         onFilterChange={updateFilter}
// //         onClearFilters={clearFilters}
// //         className="mb-6"
// //       />

// //       <SearchResults
// //         results={results}
// //         isLoading={isLoading}
// //         searchType={searchType}
// //         onSearchTypeChange={handleSearchTypeChange}
// //         onPageChange={handlePageChange}
// //         currentPage={filters.page || 1}
// //       />
// //     </div>
// //   );
// // }
// // src/app/(main)/search/search-content.tsx
// "use client";

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState, useRef, useMemo } from "react";
// import { SearchBar, SearchFilters, SearchResults } from "@/components/search";
// import { BackButton, LoadingState } from "@/components/common";
// import { useSearch } from "@/hooks";
// import { SearchType } from "@/types";

// export function SearchPageContent() {
//   const searchParams = useSearchParams();

//   // ✅ FIX: Read URL params reactively (not just once)
//   const urlQuery = searchParams.get("query") || "";
//   const urlStateId = searchParams.get("stateId") || "";
//   const urlAreaId = searchParams.get("areaId") || "";
//   const urlMarketId = searchParams.get("marketId") || "";
//   const urlSearchType =
//     (searchParams.get("searchType") as SearchType) || "all";

//   // ✅ FIX: Create a stable key from all URL params to detect changes
//   const urlKey = useMemo(
//     () =>
//       `${urlQuery}-${urlStateId}-${urlAreaId}-${urlMarketId}-${urlSearchType}-${searchParams.get("_t") || ""}`,
//     [urlQuery, urlStateId, urlAreaId, urlMarketId, urlSearchType, searchParams]
//   );

//   const {
//     query,
//     filters,
//     results,
//     isLoading,
//     setQuery,
//     updateFilter,
//     clearFilters,
//   } = useSearch();

//   const [searchType, setSearchType] = useState<SearchType>(urlSearchType);
//   const lastUrlKeyRef = useRef("");

//   // ✅ FIX: Re-initialize from URL params whenever they change
//   useEffect(() => {
//     if (urlKey === lastUrlKeyRef.current) return;
//     lastUrlKeyRef.current = urlKey;

//     // Clear previous filters first
//     clearFilters();

//     // Apply URL params
//     if (urlQuery) setQuery(urlQuery);
//     if (urlStateId) updateFilter("stateId", urlStateId);
//     if (urlAreaId) updateFilter("areaId", urlAreaId);
//     if (urlMarketId) updateFilter("marketId", urlMarketId);
//     if (urlSearchType !== "all") {
//       updateFilter("searchType", urlSearchType);
//       setSearchType(urlSearchType);
//     }
//   }, [urlKey]); // eslint-disable-line react-hooks/exhaustive-deps

//   const handlePageChange = (page: number) => {
//     updateFilter("page", page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleSearchTypeChange = (type: SearchType) => {
//     setSearchType(type);
//     updateFilter("searchType", type);
//   };

//   return (
//     <div className="container-premium py-6">
//       <div className="mb-6">
//         <BackButton />
//       </div>

//       <div className="mb-6">
//         <SearchBar
//           placeholder="Search products, shops, brands..."
//           autoFocus={!urlQuery}
//         />
//       </div>

//       <SearchFilters
//         filters={filters}
//         availableFilters={results?.availableFilters}
//         onFilterChange={updateFilter}
//         onClearFilters={clearFilters}
//         className="mb-6"
//       />

//       <SearchResults
//         results={results}
//         isLoading={isLoading}
//         searchType={searchType}
//         onSearchTypeChange={handleSearchTypeChange}
//         onPageChange={handlePageChange}
//         currentPage={filters.page || 1}
//       />
//     </div>
//   );
// }
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useMemo } from "react";
import { SearchBar, SearchFilters, SearchResults } from "@/components/search";
import { BackButton } from "@/components/common";
import { useSearch } from "@/hooks";
import { useSearchStore } from "@/store";
import { SearchType, SearchFilters as SearchFiltersType } from "@/types";

export function SearchPageContent() {
  const searchParams = useSearchParams();

  // Read URL params reactively
  const urlQuery = searchParams.get("query") || "";
  const urlStateId = searchParams.get("stateId") || "";
  const urlAreaId = searchParams.get("areaId") || "";
  const urlMarketId = searchParams.get("marketId") || "";
  const urlSearchType =
    (searchParams.get("searchType") as SearchType) || "all";

  // Stable key from all URL params to detect changes
  const urlKey = useMemo(
    () =>
      `${urlQuery}-${urlStateId}-${urlAreaId}-${urlMarketId}-${urlSearchType}-${searchParams.get("_t") || ""}`,
    [urlQuery, urlStateId, urlAreaId, urlMarketId, urlSearchType, searchParams]
  );

  const { query, filters, results, isLoading, updateFilter, clearFilters } =
    useSearch();

  // Get the batch initializer directly from the store
  const initializeFromParams = useSearchStore(
    (state) => state.initializeFromParams
  );
  const addRecentSearch = useSearchStore((state) => state.addRecentSearch);

  const [searchType, setSearchType] = useState<SearchType>(urlSearchType);
  const lastUrlKeyRef = useRef("");

  // Single atomic update instead of multiple sequential set() calls
  useEffect(() => {
    if (urlKey === lastUrlKeyRef.current) return;
    lastUrlKeyRef.current = urlKey;

    // Build filters object in one go
    const newFilters: Partial<SearchFiltersType> = {};
    if (urlStateId) newFilters.stateId = urlStateId;
    if (urlAreaId) newFilters.areaId = urlAreaId;
    if (urlMarketId) newFilters.marketId = urlMarketId;
    if (urlSearchType !== "all") newFilters.searchType = urlSearchType as any;

    // Single state update — triggers ONE re-render, ONE React Query call
    initializeFromParams({
      query: urlQuery,
      filters: newFilters,
    });

    // Update local search type
    setSearchType(urlSearchType);

    // Track recent search
    if (urlQuery.trim()) {
      addRecentSearch(urlQuery.trim());
    }
  }, [urlKey]); // eslint-disable-line react-hooks/exhaustive-deps

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
          autoFocus={!urlQuery}
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