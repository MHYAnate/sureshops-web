import { api } from '@/lib/api';
import { User, Vendor, Product, PaginatedResponse } from '@/types';
import { DashboardStats, RecentActivity, AdminFilters } from '@/types/admin';

export const adminService = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return api.get<DashboardStats>('/admin/dashboard/stats');
  },

  async getRecentActivity(limit?: number): Promise<RecentActivity[]> {
    return api.get<RecentActivity[]>(`/admin/dashboard/activity?limit=${limit || 20}`);
  },

  // Users
  async getUsers(filters?: AdminFilters): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await api.get<any>(`/admin/users?${params.toString()}`);
    return {
      items: response.users || [],
      total: response.total || 0,
      page: response.page || 1,
      totalPages: response.totalPages || 1,
    };
  },

  async getUser(id: string): Promise<User> {
    return api.get<User>(`/admin/users/${id}`);
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return api.put<User>(`/admin/users/${id}`, data);
  },

  async deleteUser(id: string): Promise<void> {
    return api.delete(`/admin/users/${id}`);
  },

  async changeUserRole(id: string, role: string): Promise<User> {
    return api.put<User>(`/admin/users/${id}/role`, { role });
  },

  // Vendors
  async getVendors(filters?: AdminFilters): Promise<PaginatedResponse<Vendor>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await api.get<any>(`/admin/vendors?${params.toString()}`);
    return {
      items: response.vendors || [],
      total: response.total || 0,
      page: response.page || 1,
      totalPages: response.totalPages || 1,
    };
  },

  async getPendingVendors(): Promise<Vendor[]> {
    return api.get<Vendor[]>('/admin/vendors/pending');
  },

  async getVendor(id: string): Promise<Vendor> {
    return api.get<Vendor>(`/admin/vendors/${id}`);
  },

  async updateVendor(id: string, data: Partial<Vendor>): Promise<Vendor> {
    return api.put<Vendor>(`/admin/vendors/${id}`, data);
  },

  async vendorAction(id: string, action: string, reason?: string): Promise<Vendor> {
    return api.post<Vendor>(`/admin/vendors/${id}/action`, { action, reason });
  },

  // Products
  async getProducts(filters?: AdminFilters): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await api.get<any>(`/admin/products?${params.toString()}`);
    return {
      items: response.products || [],
      total: response.total || 0,
      page: response.page || 1,
      totalPages: response.totalPages || 1,
    };
  },

  async getPendingProducts(): Promise<Product[]> {
    return api.get<Product[]>('/admin/products/pending');
  },

  async getProduct(id: string): Promise<Product> {
    return api.get<Product>(`/admin/products/${id}`);
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return api.put<Product>(`/admin/products/${id}`, data);
  },

  async productAction(id: string, action: string, reason?: string): Promise<Product> {
    return api.post<Product>(`/admin/products/${id}/action`, { action, reason });
  },

  async bulkApproveProducts(ids: string[]): Promise<number> {
    return api.post<number>('/admin/products/bulk-approve', { ids });
  },

  async bulkRejectProducts(ids: string[], reason?: string): Promise<number> {
    return api.post<number>('/admin/products/bulk-reject', { ids, reason });
  },

  // Seed
  async seedAdmins(): Promise<void> {
    return api.post('/admin/seed/admins');
  },
};