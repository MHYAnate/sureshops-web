import { api } from "@/lib/api";
import { Vendor, ShopSearchResult } from "@/types";

export const vendorService = {
  async getAll(filters?: any): Promise<{ vendors: Vendor[]; total: number; page: number; totalPages: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    return api.get(`/vendors?${params.toString()}`);
  },

  async getById(id: string): Promise<Vendor> {
    return api.get<Vendor>(`/vendors/${id}`);
  },

  async getMyProfile(): Promise<Vendor> {
    return api.get<Vendor>("/vendors/my-profile");
  },

  async getByMarket(marketId: string): Promise<Vendor[]> {
    return api.get<Vendor[]>(`/vendors/market/${marketId}`);
  },

  async getNearby(longitude: number, latitude: number, distance?: number): Promise<Vendor[]> {
    const params = new URLSearchParams({
      longitude: String(longitude),
      latitude: String(latitude),
    });
    if (distance) params.append("distance", String(distance));
    return api.get<Vendor[]>(`/vendors/nearby?${params.toString()}`);
  },

  async create(data: Partial<Vendor>): Promise<Vendor> {
    return api.post<Vendor>("/vendors", data);
  },

  async update(id: string, data: Partial<Vendor>): Promise<Vendor> {
    return api.put<Vendor>(`/vendors/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/vendors/${id}`);
  },
};