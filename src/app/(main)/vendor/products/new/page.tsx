"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui";
import { BackButton } from "@/components/common";
import { ProductForm } from "@/components/forms/product-form";
import { useCreateProduct } from "@/hooks";

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  const handleSubmit = async (data: any) => {
    try {
      await createProduct.mutateAsync(data);
      router.push("/vendor/products");
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      <BackButton label="Back to Products" href="/vendor/products" />

      <div>
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your inventory
        </p>
      </div>

      <Card className="p-6">
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={createProduct.isPending}
        />
      </Card>
    </div>
  );
}