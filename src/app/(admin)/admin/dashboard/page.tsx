"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, Badge, Button } from "@/components/ui";
import { AdminStats } from "@/components/admin/admin-stats";
import { LoadingState } from "@/components/common";
import { adminService } from "@/services/admin.service";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { AlertCircle, CheckCircle, Clock, ArrowRight } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.getDashboardStats(),
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ["admin-activity"],
    queryFn: () => adminService.getRecentActivity(10),
  });

  const { data: pendingVendors } = useQuery({
    queryKey: ["pending-vendors"],
    queryFn: () => adminService.getPendingVendors(),
  });

  const { data: pendingProducts } = useQuery({
    queryKey: ["pending-products"],
    queryFn: () => adminService.getPendingProducts(),
  });

  if (statsLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform metrics and pending actions
        </p>
      </div>

      {/* Stats */}
      {stats && <AdminStats stats={stats} />}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Vendors */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Pending Vendors
              {pendingVendors && pendingVendors.length > 0 && (
                <Badge variant="warning">{pendingVendors.length}</Badge>
              )}
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/vendors?filter=pending">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {pendingVendors && pendingVendors.length > 0 ? (
            <div className="space-y-3">
              {pendingVendors.slice(0, 5).map((vendor: any) => (
                <div
                  key={vendor._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{vendor.businessName}</p>
                    <p className="text-xs text-muted-foreground">
                      {vendor.userId?.email}
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/admin/vendors?id=${vendor._id}`}>Review</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p>No pending vendors</p>
            </div>
          )}
        </Card>

        {/* Pending Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Pending Products
              {pendingProducts && pendingProducts.length > 0 && (
                <Badge variant="warning">{pendingProducts.length}</Badge>
              )}
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products?filter=pending">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {pendingProducts && pendingProducts.length > 0 ? (
            <div className="space-y-3">
              {pendingProducts.slice(0, 5).map((product: any) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium truncate max-w-[200px]">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.vendorId?.businessName}
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/admin/products?id=${product._id}`}>Review</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p>No pending products</p>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        {activityLoading ? (
          <LoadingState />
        ) : activity && activity.length > 0 ? (
          <div className="space-y-3">
            {activity.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      item.type === "user_registered" && "bg-blue-500",
                      item.type === "vendor_created" && "bg-amber-500",
                      item.type === "vendor_verified" && "bg-green-500",
                      item.type === "product_added" && "bg-purple-500"
                    )}
                  />
                  <span className="text-sm">{item.message}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.timestamp), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-6">
            No recent activity
          </p>
        )}
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}