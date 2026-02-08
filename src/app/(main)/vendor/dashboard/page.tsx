"use client";

import { Package, Eye, Star, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui";
import { useMyShop, useMyProducts } from "@/hooks";
import { LoadingState } from "@/components/common";
import { formatNumber } from "@/lib/utils";

export default function VendorDashboardPage() {
  const { data: shop, isLoading: shopLoading } = useMyShop();
  const { data: products, isLoading: productsLoading } = useMyProducts();

  if (shopLoading || productsLoading) {
    return <LoadingState />;
  }

  const stats = [
    {
      label: "Total Products",
      value: products?.length || 0,
      icon: Package,
      trend: "+12%",
    },
    {
      label: "Total Views",
      value: shop?.totalViews || 0,
      icon: Eye,
      trend: "+8%",
    },
    {
      label: "Rating",
      value: shop?.rating?.toFixed(1) || "0.0",
      icon: Star,
      trend: "+0.2",
    },
    // {
    //   label: "Search Appearances",
    //   value: shop?.searchAppearances || 0,
    //   icon: TrendingUp,
    //   trend: "+15%",
    // },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {shop?.businessName || "Vendor"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">
                    {typeof stat.value === "number"
                      ? formatNumber(stat.value)
                      : stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">{stat.trend} this month</p>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/vendor/products/new"
            className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center"
          >
            <Package className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">Add Product</span>
          </a>
          <a
            href="/vendor/products"
            className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center"
          >
            <Eye className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">View Products</span>
          </a>
          <a
            href="/vendor/settings"
            className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center"
          >
            <Star className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">Shop Settings</span>
          </a>
          <a
            href={`/shops/${shop?.id}`}
            className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center"
          >
            <TrendingUp className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">View Shop</span>
          </a>
        </div>
      </Card>
    </div>
  );
}