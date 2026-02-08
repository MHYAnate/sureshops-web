"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  Card,
  Button,
  Input,
  Badge,
  Select,
  Modal,
  Avatar,
} from "@/components/ui";
import { LoadingState, Pagination } from "@/components/common";
import { adminService } from "@/services/admin.service";
import { Vendor } from "@/types";
import {
  Search,
  CheckCircle,
  XCircle,
  Star,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminVendorsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-vendors", page, search, verifiedFilter],
    queryFn: () =>
      adminService.getVendors({
        page,
        limit: 20,
        search: search || undefined,
        isVerified: verifiedFilter === "" ? undefined : verifiedFilter === "true",
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
    }) => adminService.vendorAction(id, action, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors"] });
      setShowActionModal(false);
      setSelectedVendor(null);
      toast.success("Action completed successfully");
    },
    onError: () => toast.error("Action failed"),
  });

  const handleAction = (action: string) => {
    if (!selectedVendor) return;
    actionMutation.mutate({ id: selectedVendor.id, action });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vendors</h1>
          <p className="text-muted-foreground">Manage vendor accounts</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={verifiedFilter}
            onChange={(value) => {
              setVerifiedFilter(value);
              setPage(1);
            }}
            options={[
              { value: "", label: "All Status" },
              { value: "true", label: "Verified" },
              { value: "false", label: "Pending" },
            ]}
            className="w-40"
          />
        </div>
      </Card>

      {/* Vendors Table */}
      <Card>
        {isLoading ? (
          <LoadingState />
        ) : data?.items && data.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium">Shop</th>
                  <th className="text-left p-4 font-medium">Owner</th>
                  <th className="text-left p-4 font-medium">Location</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Products</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((vendor: any) => (
                  <tr
                    key={vendor._id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={vendor.shopImages?.logo}
                          name={vendor.businessName}
                          size="md"
                        />
                        <div>
                          <p className="font-medium">{vendor.businessName}</p>
                          <p className="text-xs text-muted-foreground">
                            {vendor.vendorType}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">
                        {vendor.userId?.firstName} {vendor.userId?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {vendor.userId?.email}
                      </p>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {vendor.areaId?.name}, {vendor.stateId?.name}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={vendor.isVerified ? "success" : "warning"}
                        >
                          {vendor.isVerified ? "Verified" : "Pending"}
                        </Badge>
                        {vendor.isFeatured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{vendor.totalProducts}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/shops/${vendor._id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedVendor(vendor);
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
            No vendors found
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
        title="Vendor Actions"
      >
        {selectedVendor && (
          <div className="space-y-4">
            <p>
              Actions for <strong>{selectedVendor.businessName}</strong>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {!selectedVendor.isVerified && (
                <Button
                  onClick={() => handleAction("approve")}
                  className="gap-2"
                  disabled={actionMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              )}
              {selectedVendor.isVerified && (
                <Button
                  variant="destructive"
                  onClick={() => handleAction("suspend")}
                  className="gap-2"
                  disabled={actionMutation.isPending}
                >
                  <XCircle className="h-4 w-4" />
                  Suspend
                </Button>
              )}
              {!selectedVendor.isFeatured && (
                <Button
                  variant="outline"
                  onClick={() => handleAction("feature")}
                  className="gap-2"
                  disabled={actionMutation.isPending}
                >
                  <Star className="h-4 w-4" />
                  Feature
                </Button>
              )}
              {selectedVendor.isFeatured && (
                <Button
                  variant="outline"
                  onClick={() => handleAction("unfeature")}
                  className="gap-2"
                  disabled={actionMutation.isPending}
                >
                  <Star className="h-4 w-4" />
                  Unfeature
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}