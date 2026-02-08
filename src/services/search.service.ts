import { api } from "@/lib/api";
import { SearchFilters, SearchResults, ProductWithVendors } from "@/types";

export const searchService = {
  async search(filters: SearchFilters): Promise<SearchResults> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
    return api.get<SearchResults>(`/search?${params.toString()}`);
  },

  async searchProducts(filters: SearchFilters): Promise<SearchResults["products"]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
    return api.get<SearchResults["products"]>(`/search/products?${params.toString()}`);
  },

  async searchShops(filters: SearchFilters): Promise<SearchResults["shops"]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
    return api.get<SearchResults["shops"]>(`/search/shops?${params.toString()}`);
  },

  async getProductVendors(productName: string, filters?: Partial<SearchFilters>): Promise<ProductWithVendors> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    return api.get<ProductWithVendors>(`/search/product/${encodeURIComponent(productName)}/vendors?${params.toString()}`);
  },

  async getShopProducts(vendorId: string, filters?: { category?: string; minPrice?: number; maxPrice?: number; page?: number }): Promise<any> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    return api.get(`/search/shop/${vendorId}/products?${params.toString()}`);
  },

  async getSimilarProducts(productId: string, limit: number = 10): Promise<any[]> {
    return api.get(`/search/product/${productId}/similar?limit=${limit}`);
  },
};