import Cookies from "js-cookie";
import { User } from "@/types";

const TOKEN_KEY = "access_token";
const USER_KEY = "user";

export const auth = {
  setToken(token: string): void {
    Cookies.set(TOKEN_KEY, token, { expires: 7 });
  },

  getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken(): void {
    Cookies.remove(TOKEN_KEY);
  },

  setUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  getUser(): User | null {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  removeUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_KEY);
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  logout(): void {
    this.removeToken();
    this.removeUser();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
};