"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorService, searchService } from "@/services";
import { Vendor } from "@/types";
import toast from "react-hot-toast";

export function useShops(filters?: any) {
  return useQuery({
    queryKey: ["shops", filters],
    queryFn: () => vendorService.getAll(filters),
    staleTime: 60000,
  });
}

export function useShop(id: string) {
  return useQuery({
    queryKey: ["shop", id],
    queryFn: () => vendorService.getById(id),
    enabled: !!id,
  });
}

export function useShopProducts(vendorId: string, filters?: any) {
  return useQuery({
    queryKey: ["shop-products", vendorId, filters],
    queryFn: () => searchService.getShopProducts(vendorId, filters),
    enabled: !!vendorId,
  });
}

export function useMyShop() {
  return useQuery({
    queryKey: ["my-shop"],
    queryFn: () => vendorService.getMyProfile(),
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Vendor>) => vendorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-shop"] });
      toast.success("Shop created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create shop");
    },
  });
}

export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vendor> }) =>
      vendorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-shop"] });
      toast.success("Shop updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update shop");
    },
  });
}