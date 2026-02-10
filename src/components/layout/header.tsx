"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  User,
  MapPin,
  ChevronDown,
  LogOut,
  Store,
  Settings,
  Heart,
  Navigation,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Avatar } from "@/components/ui";
import { Logo } from "@/components/common";
import { useAuth, useLocationSelector } from "@/hooks";
import { useSearchStore } from "@/store";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, isVendor, logout } = useAuth();
  const { addRecentSearch } = useSearchStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    states,
    areas,
    markets,
    statesLoading,
    areasLoading,
    marketsLoading,
    selectedLocation,
    locationLabel,
    handleStateChange,
    handleAreaChange,
    handleMarketChange,
    clearLocation,
  } = useLocationSelector();

  const hasLocation = !!(
    selectedLocation.stateId ||
    selectedLocation.areaId ||
    selectedLocation.marketId
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() && !hasLocation) return;

    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("query", searchQuery.trim());
      addRecentSearch(searchQuery.trim());
    }

    // Include location from the global location store
    if (selectedLocation.stateId) {
      params.set("stateId", selectedLocation.stateId);
    }
    if (selectedLocation.areaId) {
      params.set("areaId", selectedLocation.areaId);
    }
    if (selectedLocation.marketId) {
      params.set("marketId", selectedLocation.marketId);
    }

    params.set("_t", Date.now().toString());
    router.push(`/search?${params.toString()}`);
  };

  // Short label for the location button
  const getShortLocationLabel = () => {
    if (selectedLocation.marketName) return selectedLocation.marketName;
    if (selectedLocation.areaName) return selectedLocation.areaName;
    if (selectedLocation.stateName) return selectedLocation.stateName;
    return "Set Location";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-premium">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Logo href="/" className="flex-shrink-0" />

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
            {/* ==================== LOCATION BUTTON ==================== */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "hidden lg:flex gap-1",
                  hasLocation && "text-primary"
                )}
                onClick={() => {
                  setIsLocationOpen(!isLocationOpen);
                  setIsProfileOpen(false);
                }}
              >
                <MapPin
                  className={cn(
                    "mr-1 h-4 w-4",
                    hasLocation && "text-primary fill-primary/20"
                  )}
                />
                <span className="max-w-[120px] truncate text-sm">
                  {getShortLocationLabel()}
                </span>
                <ChevronDown
                  className={cn(
                    "ml-1 h-3 w-3 transition-transform",
                    isLocationOpen && "rotate-180"
                  )}
                />
              </Button>

              {/* Location Dropdown */}
              <AnimatePresence>
                {isLocationOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsLocationOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-background p-4 shadow-xl"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          Your Location
                        </h4>
                        {hasLocation && (
                          <button
                            onClick={() => {
                              clearLocation();
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <X className="h-3 w-3" />
                            Clear
                          </button>
                        )}
                      </div>

                      {/* State */}
                      <div className="mb-3">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          State
                        </label>
                        <select
                          value={selectedLocation.stateId || ""}
                          onChange={(e) => handleStateChange(e.target.value)}
                          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          disabled={statesLoading}
                        >
                          <option value="">
                            {statesLoading
                              ? "Loading states..."
                              : "Select state"}
                          </option>
                          {states.map((state) => (
                            <option key={state.id} value={state.id}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Area */}
                      <div className="mb-3">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Area / LGA
                        </label>
                        <select
                          value={selectedLocation.areaId || ""}
                          onChange={(e) => handleAreaChange(e.target.value)}
                          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                          disabled={
                            !selectedLocation.stateId || areasLoading
                          }
                        >
                          <option value="">
                            {areasLoading
                              ? "Loading areas..."
                              : !selectedLocation.stateId
                                ? "Select state first"
                                : areas.length === 0
                                  ? "No areas available"
                                  : "Select area"}
                          </option>
                          {areas.map((area) => (
                            <option key={area.id} value={area.id}>
                              {area.name}
                              {area.localGovernment
                                ? ` (${area.localGovernment})`
                                : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Market */}
                      <div className="mb-4">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Market / Mall
                        </label>
                        <select
                          value={selectedLocation.marketId || ""}
                          onChange={(e) => handleMarketChange(e.target.value)}
                          className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                          disabled={
                            !selectedLocation.areaId || marketsLoading
                          }
                        >
                          <option value="">
                            {marketsLoading
                              ? "Loading markets..."
                              : !selectedLocation.areaId
                                ? "Select area first"
                                : markets.length === 0
                                  ? "No markets available"
                                  : "All markets (optional)"}
                          </option>
                          {markets.map((market) => (
                            <option key={market.id} value={market.id}>
                              {market.name}
                              {market.type
                                ? ` — ${market.type.replace(/_/g, " ")}`
                                : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Current location summary */}
                      {hasLocation && (
                        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                          <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          <span className="text-sm text-primary font-medium truncate">
                            {locationLabel}
                          </span>
                        </div>
                      )}

                      {/* Use GPS */}
                      <button
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                console.log(
                                  "GPS:",
                                  position.coords.latitude,
                                  position.coords.longitude
                                );
                                // TODO: reverse geocode to find nearest market
                                setIsLocationOpen(false);
                              },
                              (error) => {
                                console.error("Geolocation error:", error);
                              }
                            );
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                      >
                        <Navigation className="h-4 w-4" />
                        Use my current location
                      </button>

                      {/* Done */}
                      <Button
                        className="w-full mt-3"
                        size="sm"
                        onClick={() => setIsLocationOpen(false)}
                      >
                        Done
                      </Button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

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
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsLocationOpen(false);
                    }}
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

        {/* Mobile Search + Location */}
        <div className="pb-3 md:hidden space-y-2">
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

          {/* Mobile Location Button */}
          <button
            onClick={() => {
              setIsLocationOpen(!isLocationOpen);
              setIsProfileOpen(false);
            }}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-all w-full justify-center",
              hasLocation
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "bg-muted text-muted-foreground"
            )}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">
              {hasLocation ? locationLabel : "Set your location"}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform",
                isLocationOpen && "rotate-180"
              )}
            />
          </button>
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