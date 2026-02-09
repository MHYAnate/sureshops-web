// src/app/(vendor)/vendor/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { VendorSidebar } from "@/components/layout";
import { LoadingState } from "@/components/common";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading, isAuthenticated, isVendor } = useAuth(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState text="Loading vendor panel..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <VendorSidebar />
      <main className="lg:pl-64">
        <div className="container-premium py-8">{children}</div>
      </main>
    </div>
  );
}

