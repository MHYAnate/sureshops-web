import { ProductSearchResult, ProductWithVendors } from './product';
import { ShopSearchResult } from './vendor';

export type SearchType = 'products' | 'shops' | 'all';
export type SortBy = 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'distance' | 'popularity';

export interface SearchFilters {
  query: string;
  searchType?: SearchType;
  stateId?: string;
  areaId?: string;
  marketId?: string;
  longitude?: number;
  latitude?: number;
  maxDistance?: number;
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  verifiedOnly?: boolean;
  tags?: string[];
  sortBy?: SortBy;
  page?: number;
  limit?: number;
}

export interface FilterOption {
  id: string;
  name: string;
  count: number;
}

export interface AvailableFilters {
  states: FilterOption[];
  areas: FilterOption[];
  markets: FilterOption[];
  categories: { name: string; count: number }[];
  brands: { name: string; count: number }[];
  priceRange: { min: number; max: number };
}

export interface SearchResults {
  query: string;
  searchType: string;
  products?: {
    items: ProductSearchResult[];
    total: number;
    page: number;
    totalPages: number;
  };
  shops?: {
    items: ShopSearchResult[];
    total: number;
    page: number;
    totalPages: number;
  };
  productComparison?: {
    items: ProductWithVendors[];
    total: number;
  };
  availableFilters: AvailableFilters;
  meta: {
    timestamp: string;
    took: number;
  };
}