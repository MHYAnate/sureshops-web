import { Vendor, VendorListing } from './vendor';
import { LocationInfo } from './location';

export interface Product {
  id: string;
  vendorId: string | Vendor;
  catalogItemId?: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  brand?: string;
  type: 'sale' | 'lease' | 'rent' | 'service';
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  quantity: number;
  unit?: string;
  specifications?: Record<string, any>;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'out_of_stock' | 'discontinued';
  views: number;
  inStock: boolean;
  stateId?: string;
  areaId?: string;
  marketId?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductSearchResult {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  category: string;
  subcategory?: string;
  images: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  inStock: boolean;
  vendor: {
    id: string;
    businessName: string;
    logo?: string;
    rating: number;
    isVerified: boolean;
    contactDetails: {
      phone: string;
      whatsapp?: string;
    };
  };
  location: LocationInfo;
}

export interface ProductWithVendors {
  id: string;
  catalogItemId?: string;
  name: string;
  description?: string;
  brand?: string;
  category: string;
  subcategory?: string;
  images: string[];
  priceRange: {
    lowest: number;
    highest: number;
    average: number;
    currency: string;
  };
  totalVendors: number;
  vendors: VendorListing[];
}

export interface ProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  stateId?: string;
  areaId?: string;
  marketId?: string;
  inStock?: boolean;
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'newest' | 'rating';
  page?: number;
  limit?: number;
}