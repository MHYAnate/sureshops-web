// src/types/shop-display.ts
import { Vendor, ShopSearchResult } from "@/types";

/**
 * Unified type for displaying shop cards.
 * All fields that differ between Vendor and ShopSearchResult are optional.
 */
export interface ShopDisplayData {
  id: string;
  businessName: string;
  businessDescription?: string;
  operatingHours?: {
    openingTime: string;
    closingTime: string;
  };
  isFeatured?: boolean;
  isVerified?: boolean;
  rating: number;
  reviewCount: number;
  totalProducts: number;
  categories?: string[];

  // Fields that only ShopSearchResult has
  entrancePhoto?: string;
  logo?: string;
  priceRange?: { min: number; max: number };
  featuredProducts?: { id: string; name: string; price: number; image?: string }[];

  // Location — normalized to one shape
  location?: {
    shopNumber?: string;
    market?: { name: string };
    area?: { name: string };
    address?: string;
  };
}

/**
 * Convert a Vendor to ShopDisplayData
 */
export function vendorToDisplayData(vendor: Vendor): ShopDisplayData {
  return {
    id: vendor.id,
    businessName: vendor.businessName,
    businessDescription: vendor.businessDescription,
    isFeatured: vendor.isFeatured,
    isVerified: vendor.isVerified,
    rating: vendor.rating,
    reviewCount: vendor.reviewCount,
    totalProducts: vendor.totalProducts,
    categories: vendor.categories,
    // Vendor doesn't have these — they stay undefined
    entrancePhoto: undefined,
    logo: undefined,
    priceRange: undefined,
    featuredProducts: undefined,
    location: undefined, // or map from vendor.location if it has address info
  };
}

/**
 * Convert a ShopSearchResult to ShopDisplayData
 */
export function searchResultToDisplayData(result: ShopSearchResult): ShopDisplayData {
  return {
    id: result.id,
    businessName: result.businessName,
    businessDescription: result.businessDescription,
    isFeatured: result.isFeatured,
    isVerified: result.isVerified,
    rating: result.rating,
    reviewCount: result.reviewCount,
    totalProducts: result.totalProducts,
    categories: result.categories,
    entrancePhoto: result.entrancePhoto,
    logo: result.logo,
    priceRange: result.priceRange,
    featuredProducts: result.featuredProducts,
    location: result.location
      ? {
          shopNumber: result.location.shopNumber,
          market: result.location.market,
          area: result.location.area,
        }
      : undefined,
  };
}