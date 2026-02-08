"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesService } from "@/services";
import { FavoriteType } from "@/types/favorites";
import toast from "react-hot-toast";

export function useFavorites(type?: FavoriteType) {
  return useQuery({
    queryKey: ["favorites", type],
    queryFn: () => favoritesService.getAll(type),
  });
}

export function useFavoriteProducts() {
  return useQuery({
    queryKey: ["favorites", "products"],
    queryFn: () => favoritesService.getProducts(),
  });
}

export function useFavoriteVendors() {
  return useQuery({
    queryKey: ["favorites", "vendors"],
    queryFn: () => favoritesService.getVendors(),
  });
}

export function useFavoriteCount() {
  return useQuery({
    queryKey: ["favorites", "count"],
    queryFn: () => favoritesService.getCount(),
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, itemId }: { type: FavoriteType; itemId: string }) =>
      favoritesService.toggle(type, itemId),
    onSuccess: (data, { type }) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(data.isFavorite ? "Added to favorites" : "Removed from favorites");
    },
    onError: () => {
      toast.error("Failed to update favorites");
    },
  });
}

export function useIsFavorite(type: FavoriteType, itemId: string) {
  return useQuery({
    queryKey: ["favorite", type, itemId],
    queryFn: () => favoritesService.isFavorite(type, itemId),
    enabled: !!itemId,
  });
}