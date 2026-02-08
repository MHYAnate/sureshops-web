"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { Card, Button } from "@/components/ui";
import { VendorForm } from "@/components/forms/vendor-form";
import { useCreateVendor } from "@/hooks/use-shops";
import { Store, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VendorOnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isVendor } = useAuth();
  const createVendor = useCreateVendor();
  const [step, setStep] = useState(1);

  // Already a vendor
  if (isVendor) {
    return (
      <div className="container-premium py-12">
        <Card className="max-w-lg mx-auto p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">You're already a vendor!</h2>
          <p className="text-muted-foreground mb-6">
            Go to your dashboard to manage your shop and products.
          </p>
          <Button asChild>
            <Link href="/vendor/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="container-premium py-12">
        <Card className="max-w-lg mx-auto p-8 text-center">
          <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Become a Vendor</h2>
          <p className="text-muted-foreground mb-6">
            Create an account or sign in to start selling on SureShops.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      await createVendor.mutateAsync(data);
      router.push("/vendor/dashboard");
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="container-premium py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Become a Vendor</h1>
          <p className="text-muted-foreground">
            Set up your shop and start selling to thousands of customers
          </p>
        </div>

        <Card className="p-6">
          <VendorForm
            onSubmit={handleSubmit}
            isLoading={createVendor.isPending}
          />
        </Card>
      </div>
    </div>
  );
}