"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { authService } from "@/services";
import { auth } from "@/lib/auth";

export function useAuth(requireAuth: boolean = false) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = auth.getToken();
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          auth.removeToken();
          auth.removeUser();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    initAuth();
  }, [setUser]);

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, requireAuth, isAuthenticated, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    isVendor: user?.role === "vendor" || user?.role === "admin" || user?.role === "super_admin",
    isAdmin: user?.role === "admin" || user?.role === "super_admin",
  };
}