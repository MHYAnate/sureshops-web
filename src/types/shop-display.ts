// src/types/shop-display.ts
import { Vendor, ShopSearchResult } from "@/types";

export interface ShopDisplayData {
  id: string;
  businessName: string;
  businessDescription?: string;
  vendorType?: string;
  operatingHours?: {
    openingTime?: string;
    closingTime?: string;
  };
  isFeatured?: boolean;
  isVerified?: boolean;
  rating: number;
  reviewCount: number;
  totalProducts: number;
  categories?: string[];
  entrancePhoto?: string;
  logo?: string;
  priceRange?: { min: number; max: number };
  featuredProducts?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  }[];
  location?: {
    shopNumber?: string;
    market?: { name: string };
    area?: { name: string };
    state?: { name: string };
    address?: string;
  };
}

export function vendorToDisplayData(vendor: Vendor): ShopDisplayData {
  const stateRef = vendor.stateId as any;
  const areaRef = vendor.areaId as any;
  const marketRef = vendor.marketId as any;

  return {
    id: vendor.id,
    businessName: vendor.businessName,
    businessDescription: vendor.businessDescription,
    vendorType: vendor.vendorType,
    isFeatured: vendor.isFeatured,
    isVerified: vendor.isVerified,
    rating: vendor.rating || 0,
    reviewCount: vendor.reviewCount || 0,
    totalProducts: vendor.totalProducts || 0,
    categories: vendor.categories,
    entrancePhoto: vendor.shopImages?.entrancePhoto,
    logo: vendor.shopImages?.logo,
    priceRange:
      vendor.minProductPrice > 0
        ? { min: vendor.minProductPrice, max: vendor.maxProductPrice }
        : undefined,
    operatingHours: vendor.operatingHours
      ? {
          openingTime: vendor.operatingHours.openingTime,
          closingTime: vendor.operatingHours.closingTime,
        }
      : undefined,
    location: {
      shopNumber: vendor.shopNumber,
      market:
        typeof marketRef === "object" && marketRef
          ? { name: marketRef.name }
          : undefined,
      area:
        typeof areaRef === "object" && areaRef
          ? { name: areaRef.name }
          : undefined,
      state:
        typeof stateRef === "object" && stateRef
          ? { name: stateRef.name }
          : undefined,
      address: vendor.shopAddress,
    },
  };
}

export function searchResultToDisplayData(
  result: ShopSearchResult
): ShopDisplayData {
  return {
    id: result.id,
    businessName: result.businessName,
    businessDescription: result.businessDescription,
    vendorType: result.vendorType,
    isFeatured: result.isFeatured,
    isVerified: result.isVerified,
    rating: result.rating || 0,
    reviewCount: result.reviewCount || 0,
    totalProducts: result.totalProducts || 0,
    categories: result.categories,
    entrancePhoto: result.entrancePhoto,
    logo: result.logo,
    priceRange: result.priceRange,
    featuredProducts: result.featuredProducts,
    operatingHours: result.operatingHours
      ? {
          openingTime: result.operatingHours.openingTime,
          closingTime: result.operatingHours.closingTime,
        }
      : undefined,
    location: result.location
      ? {
          shopNumber: result.location.shopNumber,
          market: result.location.market
            ? { name: result.location.market.name }
            : undefined,
          area: result.location.area
            ? { name: result.location.area.name }
            : undefined,
          state: result.location.state
            ? { name: result.location.state.name }
            : undefined,
        }
      : undefined,
  };
}