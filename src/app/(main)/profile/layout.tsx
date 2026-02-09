// src/app/(main)/profile/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks";
import { LoadingState } from "@/components/common";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="container-premium py-6">
        <LoadingState />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container-premium py-6">
      <div className="flex flex-col md:flex-row gap-6">
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
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}