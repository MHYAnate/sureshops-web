"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Heart, Settings, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks";
import { LoadingState } from "@/components/common";

const profileNav = [
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/profile/favorites", icon: Heart, label: "Favorites" },
  { href: "/profile/settings", icon: Settings, label: "Settings" },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isLoading, isAuthenticated } = useAuth(true);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container-premium py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
            {profileNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}