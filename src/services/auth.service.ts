import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    auth.setToken(response.access_token);
    auth.setUser(response.user);
    return response;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", credentials);
    auth.setToken(response.access_token);
    auth.setUser(response.user);
    return response;
  },

  async getMe(): Promise<User> {
    return api.get<User>("/auth/me");
  },

  async logout(): Promise<void> {
    auth.logout();
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return api.put<User>("/users/profile", data);
  },
};