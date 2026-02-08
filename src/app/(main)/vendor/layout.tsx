"use client";

import { useAuth } from "@/hooks";
import { VendorSidebar } from "@/components/layout";
import { LoadingState } from "@/components/common";
import { redirect } from "next/navigation";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated, isVendor } = useAuth(true);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    redirect("/login");
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