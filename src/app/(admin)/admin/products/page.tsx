"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  Button,
  Input,
  Badge,
  Select,
  Modal,
} from "@/components/ui";
import { LoadingState, Pagination } from "@/components/common";
import { adminService } from "@/services/admin.service";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", page, search, statusFilter],
    queryFn: () =>
      adminService.getProducts({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter || undefined,
      }),
  });

  const actionMutation = useMutation({
    mutationFn: ({
      id,
      action,
      reason,
    }: {
      id: string;
      action: string;
      reason?: string;
    }) => adminService.productAction(id, action, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setShowActionModal(false);
      setSelectedProduct(null);
      toast.success("Action completed successfully");
    },
    onError: () => toast.error("Action failed"),
  });

  const bulkApproveMutation = useMutation({
    mutationFn: (ids: string[]) => adminService.bulkApproveProducts(ids),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setSelectedProducts([]);
      toast.success(`${count} products approved`);
    },
    onError: () => toast.error("Bulk action failed"),
  });

  const handleAction = (action: string) => {
    if (!selectedProduct) return;
    actionMutation.mutate({ id: selectedProduct.id, action });
  };

  const handleSelectAll = () => {
    if (!data?.items) return;
    if (selectedProducts.length === data.items.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(data.items.map((p: any) => p._id));
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage product listings</p>
        </div>
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedProducts.length} selected
            </span>
            <Button
              size="sm"
              onClick={() => bulkApproveMutation.mutate(selectedProducts)}
              disabled={bulkApproveMutation.isPending}
            >
              Approve Selected
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            options={STATUS_OPTIONS}
            className="w-40"
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        {isLoading ? (
          <LoadingState />
        ) : data?.items && data.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === data.items.length}
                      onChange={handleSelectAll}
                      className="rounded border-input"
                    />
                  </th>
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Vendor</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Views</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((product: any) => (
                  <tr
                    key={product._id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="rounded border-input"
                      />
                    </td>
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
                          <p className="font-medium line-clamp-1 max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {product.vendorId?.businessName || "N/A"}
                    </td>
                    <td className="p-4 font-medium">
                      {formatPrice(product.price)}
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
                    <td className="p-4 text-sm text-muted-foreground">
                      {product.views}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/products/${product._id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct({
                              ...product,
                              id: product._id,
                            });
                            setShowActionModal(true);
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No products found
          </div>
        )}
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title="Product Actions"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <p>
              Actions for <strong>{selectedProduct.name}</strong>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {selectedProduct.status !== "approved" && (
                <Button
                  onClick={() => handleAction("approve")}
                  className="gap-2"
                  disabled={actionMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              )}
              {selectedProduct.status !== "rejected" && (
                <Button
                  variant="destructive"
                  onClick={() => handleAction("reject")}
                  className="gap-2"
                  disabled={actionMutation.isPending}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => handleAction("delete")}
                className="gap-2 col-span-2"
                disabled={actionMutation.isPending}
              >
                Delete Product
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}