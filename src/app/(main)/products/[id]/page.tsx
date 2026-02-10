// src/app/(main)/products/[id]/page.tsx
"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Store,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import {
  BackButton,
  PriceTag,
  Rating,
  VerifiedBadge,
  LoadingState,
} from "@/components/common";
import { PriceComparison } from "@/components/products";
import { useProduct } from "@/hooks";
import { searchService } from "@/services";
import { useQuery } from "@tanstack/react-query";

// ✅ FIX: params is a Promise in Next.js 15
interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  // ✅ FIX: Unwrap with React.use()
  const { id } = use(params);

  const { data: product, isLoading } = useProduct(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllVendors, setShowAllVendors] = useState(false);

  const { data: productVendors } = useQuery({
    queryKey: ["product-vendors", product?.name],
    queryFn: () => searchService.getProductVendors(product!.name),
    enabled: !!product?.name,
  });

  const { data: similarProducts } = useQuery({
    queryKey: ["similar-products", id],
    queryFn: () => searchService.getSimilarProducts(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container-premium py-6">
        <LoadingState />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-premium py-6">
        <p>Product not found</p>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : ["/placeholder.jpg"];
  const vendor = product.vendorId as any;

  return (
    <div className="container-premium py-6">
      <BackButton className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            <Image
              src={images[currentImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                Out of Stock
              </Badge>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    index === currentImageIndex
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.brand && (
              <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
            )}
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{product.category}</Badge>
              {product.subcategory && (
                <Badge variant="outline">{product.subcategory}</Badge>
              )}
            </div>
          </div>

          <div className="pb-6 border-b border-border">
            <PriceTag
              price={product.price}
              originalPrice={product.originalPrice}
              size="lg"
            />
            {productVendors && productVendors.totalVendors > 1 && (
              <p className="text-sm text-muted-foreground mt-2">
                Available from {productVendors.totalVendors} vendors •
                Prices from {productVendors.priceRange.lowest.toLocaleString()} to{" "}
                {productVendors.priceRange.highest.toLocaleString()} NGN
              </p>
            )}
          </div>

          {vendor && (
            <Card className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {vendor.shopImages?.logo ? (
                    <Image
                      src={vendor.shopImages.logo}
                      alt={vendor.businessName}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🏪
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/shops/${vendor._id || vendor.id}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {vendor.businessName}
                    </Link>
                    {vendor.isVerified && <VerifiedBadge size="sm" />}
                  </div>
                  <Rating value={vendor.rating || 0} size="sm" className="mt-1" />
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">
                      {vendor.shopNumber && `${vendor.shopNumber}, `}
                      {vendor.marketId?.name || vendor.areaId?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  className="flex-1"
                  onClick={() => window.open(`tel:${vendor.contactDetails.phone}`)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
                {vendor.contactDetails.whatsapp && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      window.open(
                        `https://wa.me/${vendor.contactDetails.whatsapp?.replace(/\D/g, "")}`
                      )
                    }
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.share?.({
                      title: product.name,
                      url: window.location.href,
                    });
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-2 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {productVendors && productVendors.vendors.length > 1 && (
        <div className="mt-12">
          <PriceComparison
            vendors={showAllVendors ? productVendors.vendors : productVendors.vendors.slice(0, 5)}
          />
          {productVendors.vendors.length > 5 && !showAllVendors && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => setShowAllVendors(true)}>
                Show All {productVendors.vendors.length} Vendors
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}