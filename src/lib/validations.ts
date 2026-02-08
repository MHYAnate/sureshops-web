import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Invalid phone number"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  originalPrice: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  quantity: z.number().min(0).default(0),
  inStock: z.boolean().default(true),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const vendorSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessDescription: z.string().optional(),
  vendorType: z.enum(["market_shop", "mall_shop", "home_based", "street_shop", "online_only"]),
  stateId: z.string().min(1, "State is required"),
  areaId: z.string().min(1, "Area is required"),
  marketId: z.string().optional(),
  shopNumber: z.string().optional(),
  shopAddress: z.string().optional(),
  contactDetails: z.object({
    phone: z.string().min(10, "Phone is required"),
    whatsapp: z.string().optional(),
    email: z.string().email().optional(),
  }),
  bankDetails: z.object({
    bankName: z.string().optional(),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
  }).optional(),
  categories: z.array(z.string()).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type VendorInput = z.infer<typeof vendorSchema>;