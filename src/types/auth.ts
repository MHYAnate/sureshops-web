export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'user' | 'vendor' | 'admin' | 'super_admin';
  avatar?: string;
  isEmailVerified: boolean;
  vendorProfile?: string;
  createdAt: string;
  updatedAt: string;
  isActive :boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}