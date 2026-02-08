import { ShopCard } from "./shop-card";
import { ShopSearchResult } from "@/types";
import { Skeleton } from "@/components/ui";
import { EmptyState } from "@/components/common";
import { Store } from "lucide-react";

interface ShopGridProps {
  shops: ShopSearchResult[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ShopGrid({
  shops,
  isLoading,
  emptyMessage = "No shops found",
}: ShopGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <EmptyState
        icon={<Store className="h-10 w-10" />}
        title={emptyMessage}
        description="Try adjusting your search or filters"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
}