export enum ReviewType {
  PRODUCT = 'product',
  VENDOR = 'vendor',
}

export interface Review {
  id: string;
  userId: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  type: ReviewType;
  productId?: string;
  vendorId?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  helpfulCount: number;
  isVerified: boolean;
  createdAt: string;
}

export interface ReviewStats {
  reviews: Review[];
  total: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

export interface CreateReviewInput {
  type: ReviewType;
  productId?: string;
  vendorId?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
}