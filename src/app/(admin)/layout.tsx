"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LoadingState } from "@/components/common";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading, isAuthenticated, isAdmin } = useAuth(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState text="Loading admin panel..." />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      {/* Add top padding on mobile for the mobile header bar */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="container-premium py-8">{children}</div>
      </main>
    </div>
  );
}