import { api } from '@/lib/api';
import { Review, ReviewStats, CreateReviewInput } from '@/types/reviews';

export const reviewsService = {
  async getProductReviews(productId: string, page?: number, limit?: number): Promise<ReviewStats> {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));
    return api.get<ReviewStats>(`/reviews/product/${productId}?${params.toString()}`);
  },

  async getVendorReviews(vendorId: string, page?: number, limit?: number): Promise<ReviewStats> {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));
    return api.get<ReviewStats>(`/reviews/vendor/${vendorId}?${params.toString()}`);
  },

  async getMyReviews(): Promise<Review[]> {
    return api.get<Review[]>('/reviews/my-reviews');
  },

  async create(data: CreateReviewInput): Promise<Review> {
    return api.post<Review>('/reviews', data);
  },

  async update(id: string, data: Partial<CreateReviewInput>): Promise<Review> {
    return api.put<Review>(`/reviews/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/reviews/${id}`);
  },

  async markHelpful(id: string): Promise<Review> {
    return api.post<Review>(`/reviews/${id}/helpful`);
  },
};