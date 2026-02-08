"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store";
import { useDebounce } from "@/hooks";

interface SearchBarProps {
  variant?: "default" | "hero";
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

const popularSearches = [
  "iPhone 15",
  "Samsung Galaxy",
  "Laptop",
  "PlayStation 5",
  "Air Jordan",
  "MacBook",
];

export function SearchBar({
  variant = "default",
  placeholder = "Search products, shops, brands...",
  className,
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const { recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();
  const debouncedQuery = useDebounce(localQuery, 300);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      addRecentSearch(query.trim());
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(localQuery);
  };

  const handleClear = () => {
    setLocalQuery("");
    inputRef.current?.focus();
  };

  const isHero = variant === "hero";

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "relative flex items-center transition-all duration-200",
            isHero
              ? "rounded-2xl bg-background shadow-2xl ring-1 ring-border"
              : "rounded-full bg-muted/50 ring-1 ring-transparent focus-within:ring-ring focus-within:bg-background"
          )}
        >
          <Search
            className={cn(
              "absolute left-4 text-muted-foreground",
              isHero ? "h-6 w-6" : "h-5 w-5"
            )}
          />
          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className={cn(
              "w-full bg-transparent outline-none placeholder:text-muted-foreground",
              isHero
                ? "h-16 pl-14 pr-14 text-lg"
                : "h-12 pl-12 pr-12 text-sm"
            )}
          />
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                "absolute right-4 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                isHero ? "right-14" : "right-4"
              )}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {isHero && (
            <button
              type="submit"
              className="absolute right-3 rounded-xl bg-primary p-3 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsFocused(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                "absolute left-0 right-0 z-50 mt-2 rounded-xl border border-border bg-background p-4 shadow-xl",
                isHero ? "mt-4" : "mt-2"
              )}
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <span className="text-sm font-medium text-muted-foreground mb-2 block">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-sm hover:bg-muted/80 transition-colors"
                    >
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}