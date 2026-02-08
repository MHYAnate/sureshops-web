import { Product, Vendor } from './index';

export enum FavoriteType {
  PRODUCT = 'product',
  VENDOR = 'vendor',
}

export interface Favorite {
  id: string;
  userId: string;
  type: FavoriteType;
  itemId: string;
  productId?: Product;
  vendorId?: Vendor;
  createdAt: string;
}

export interface FavoriteCount {
  products: number;
  vendors: number;
}