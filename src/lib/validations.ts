// import { z } from "zod";

// export const loginSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// export const registerSchema = z.object({
//   firstName: z.string().min(2, "First name must be at least 2 characters"),
//   lastName: z.string().min(2, "Last name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   phone: z.string().min(10, "Invalid phone number"),
// });

// export const productSchema = z.object({
//   name: z.string().min(2, "Product name is required"),
//   description: z.string().optional(),
//   type: z.enum(["sale", "lease", "rent", "service"]).default("sale"),
//   price: z
//     .union([z.string(), z.number()])
//     .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
//     .refine((val) => !isNaN(val) && val >= 0, "Price must be a positive number"),
//   originalPrice: z
//     .union([z.string(), z.number(), z.undefined(), z.null()])
//     .transform((val) => {
//       if (val === "" || val === undefined || val === null) return undefined;
//       const num = typeof val === "string" ? parseFloat(val) : val;
//       return isNaN(num) ? undefined : num;
//     })
//     .optional(),
//   category: z.string().min(1, "Category is required"),
//   subcategory: z.string().optional(),
//   brand: z.string().optional(),
//   sku: z.string().optional(),
//   barcode: z.string().optional(),
//   quantity: z
//     .union([z.string(), z.number()])
//     .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
//     .refine((val) => !isNaN(val) && val >= 0, "Quantity must be 0 or more")
//     .default(0),
//   unit: z.string().optional(),
//   inStock: z.boolean().default(true),
//   images: z.array(z.string()).optional().default([]),
//   tags: z.array(z.string()).optional().default([]),
//   specifications: z.record(z.string(), z.any()).optional(),
// });

// export const vendorSchema = z.object({
//   businessName: z.string().min(2, "Business name is required"),
//   businessDescription: z.string().optional(),
//   vendorType: z.enum([
//     "market_shop",
//     "mall_shop",
//     "home_based",
//     "street_shop",
//     "online_only",
//   ]),
//   stateId: z.string().min(1, "State is required"),
//   areaId: z.string().min(1, "Area is required"),
//   marketId: z.string().optional(),
//   shopNumber: z.string().optional(),
//   shopFloor: z.string().optional(),
//   shopBlock: z.string().optional(),
//   shopAddress: z.string().optional(),
//   landmark: z.string().optional(),
//   contactDetails: z.object({
//     phone: z.string().min(10, "Phone is required"),
//     alternatePhone: z.string().optional(),
//     whatsapp: z.string().optional(),
//     email: z.string().email("Invalid email").optional().or(z.literal("")),
//     instagram: z.string().optional(),
//     facebook: z.string().optional(),
//     twitter: z.string().optional(),
//     website: z.string().optional(),
//   }),
//   bankDetails: z
//     .object({
//       bankName: z.string().optional(),
//       accountName: z.string().optional(),
//       accountNumber: z.string().optional(),
//       bankCode: z.string().optional(),
//     })
//     .optional(),
//   operatingHours: z
//     .object({
//       openingTime: z.string().optional(),
//       closingTime: z.string().optional(),
//       operatingDays: z.array(z.string()).optional(),
//     })
//     .optional(),
//   categories: z.array(z.string()).optional(),
//   tags: z.array(z.string()).optional(),
// });

// export type LoginInput = z.infer<typeof loginSchema>;
// export type RegisterInput = z.infer<typeof registerSchema>;
// export type ProductInput = z.infer<typeof productSchema>;
// export type VendorInput = z.infer<typeof vendorSchema>;
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

// ✅ No transforms — use valueAsNumber in register() instead
// This keeps z.infer input === output, so zodResolver works with useForm
export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().optional(),
  type: z.enum(["sale", "lease", "rent", "service"]),
  price: z.number().min(0, "Price must be positive"),
  originalPrice: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  quantity: z.number().min(0, "Quantity must be 0 or more"),
  unit: z.string().optional(),
  inStock: z.boolean(),
  images: z.array(z.string()),
  tags: z.array(z.string()),
  specifications: z.record(z.string(), z.any()).optional(),
});

export const vendorSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessDescription: z.string().optional(),
  vendorType: z.enum([
    "market_shop",
    "mall_shop",
    "home_based",
    "street_shop",
    "online_only",
  ]),
  stateId: z.string().min(1, "State is required"),
  areaId: z.string().min(1, "Area is required"),
  marketId: z.string().optional(),
  shopNumber: z.string().optional(),
  shopFloor: z.string().optional(),
  shopBlock: z.string().optional(),
  shopAddress: z.string().optional(),
  landmark: z.string().optional(),
  contactDetails: z.object({
    phone: z.string().min(10, "Phone is required"),
    alternatePhone: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    website: z.string().optional(),
  }),
  bankDetails: z
    .object({
      bankName: z.string().optional(),
      accountName: z.string().optional(),
      accountNumber: z.string().optional(),
      bankCode: z.string().optional(),
    })
    .optional(),
  operatingHours: z
    .object({
      openingTime: z.string().optional(),
      closingTime: z.string().optional(),
      operatingDays: z.array(z.string()).optional(),
    })
    .optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type VendorInput = z.infer<typeof vendorSchema>;