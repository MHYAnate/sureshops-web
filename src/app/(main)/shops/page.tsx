"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge, Button, Card } from "@/components/ui";
import {
  BackButton,
  Rating,
  VerifiedBadge,
  LoadingState,
  Pagination,
} from "@/components/common";
import { ProductGrid } from "@/components/products";
import { ShopContact, ShopLocation } from "@/components/shops";
import { useShop, useShopProducts } from "@/hooks";

interface ShopPageProps {
  params: { id: string };
}

export default function ShopPage({ params }: ShopPageProps) {
  const { data: shop, isLoading } = useShop(params.id);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const { data: shopProducts, isLoading: productsLoading } = useShopProducts(
    params.id,
    { category: selectedCategory, page: currentPage }
  );

  if (isLoading) {
    return (
      <div className="container-premium py-6">
        <LoadingState />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container-premium py-6">
        <p>Shop not found</p>
      </div>
    );
  }

  const location = {
    state: { id: shop.stateId, name: (shop as any).stateId?.name || "" },
    area: { id: shop.areaId, name: (shop as any).areaId?.name || "" },
    market: shop.marketId
      ? {
          id: shop.marketId,
          name: (shop as any).marketId?.name || "",
          type: (shop as any).marketId?.type || "",
        }
      : undefined,
    shopNumber: shop.shopNumber,
    shopFloor: shop.shopFloor,
    shopBlock: shop.shopBlock,
    shopAddress: shop.shopAddress,
    landmark: shop.landmark,
    coordinates: shop.location?.coordinates,
  };

  return (
    <div className="container-premium py-6">
      <BackButton className="mb-6" />

      {/* Shop Header */}
      <div className="relative rounded-2xl overflow-hidden bg-muted h-48 md:h-64 mb-6">
        {shop.shopImages?.entrancePhoto ? (
          <Image
            src={shop.shopImages.entrancePhoto}
            alt={shop.businessName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-6xl">🏪</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Shop Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end gap-4">
            {/* Logo */}
            <div className="w-20 h-20 rounded-xl bg-background overflow-hidden flex-shrink-0 border-4 border-background">
              {shop.shopImages?.logo ? (
                <Image
                  src={shop.shopImages.logo}
                  alt={shop.businessName}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  🏪
                </div>
              )}
            </div>

            <div className="flex-1 text-white">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {shop.businessName}
                </h1>
                {shop.isVerified && <VerifiedBadge size="lg" className="text-white" />}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <Rating value={shop.rating} size="sm" className="text-white" />
                <span className="text-white/80">
                  {shop.totalProducts} products
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          {shop.isFeatured && <Badge>Featured</Badge>}
          <Badge variant={shop.isOpen ? "success" : "secondary"}>
            {shop.isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {shop.businessDescription && (
            <Card className="p-6">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">{shop.businessDescription}</p>
            </Card>
          )}

          {/* Categories Filter */}
          {shop.categories && shop.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={!selectedCategory ? "default" : "outline"}
                onClick={() => setSelectedCategory(undefined)}
              >
                All
              </Button>
              {shop.categories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            {productsLoading ? (
              <LoadingState />
            ) : shopProducts?.products ? (
              <>
                <ProductGrid products={shopProducts.products} />
                {shopProducts.totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={shopProducts.totalPages}
                    onPageChange={setCurrentPage}
                    className="mt-6"
                  />
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No products yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ShopContact
            contactDetails={shop.contactDetails}
            bankDetails={shop.bankDetails}
          />
          <ShopLocation
            location={location}
            operatingHours={{
              ...shop.operatingHours,
              isOpen: shop.isOpen,
            }}
          />

          {/* Layout Map */}
          {shop.shopImages?.layoutMap && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Market Layout</h3>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={shop.shopImages.layoutMap}
                  alt="Market layout"
                  fill
                  className="object-contain bg-muted"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                This map shows the location of the shop within the market
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}