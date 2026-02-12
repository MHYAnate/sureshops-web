import { api } from "@/lib/api";
import {
  DashboardStats,
  RecentActivity,
  AdminFilters,
  PaginatedResponse,
} from "@/types/admin";

export const adminService = {
  // ==================== DASHBOARD ====================

  async getDashboardStats(): Promise<DashboardStats> {
    return api.get<DashboardStats>("/admin/dashboard/stats");
  },

  async getRecentActivity(limit?: number): Promise<RecentActivity[]> {
    return api.get<RecentActivity[]>(
      `/admin/dashboard/activity?limit=${limit || 20}`
    );
  },

  // ==================== USERS ====================

  async getUsers(filters?: AdminFilters): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    // Backend returns { users: [], total, page, totalPages }
    // api.ts extractData unwraps { data: ... } → raw object
    // transformIds converts _id → id
    const response = await api.get<any>(`/admin/users?${params.toString()}`);
    return {
      items: response.users || [],
      total: response.total || 0,
      page: response.page || 1,
      totalPages: response.totalPages || 1,
    };
  },

  async getUser(id: string): Promise<any> {
    return api.get(`/admin/users/${id}`);
  },

  async createUser(data: any): Promise<any> {
    return api.post("/admin/users", data);
  },

  async updateUser(id: string, data: any): Promise<any> {
    return api.put(`/admin/users/${id}`, data);
  },

  async deleteUser(id: string): Promise<void> {
    return api.delete(`/admin/users/${id}`);
  },

  async changeUserRole(id: string, role: string): Promise<any> {
    return api.put(`/admin/users/${id}/role`, { role });
  },

  // ==================== VENDORS ====================

  async getVendors(filters?: AdminFilters): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    // Backend returns { vendors: [], total, page, totalPages }
    const response = await api.get<any>(
      `/admin/vendors?${params.toString()}`
    );
    return {
      items: response.vendors || [],
      total: response.total || 0,
      page: response.page || 1,
      totalPages: response.totalPages || 1,
    };
  },

  async getPendingVendors(): Promise<any[]> {
    return api.get<any[]>("/admin/vendors/pending");
  },

  async getVendor(id: string): Promise<any> {
    return api.get(`/admin/vendors/${id}`);
  },

  async updateVendor(id: string, data: any): Promise<any> {
    return api.put(`/admin/vendors/${id}`, data);
  },

  async vendorAction(
    id: string,
    action: string,
    reason?: string
  ): Promise<any> {
    return api.post(`/admin/vendors/${id}/action`, { action, reason });
  },

  // ==================== PRODUCTS ====================

  async getProducts(filters?: AdminFilters): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    // Backend returns { products: [], total, page, totalPages }
    const response = await api.get<any>(
      `/admin/products?${params.toString()}`
    );
    return {
      items: response.products || [],
      total: response.total || 0,
      page: response.page || 1,
      totalPages: response.totalPages || 1,
    };
  },

  async getPendingProducts(): Promise<any[]> {
    return api.get<any[]>("/admin/products/pending");
  },

  async getProduct(id: string): Promise<any> {
    return api.get(`/admin/products/${id}`);
  },

  async updateProduct(id: string, data: any): Promise<any> {
    return api.put(`/admin/products/${id}`, data);
  },

  async productAction(
    id: string,
    action: string,
    reason?: string
  ): Promise<any> {
    return api.post(`/admin/products/${id}/action`, { action, reason });
  },

  async bulkApproveProducts(ids: string[]): Promise<number> {
    return api.post<number>("/admin/products/bulk-approve", { ids });
  },

  async bulkRejectProducts(
    ids: string[],
    reason?: string
  ): Promise<number> {
    return api.post<number>("/admin/products/bulk-reject", { ids, reason });
  },

  // ==================== LOCATIONS ====================

  async getLocationStats(): Promise<{
    states: number;
    areas: number;
    markets: number;
  }> {
    const stats = await this.getDashboardStats();
    return stats.locations;
  },

  // ==================== SEED ====================

  async seedAdmins(): Promise<void> {
    return api.post("/admin/seed/admins");
  },

  async listSeededAdmins(): Promise<any[]> {
    return api.get("/admin/seed/admins/list");
  },
};