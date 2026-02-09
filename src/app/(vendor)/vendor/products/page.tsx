"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, MoreHorizontal, Eye } from "lucide-react";
import { Card, Button, Badge, Input } from "@/components/ui";
import { LoadingState, EmptyState, Pagination } from "@/components/common";
import { useMyProducts, useDeleteProduct } from "@/hooks";
import { formatPrice } from "@/lib/utils";

export default function VendorProductsPage() {
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useMyProducts();
  const deleteProduct = useDeleteProduct();

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-muted-foreground">
            Manage your product listings
          </p>
        </div>
        <Button asChild>
          <Link href="/vendor/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Products Table */}
      {filteredProducts && filteredProducts.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Views</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg bg-muted overflow-hidden">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xl">
                              📦
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">
                        {formatPrice(product.price)}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          product.status === "approved"
                            ? "success"
                            : product.status === "pending"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {product.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={product.inStock ? "success" : "destructive"}>
                        {product.inStock ? `${product.quantity} in stock` : "Out of stock"}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {product.views}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/vendor/products/${product.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Delete this product?")) {
                              deleteProduct.mutate(product.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={<Plus className="h-10 w-10" />}
          title="No products yet"
          description="Add your first product to start selling"
          action={{
            label: "Add Product",
            onClick: () => window.location.href = "/vendor/products/new",
          }}
        />
      )}
    </div>
  );
}