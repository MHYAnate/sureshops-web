// src/app/(vendor)/vendor/products/[id]/page.tsx
"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui";
import { BackButton, LoadingState } from "@/components/common";
import { ProductForm } from "@/components/forms/product-form";
import { useUpdateProduct } from "@/hooks";
import { productService } from "@/services";

// ✅ FIX: params is a Promise in Next.js 15
interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  // ✅ FIX: Unwrap with React.use()
  const { id } = use(params);

  const router = useRouter();
  const updateProduct = useUpdateProduct();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });

  const handleSubmit = async (data: any) => {
    try {
      await updateProduct.mutateAsync({ id, data });
      router.push("/vendor/products");
    } catch (error) {
      // handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BackButton label="Back to Products" href="/vendor/products" />
        <LoadingState />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <BackButton label="Back to Products" href="/vendor/products" />
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackButton label="Back to Products" href="/vendor/products" />

      <div>
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">
          Update details for {product.name}
        </p>
      </div>

      <Card className="p-6">
        <ProductForm
          initialData={{
            id: product.id,
            name: product.name,
            description: product.description,
            type: product.type as any,
            price: product.price,
            originalPrice: product.originalPrice,
            category: product.category,
            subcategory: product.subcategory,
            brand: product.brand,
            sku: product.sku,
            barcode: product.barcode,
            quantity: product.quantity,
            unit: product.unit,
            inStock: product.inStock,
            images: product.images || [],
            tags: product.tags || [],
            specifications: product.specifications,
          }}
          onSubmit={handleSubmit}
          isLoading={updateProduct.isPending}
        />
      </Card>
    </div>
  );
}