"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input, Button, Card } from "@/components/ui";
import { BackButton, LoadingState, EmptyState } from "@/components/common";
import { PriceComparison } from "@/components/products";
import { searchService } from "@/services";
import { Package } from "lucide-react";

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["product-compare", submittedQuery],
    queryFn: () => searchService.getProductVendors(submittedQuery),
    enabled: !!submittedQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
    }
  };

  return (
    <div className="container-premium py-6">
      <BackButton className="mb-6" />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Compare Prices</h1>
          <p className="text-muted-foreground">
            Search for a product to compare prices across different vendors
          </p>
        </div>

        {/* Search Form */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter product name (e.g., iPhone 15 Pro Max)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12"
              />
            </div>
            <Button type="submit" size="lg" disabled={!searchQuery.trim()}>
              Compare
            </Button>
          </form>
        </Card>

        {/* Results */}
        {isLoading ? (
          <LoadingState text="Finding prices..." />
        ) : data ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">{data.name}</h2>
              {data.brand && (
                <p className="text-muted-foreground">{data.brand}</p>
              )}
              <div className="mt-2 flex justify-center gap-4 text-sm">
                <span>
                  <strong className="text-green-600">
                    ₦{data.priceRange.lowest.toLocaleString()}
                  </strong>{" "}
                  lowest
                </span>
                <span>
                  <strong>₦{data.priceRange.average.toLocaleString()}</strong>{" "}
                  average
                </span>
                <span>
                  <strong className="text-red-600">
                    ₦{data.priceRange.highest.toLocaleString()}
                  </strong>{" "}
                  highest
                </span>
              </div>
            </div>

            <PriceComparison vendors={data.vendors} />
          </div>
        ) : submittedQuery ? (
          <EmptyState
            icon={<Package className="h-10 w-10" />}
            title="No results found"
            description={`No vendors found selling "${submittedQuery}"`}
          />
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Enter a product name to see price comparisons
            </p>
          </div>
        )}
      </div>
    </div>
  );
}