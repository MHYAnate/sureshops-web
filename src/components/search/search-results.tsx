// search-results.tsx
"use client";

import { useState } from "react";
import { Grid, List, Package, Store } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { ProductGrid, PriceComparison } from "@/components/products";
import { ShopGrid } from "@/components/shops";
import { EmptyState, LoadingState, Pagination } from "@/components/common";
import { SearchResults as SearchResultsType, SearchType } from "@/types";
import { searchResultToDisplayData } from "@/types/shop-display";  // ✅ Import converter
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  results: SearchResultsType | undefined;
  isLoading: boolean;
  searchType: SearchType;
  onSearchTypeChange: (type: SearchType) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
}

export function SearchResults({
  results,
  isLoading,
  searchType,
  onSearchTypeChange,
  onPageChange,
  currentPage,
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "compare">("grid");

  if (isLoading) {
    return <LoadingState text="Searching..." />;
  }

  if (!results) {
    return (
      <EmptyState
        icon={<Package className="h-10 w-10" />}
        title="Start searching"
        description="Enter a product name, shop, or category to find what you're looking for"
      />
    );
  }

  const hasProducts = results.products && results.products.items.length > 0;
  const hasShops = results.shops && results.shops.items.length > 0;
  const hasComparison =
    results.productComparison && results.productComparison.items.length > 0;

  return (
    <div className="space-y-6">
      {/* Tabs & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={
              searchType === "all" || searchType === "products"
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() => onSearchTypeChange("products")}
          >
            <Package className="mr-2 h-4 w-4" />
            Products
            {results.products && (
              <Badge variant="secondary" className="ml-2">
                {results.products.total}
              </Badge>
            )}
          </Button>
          <Button
            variant={searchType === "shops" ? "default" : "outline"}
            size="sm"
            onClick={() => onSearchTypeChange("shops")}
          >
            <Store className="mr-2 h-4 w-4" />
            Shops
            {results.shops && (
              <Badge variant="secondary" className="ml-2">
                {results.shops.total}
              </Badge>
            )}
          </Button>
        </div>

        {(searchType === "all" || searchType === "products") && hasProducts && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <div className="flex rounded-lg border border-border">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("compare")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "compare" ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {searchType === "shops" ? (
        hasShops ? (
          <>
            {/* ✅ Convert ShopSearchResult[] → ShopDisplayData[] */}
            <ShopGrid
              shops={results.shops!.items.map(searchResultToDisplayData)}
            />
            {results.shops!.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={results.shops!.totalPages}
                onPageChange={onPageChange}
              />
            )}
          </>
        ) : (
          <EmptyState
            icon={<Store className="h-10 w-10" />}
            title="No shops found"
            description="Try adjusting your search or filters"
          />
        )
      ) : (
        <>
          {viewMode === "grid" ? (
            hasProducts ? (
              <>
                <ProductGrid products={results.products!.items} />
                {results.products!.totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={results.products!.totalPages}
                    onPageChange={onPageChange}
                  />
                )}
              </>
            ) : (
              <EmptyState
                icon={<Package className="h-10 w-10" />}
                title="No products found"
                description="Try adjusting your search or filters"
              />
            )
          ) : hasComparison ? (
            <div className="space-y-8">
              {results.productComparison!.items.map((product) => (
                <div key={product.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <Badge variant="outline">
                      {product.totalVendors} vendors
                    </Badge>
                  </div>
                  <PriceComparison vendors={product.vendors} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Package className="h-10 w-10" />}
              title="No products to compare"
              description="Try searching for a specific product"
            />
          )}
        </>
      )}

      {results.meta && (
        <p className="text-center text-sm text-muted-foreground">
          Found in {results.meta.took}ms
        </p>
      )}
    </div>
  );
}