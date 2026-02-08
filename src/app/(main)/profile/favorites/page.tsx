"use client";

import { useState } from "react";
import { Heart, Store, Package } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { LoadingState, EmptyState } from "@/components/common";
import { ProductGrid } from "@/components/products";
import { ShopGrid } from "@/components/shops";
import { useFavoriteProducts, useFavoriteVendors } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

type Tab = "products" | "shops";

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("products");

  const { data: products, isLoading: productsLoading } = useFavoriteProducts();
  const { data: vendors, isLoading: vendorsLoading } = useFavoriteVendors();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Favorites</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "products" ? "default" : "outline"}
          onClick={() => setActiveTab("products")}
        >
          <Package className="mr-2 h-4 w-4" />
          Products ({products?.length || 0})
        </Button>
        <Button
          variant={activeTab === "shops" ? "default" : "outline"}
          onClick={() => setActiveTab("shops")}
        >
          <Store className="mr-2 h-4 w-4" />
          Shops ({vendors?.length || 0})
        </Button>
      </div>

      {/* Content */}
      {activeTab === "products" ? (
        productsLoading ? (
          <LoadingState />
        ) : products && products.length > 0 ? (
          <ProductGrid
            products={products.map((f) => ({
              id: f.productId?.id || "",
              name: f.productId?.name || "",
              price: f.productId?.price || 0,
              images: f.productId?.images || [],
              category: f.productId?.category || "",
              inStock: true,
              currency: "NGN",
              vendor: {
                id: "",
                businessName: "",
                rating: 0,
                isVerified: false,
                contactDetails: { phone: "" },
              },
              location: {
                state: { id: "", name: "" },
                area: { id: "", name: "" },
              },
            }))}
          />
        ) : (
          <EmptyState
            icon={<Heart className="h-10 w-10" />}
            title="No favorite products"
            description="Products you favorite will appear here"
          />
        )
      ) : vendorsLoading ? (
        <LoadingState />
      ) : vendors && vendors.length > 0 ? (
        <ShopGrid
          shops={vendors.map((f) => ({
            id: f.vendorId?.id || "",
            businessName: f.vendorId?.businessName || "",
            businessDescription: f.vendorId?.businessDescription,
            vendorType: "market_shop",
            rating: f.vendorId?.rating || 0,
            reviewCount: 0,
            totalProducts: f.vendorId?.totalProducts || 0,
            isVerified: false,
            isFeatured: false,
            categories: [],
            priceRange: { min: 0, max: 0 },
            contactDetails: {},
            location: {
              state: { id: "", name: "" },
              area: { id: "", name: "" },
            },
          }))}
        />
      ) : (
        <EmptyState
          icon={<Store className="h-10 w-10" />}
          title="No favorite shops"
          description="Shops you favorite will appear here"
        />
      )}
    </div>
  );
}