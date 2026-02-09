// src/app/(main)/shops/[id]/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Phone,
  MessageCircle,
  Share2,
  Heart,
  MapPin,
  Package,
} from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import {
  BackButton,
  Rating,
  VerifiedBadge,
  LoadingState,
  EmptyState,
  Pagination,
} from "@/components/common";
import { ShopContact, ShopLocation } from "@/components/shops";
import { ProductGrid } from "@/components/products";
import { vendorService, searchService } from "@/services";
import { useToggleFavorite } from "@/hooks/use-favorites";
import { FavoriteType } from "@/types/favorites";
import { formatPrice, isOpen as checkIsOpen } from "@/lib/utils";

interface ShopPageProps {
  params: { id: string };
}

export default function ShopPage({ params }: ShopPageProps) {
  const [productPage, setProductPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const toggleFavorite = useToggleFavorite();

  const { data: shop, isLoading: shopLoading } = useQuery({
    queryKey: ["shop", params.id],
    queryFn: () => vendorService.getById(params.id),
  });

  const { data: shopProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["shop-products", params.id, productPage, selectedCategory],
    queryFn: () =>
      searchService.getShopProducts(params.id, {
        page: productPage,
        // limit: 12,
        category: selectedCategory || undefined,
      }),
    enabled: !!params.id,
  });

  if (shopLoading) {
    return (
      <div className="container-premium py-6">
        <LoadingState />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container-premium py-6">
        <BackButton className="mb-6" />
        <EmptyState
          icon={<Package className="h-10 w-10" />}
          title="Shop not found"
          description="This shop may have been removed or does not exist"
        />
      </div>
    );
  }

  // Extract populated refs
  const stateRef = shop.stateId as any;
  const areaRef = shop.areaId as any;
  const marketRef = shop.marketId as any;

  const stateName =
    typeof stateRef === "object" && stateRef ? stateRef.name : "";
  const areaName =
    typeof areaRef === "object" && areaRef ? areaRef.name : "";
  const marketName =
    typeof marketRef === "object" && marketRef ? marketRef.name : "";
  const marketType =
    typeof marketRef === "object" && marketRef ? marketRef.type : "";

  const shopIsOpen = shop.operatingHours
    ? checkIsOpen(
        shop.operatingHours.openingTime,
        shop.operatingHours.closingTime
      )
    : true;

  const locationInfo = {
    state: {
      id: typeof stateRef === "object" ? stateRef?.id || "" : stateRef || "",
      name: stateName,
    },
    area: {
      id: typeof areaRef === "object" ? areaRef?.id || "" : areaRef || "",
      name: areaName,
    },
    market: marketRef
      ? {
          id:
            typeof marketRef === "object"
              ? marketRef?.id || ""
              : marketRef || "",
          name: marketName,
          type: marketType,
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover image */}
          <div className="relative">
            <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-muted">
              {shop.shopImages?.entrancePhoto ? (
                <Image
                  src={shop.shopImages.entrancePhoto}
                  alt={shop.businessName}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <span className="text-6xl">🏪</span>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge variant={shopIsOpen ? "success" : "secondary"}>
                  {shopIsOpen ? "Open Now" : "Closed"}
                </Badge>
              </div>
              {shop.isFeatured && (
                <div className="absolute top-4 left-4">
                  <Badge variant="default">⭐ Featured</Badge>
                </div>
              )}
            </div>

            {/* Logo */}
            <div className="absolute -bottom-8 left-6">
              <div className="w-20 h-20 rounded-xl border-4 border-background bg-muted overflow-hidden shadow-lg">
                {shop.shopImages?.logo ? (
                  <Image
                    src={shop.shopImages.logo}
                    alt={shop.businessName}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl bg-primary/10">
                    🏪
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shop details */}
          <div className="pt-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {shop.businessName}
                  </h1>
                  {shop.isVerified && <VerifiedBadge size="lg" />}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <Rating
                    value={shop.rating || 0}
                    count={shop.reviewCount}
                    size="md"
                  />
                  <Badge variant="outline">
                    {shop.vendorType?.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {shop.shopNumber && `${shop.shopNumber}, `}
                    {marketName || areaName}
                    {stateName && `, ${stateName}`}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    navigator.share?.({
                      title: shop.businessName,
                      url: window.location.href,
                    })
                  }
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    toggleFavorite.mutate({
                      type: FavoriteType.VENDOR,
                      itemId: shop.id,
                    })
                  }
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {shop.businessDescription && (
              <p className="mt-4 text-muted-foreground">
                {shop.businessDescription}
              </p>
            )}

            {/* Stats */}
            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="font-bold text-lg">{shop.totalProducts}</span>
                <span className="text-muted-foreground ml-1">Products</span>
              </div>
              <div>
                <span className="font-bold text-lg">{shop.totalViews}</span>
                <span className="text-muted-foreground ml-1">Views</span>
              </div>
              {shop.minProductPrice > 0 && (
                <div>
                  <span className="text-muted-foreground">From </span>
                  <span className="font-bold">
                    {formatPrice(shop.minProductPrice)}
                  </span>
                </div>
              )}
            </div>

            {/* Categories */}
            {shop.categories && shop.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {shop.categories.map((cat: string) => (
                  <Badge key={cat} variant="secondary">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Products */}
          <div className="pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-semibold">Products</h2>
              {shop.categories && shop.categories.length > 0 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  <Button
                    size="sm"
                    variant={!selectedCategory ? "default" : "outline"}
                    onClick={() => {
                      setSelectedCategory("");
                      setProductPage(1);
                    }}
                  >
                    All
                  </Button>
                  {shop.categories.map((cat: string) => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={
                        selectedCategory === cat ? "default" : "outline"
                      }
                      onClick={() => {
                        setSelectedCategory(cat);
                        setProductPage(1);
                      }}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {productsLoading ? (
              <LoadingState />
            ) : (
              <>
                <ProductGrid
                  products={shopProducts?.products || []}
                  emptyMessage="No products listed yet"
                />
                {shopProducts && shopProducts.totalPages > 1 && (
                  <Pagination
                    currentPage={productPage}
                    totalPages={shopProducts.totalPages}
                    onPageChange={setProductPage}
                    className="mt-6"
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick contact */}
          <Card className="p-4">
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() =>
                  window.open(`tel:${shop.contactDetails.phone}`)
                }
              >
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
              {shop.contactDetails.whatsapp && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    window.open(
                      `https://wa.me/${shop.contactDetails.whatsapp?.replace(/\D/g, "")}`
                    )
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              )}
            </div>
          </Card>

          <ShopLocation
            location={locationInfo}
            operatingHours={shop.operatingHours}
          />

          <ShopContact
            contactDetails={shop.contactDetails}
            bankDetails={shop.bankDetails}
          />
        </div>
      </div>
    </div>
  );
}