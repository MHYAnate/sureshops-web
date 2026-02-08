"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  User,
  ShoppingBag,
  MapPin,
  ChevronDown,
  LogOut,
  Store,
  Settings,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Avatar } from "@/components/ui";
import { Logo } from "@/components/common";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, isVendor, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-premium">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden flex-1 max-w-xl md:flex"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products, shops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-full border border-input bg-muted/50 pl-10 pr-4 text-sm outline-none transition-all focus:bg-background focus:ring-2 focus:ring-ring"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Location */}
            <Button variant="ghost" size="sm" className="hidden lg:flex">
              <MapPin className="mr-2 h-4 w-4" />
              <span className="max-w-[100px] truncate">Lagos</span>
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>

            {isAuthenticated ? (
              <>
                {/* Favorites */}
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile/favorites">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors"
                  >
                    <Avatar
                      src={user?.avatar}
                      name={`${user?.firstName} ${user?.lastName}`}
                      size="sm"
                    />
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-background p-2 shadow-lg z-50"
                        >
                          <div className="px-3 py-2 border-b border-border mb-2">
                            <p className="font-medium">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user?.email}
                            </p>
                          </div>

                          <Link
                            href="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                          >
                            <User className="h-4 w-4" />
                            Profile
                          </Link>

                          {isVendor && (
                            <Link
                              href="/vendor/dashboard"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                            >
                              <Store className="h-4 w-4" />
                              Vendor Dashboard
                            </Link>
                          )}

                          <Link
                            href="/profile/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>

                          <button
                            onClick={() => {
                              logout();
                              setIsProfileOpen(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products, shops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-full border border-input bg-muted/50 pl-10 pr-4 text-sm outline-none transition-all focus:bg-background focus:ring-2 focus:ring-ring"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border md:hidden"
          >
            <nav className="container-premium py-4 space-y-2">
              <Link
                href="/categories"
                className="block rounded-lg px-4 py-2 hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/shops"
                className="block rounded-lg px-4 py-2 hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Shops
              </Link>
              <Link
                href="/compare"
                className="block rounded-lg px-4 py-2 hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Compare Prices
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}