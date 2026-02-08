import { LocationInfo } from './location';

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankCode?: string;
}

export interface ContactDetails {
  phone: string;
  alternatePhone?: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
}

export interface ShopImages {
  entrancePhoto?: string;
  logo?: string;
  layoutMap?: string;
  additionalImages?: string[];
}

export interface OperatingHours {
  openingTime?: string;
  closingTime?: string;
  operatingDays?: string[];
  is24Hours?: boolean;
}

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  businessDescription?: string;
  vendorType: 'market_shop' | 'mall_shop' | 'home_based' | 'street_shop' | 'online_only';
  stateId: string;
  areaId: string;
  marketId?: string;
  shopNumber?: string;
  shopFloor?: string;
  shopBlock?: string;
  shopAddress?: string;
  landmark?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  shopImages?: ShopImages;
  contactDetails: ContactDetails;
  bankDetails?: BankDetails;
  operatingHours?: OperatingHours;
  categories: string[];
  tags: string[];
  totalProducts: number;
  totalViews: number;
  rating: number;
  reviewCount: number;
  minProductPrice: number;
  maxProductPrice: number;
  isActive: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorListing {
  vendorId: string;
  productId: string;
  businessName: string;
  logo?: string;
  entrancePhoto?: string;
  rating: number;
  isVerified: boolean;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  quantity: number;
  contactDetails: ContactDetails;
  bankDetails?: BankDetails;
  location: LocationInfo;
  operatingHours?: {
    openingTime?: string;
    closingTime?: string;
    operatingDays?: string[];
    isOpen: boolean;
  };
}

export interface ShopSearchResult {
  id: string;
  businessName: string;
  businessDescription?: string;
  vendorType: string;
  logo?: string;
  entrancePhoto?: string;
  layoutMap?: string;
  rating: number;
  reviewCount: number;
  totalProducts: number;
  isVerified: boolean;
  isFeatured: boolean;
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  contactDetails: Partial<ContactDetails>;
  bankDetails?: BankDetails;
  location: LocationInfo;
  operatingHours?: OperatingHours & { isOpen: boolean };
  featuredProducts?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  }[];
}