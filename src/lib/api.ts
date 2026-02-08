import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { ApiError } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Recursively transform MongoDB _id fields to id throughout the response.
 * Handles nested objects, arrays, and ObjectId string values.
 */
function transformIds(data: any): any {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map(transformIds);
  }

  if (typeof data === "object" && !(data instanceof Date)) {
    const transformed: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === "_id") {
        // Map _id to id, keep the value as string
        transformed["id"] = typeof value === "object" && value !== null
          ? String(value)
          : value;
      } else if (key === "__v") {
        // Skip mongoose version key
        continue;
      } else {
        transformed[key] = transformIds(value);
      }
    }
    return transformed;
  }

  return data;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api/v1`,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    // Request interceptor — attach JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor — transform _id → id, handle 401
    this.client.interceptors.response.use(
      (response) => {
        if (response.data) {
          response.data = transformIds(response.data);
        }
        return response;
      },
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          Cookies.remove("access_token");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Extract data from response.
   * Handles both wrapped { data: T } and direct T responses.
   */
  private extractData<T>(responseData: any): T {
    if (
      responseData &&
      typeof responseData === "object" &&
      "data" in responseData &&
      !Array.isArray(responseData)
    ) {
      return responseData.data as T;
    }
    return responseData as T;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return this.extractData<T>(response.data);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return this.extractData<T>(response.data);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return this.extractData<T>(response.data);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch(url, data, config);
    return this.extractData<T>(response.data);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return this.extractData<T>(response.data);
  }

  async uploadFile(url: string, file: File, fieldName: string = "file"): Promise<any> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await this.client.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return this.extractData(response.data);
  }
}

export const api = new ApiClient();