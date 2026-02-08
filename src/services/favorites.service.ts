import { api } from '@/lib/api';
import { Favorite, FavoriteType, FavoriteCount } from '@/types/favorites';

export const favoritesService = {
  async getAll(type?: FavoriteType): Promise<Favorite[]> {
    const url = type ? `/favorites?type=${type}` : '/favorites';
    return api.get<Favorite[]>(url);
  },

  async getProducts(): Promise<Favorite[]> {
    return api.get<Favorite[]>('/favorites/products');
  },

  async getVendors(): Promise<Favorite[]> {
    return api.get<Favorite[]>('/favorites/vendors');
  },

  async getCount(): Promise<FavoriteCount> {
    return api.get<FavoriteCount>('/favorites/count');
  },

  async toggle(type: FavoriteType, itemId: string): Promise<{ isFavorite: boolean }> {
    return api.post<{ isFavorite: boolean }>('/favorites/toggle', { type, itemId });
  },

  async add(type: FavoriteType, itemId: string): Promise<Favorite> {
    return api.post<Favorite>('/favorites', { type, itemId });
  },

  async remove(type: FavoriteType, itemId: string): Promise<void> {
    return api.delete(`/favorites/${type}/${itemId}`);
  },

  async isFavorite(type: FavoriteType, itemId: string): Promise<boolean> {
    return api.get<boolean>(`/favorites/check/${type}/${itemId}`);
  },
};