"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BackButton, Pagination, LoadingState } from "@/components/common";
import { ShopGrid } from "@/components/shops";
import { LocationFilter } from "@/components/search";
import { Select, Input, Button, Card } from "@/components/ui";
import { vendorService } from "@/services";
import { Search, SlidersHorizontal } from "lucide-react";
import { VENDOR_TYPES } from "@/lib/constants";
import { vendorToDisplayData } from "@/types/shop-display";

export default function ShopsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["shops", page, search, filters],
    queryFn: () =>
      vendorService.getAll({
        page,
        limit: 12,
        search: search || undefined,
        ...filters,
      }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="container-premium py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Shops</h1>
        <p className="text-muted-foreground mt-1">
          Discover local shops and vendors
        </p>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <LocationFilter
            stateId={filters.stateId}
            areaId={filters.areaId}
            marketId={filters.marketId}
            onStateChange={(id) => setFilters((f: any) => ({ ...f, stateId: id, areaId: undefined, marketId: undefined }))}
            onAreaChange={(id) => setFilters((f: any) => ({ ...f, areaId: id, marketId: undefined }))}
            onMarketChange={(id) => setFilters((f: any) => ({ ...f, marketId: id }))}
          />

          <Select
            value={filters.vendorType || ""}
            onChange={(value) => setFilters((f: any) => ({ ...f, vendorType: value || undefined }))}
            options={[{ value: "", label: "All Types" }, ...VENDOR_TYPES]}
            className="w-40"
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </form>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isVerified === true}
                onChange={(e) =>
                  setFilters((f: any) => ({
                    ...f,
                    isVerified: e.target.checked || undefined,
                  }))
                }
                className="rounded border-input"
              />
              <span className="text-sm">Verified Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isFeatured === true}
                onChange={(e) =>
                  setFilters((f: any) => ({
                    ...f,
                    isFeatured: e.target.checked || undefined,
                  }))
                }
                className="rounded border-input"
              />
              <span className="text-sm">Featured Only</span>
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilters({});
                setSearch("");
                setPage(1);
              }}
            >
              Clear All
            </Button>
          </div>
        )}
      </Card>

      {/* Results */}
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {data?.total || 0} shops found
          </div>
          <ShopGrid  shops={(data?.vendors || []).map(vendorToDisplayData)} />
          {data && data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
              className="mt-8"
            />
          )}
        </>
      )}
    </div>
  );
}