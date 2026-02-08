"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Store } from "lucide-react";
import { Card } from "@/components/ui";
import { PriceTag, Rating, VerifiedBadge } from "@/components/common";
import { ProductSearchResult } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ProductSearchResult;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Card className={cn("group overflow-hidden", className)}>
      <Link href={`/products/${product.id}`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl text-muted-foreground">📦</span>
            </div>
          )}
          
          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // Handle favorite
            }}
            className="absolute right-2 top-2 rounded-full bg-background/80 p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Stock badge */}
          {!product.inStock && (
            <div className="absolute bottom-2 left-2">
              <span className="rounded-full bg-destructive px-2 py-1 text-xs font-medium text-white">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Vendor */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <Store className="h-3 w-3" />
            <span className="truncate">{product.vendor.businessName}</span>
            {product.vendor.isVerified && <VerifiedBadge size="sm" />}
          </div>

          {/* Name */}
          <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">
              {product.location.market?.name || product.location.area.name}
            </span>
          </div>

          {/* Price & Rating */}
          <div className="mt-3 flex items-center justify-between">
            <PriceTag
              price={product.price}
              originalPrice={product.originalPrice}
              size="sm"
            />
            {product.vendor.rating > 0 && (
              <Rating value={product.vendor.rating} size="sm" showValue={false} />
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}