import { api } from "@/lib/api";

export interface UploadResponse {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

export const uploadService = {
  async uploadProductImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    // Use axios directly since we need multipart/form-data
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/upload/product`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1]}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload image");
    }

    const data = await response.json();
    return data.data || data;
  },

  async uploadMultipleProductImages(files: File[]): Promise<UploadResponse[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/upload/images`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1]}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload images");
    }

    const data = await response.json();
    return data.data || data;
  },

  async uploadShopEntrance(file: File): Promise<UploadResponse> {
    return this.uploadSingle(file, "shop-entrance");
  },

  async uploadShopLogo(file: File): Promise<UploadResponse> {
    return this.uploadSingle(file, "shop-logo");
  },

  async deleteImage(publicId: string): Promise<void> {
    await api.delete(`/upload/${encodeURIComponent(publicId)}`);
  },

  async uploadSingle(file: File, endpoint: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/upload/${endpoint}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1]}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload image");
    }

    const data = await response.json();
    return data.data || data;
  },
};