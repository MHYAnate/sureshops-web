import { ProductCard } from "./product-card";
import { ProductSearchResult } from "@/types";
import { Skeleton } from "@/components/ui";
import { EmptyState } from "@/components/common";
import { Package } from "lucide-react";

interface ProductGridProps {
  products: ProductSearchResult[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  isLoading,
  emptyMessage = "No products found",
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-10 w-10" />}
        title={emptyMessage}
        description="Try adjusting your search or filters"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}