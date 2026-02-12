"use client";

import { Users, Store, Package, MapPin, Eye, Search } from "lucide-react";
import { Card } from "@/components/ui";
import { DashboardStats } from "@/types/admin";
import { cn } from "@/lib/utils";

interface AdminStatsProps {
  stats: DashboardStats;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
}

export function AdminStats({ stats }: AdminStatsProps) {
  const statCards = [
    {
      label: "Total Users",
      value: stats.users.total,
      subValue: `${stats.users.active} active`,
      icon: Users,
      trend: `+${stats.users.newThisMonth} this month`,
    },
    {
      label: "Total Vendors",
      value: stats.vendors.total,
      subValue: `${stats.vendors.verified} verified`,
      icon: Store,
      trend: `${stats.vendors.pending} pending`,
      alert: stats.vendors.pending > 0,
    },
    {
      label: "Total Products",
      value: stats.products.total,
      subValue: `${stats.products.approved} approved`,
      icon: Package,
      trend: `${stats.products.pending} pending`,
      alert: stats.products.pending > 0,
    },
    {
      label: "Locations",
      value: stats.locations.states,
      subValue: `${stats.locations.areas} areas, ${stats.locations.markets} markets`,
      icon: MapPin,
    },
    {
      label: "Total Views",
      value: stats.activity.totalViews,
      icon: Eye,
    },
    {
      label: "Search Appearances",
      value: stats.activity.totalSearches,
      icon: Search,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">
                  {formatNumber(stat.value)}
                </p>
                {stat.subValue && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.subValue}
                  </p>
                )}
              </div>
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  stat.alert ? "bg-amber-500/10" : "bg-primary/10"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    stat.alert ? "text-amber-600" : "text-primary"
                  )}
                />
              </div>
            </div>
            {stat.trend && (
              <p
                className={cn(
                  "text-sm mt-2",
                  stat.alert ? "text-amber-600" : "text-green-600"
                )}
              >
                {stat.trend}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}