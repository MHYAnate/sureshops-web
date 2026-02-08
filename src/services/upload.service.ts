import { api } from "@/lib/api";

export interface UploadResponse {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

export const uploadService = {
  async uploadImage(file: File): Promise<UploadResponse> {
    return api.uploadFile("/upload/image", file);
  },

  async uploadShopEntrance(file: File): Promise<UploadResponse> {
    return api.uploadFile("/upload/shop-entrance", file);
  },

  async uploadShopLogo(file: File): Promise<UploadResponse> {
    return api.uploadFile("/upload/shop-logo", file);
  },

  async uploadProductImage(file: File): Promise<UploadResponse> {
    return api.uploadFile("/upload/product", file);
  },

  async uploadMarketLayout(file: File): Promise<UploadResponse> {
    return api.uploadFile("/upload/market-layout", file);
  },
};