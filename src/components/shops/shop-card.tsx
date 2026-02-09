// shop-card.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Package } from "lucide-react";
import { Card, Badge, Avatar } from "@/components/ui";
import { VerifiedBadge } from "@/components/common";
import { ShopDisplayData } from "@/types/shop-display";
import { cn, formatPrice, isOpen as checkIsOpen } from "@/lib/utils";

interface ShopCardProps {
  shop: ShopDisplayData;  // ✅ Single type, all optional fields handled
  className?: string;
}

export function ShopCard({ shop, className }: ShopCardProps) {
  const shopIsOpen = shop.operatingHours
    ? checkIsOpen(shop.operatingHours.openingTime, shop.operatingHours.closingTime)
    : true;

  return (
    <Card className={cn("group overflow-hidden", className)}>
      <Link href={`/shops/${shop.id}`}>
        {/* Cover Image */}
        <div className="relative h-32 bg-muted">
          {shop.entrancePhoto ? (                        
            <Image
              src={shop.entrancePhoto}
              alt={shop.businessName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <span className="text-4xl">🏪</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant={shopIsOpen ? "success" : "secondary"}>
              {shopIsOpen ? "Open" : "Closed"}
            </Badge>
          </div>

          {/* Featured Badge */}
          {shop.isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge variant="default">Featured</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Logo & Name */}
          <div className="flex items-start gap-3">
            <Avatar
              src={shop.logo}                             
              name={shop.businessName}
              size="lg"
              className="flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  {shop.businessName}
                </h3>
                {shop.isVerified && <VerifiedBadge size="sm" />}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{shop.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">
                  ({shop.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {shop.businessDescription && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {shop.businessDescription}
            </p>
          )}

          {/* Location — ✅ all optional-chained */}
          {/* {shop.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
              <MapPin className="h-4 w-4" />
              <span className="truncate">
                {shop.location.shopNumber && `${shop.location.shopNumber}, `}
                {shop.location.market?.name || shop.location.area?.name}
              </span>
            </div>
          )} */}
          {shop.location && (
  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
    <MapPin className="h-4 w-4" />
    <span className="truncate">
      {shop.location.shopNumber && `${shop.location.shopNumber}, `}
      {shop.location.market?.name || shop.location.area?.name || ""}
      {shop.location.state?.name && `, ${shop.location.state.name}`}
    </span>
  </div>
)}

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>{shop.totalProducts} products</span>
            </div>
            {/* ✅ safe — priceRange is optional */}
            {shop.priceRange && shop.priceRange.min > 0 && (
              <span className="text-muted-foreground">
                {formatPrice(shop.priceRange.min)} - {formatPrice(shop.priceRange.max)}
              </span>
            )}
          </div>

          {/* Categories */}
          {shop.categories && shop.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {shop.categories.slice(0, 3).map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
              {shop.categories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{shop.categories.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Featured Products Preview — ✅ optional */}
          {shop.featuredProducts && shop.featuredProducts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Top Products</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {shop.featuredProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-16 text-center">
                    <div className="relative h-16 w-16 rounded-lg bg-muted overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl">
                          📦
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium mt-1 truncate">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
}