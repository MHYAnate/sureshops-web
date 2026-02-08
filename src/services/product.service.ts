import { api } from "@/lib/api";
import { Product, ProductFilters, PaginatedResponse } from "@/types";

export const productService = {
  async getAll(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    return api.get<any>(`/products?${params.toString()}`).then((res) => ({
      items: res.products || [],
      total: res.total || 0,
      page: res.page || 1,
      totalPages: res.totalPages || 1,
    }));
  },

  async getById(id: string): Promise<Product> {
    return api.get<Product>(`/products/${id}`);
  },

  async getByVendor(vendorId: string): Promise<Product[]> {
    return api.get<Product[]>(`/products/vendor/${vendorId}`);
  },

  async getMyProducts(): Promise<Product[]> {
    return api.get<Product[]>("/products/my-products");
  },

  async getNearby(longitude: number, latitude: number, distance?: number, category?: string): Promise<Product[]> {
    const params = new URLSearchParams({
      longitude: String(longitude),
      latitude: String(latitude),
    });
    if (distance) params.append("distance", String(distance));
    if (category) params.append("category", category);
    return api.get<Product[]>(`/products/nearby?${params.toString()}`);
  },

  async create(data: Partial<Product>): Promise<Product> {
    return api.post<Product>("/products", data);
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    return api.put<Product>(`/products/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/products/${id}`);
  },
};