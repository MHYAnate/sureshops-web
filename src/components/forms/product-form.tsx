// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button, Input, Select, Badge } from "@/components/ui";
// import { ImageUpload } from "@/components/common/image-upload";
// import { CATEGORIES } from "@/lib/constants";
// import { X } from "lucide-react";

// const productSchema = z.object({
//   name: z.string().min(2, "Product name is required"),
//   description: z.string().optional(),
//   price: z.number().min(1, "Price is required"),
//   originalPrice: z.number().optional(),
//   category: z.string().min(1, "Category is required"),
//   subcategory: z.string().optional(),
//   brand: z.string().optional(),
//   quantity: z.number().min(0),   // ✅ Removed .default(0) — required field
//   inStock: z.boolean(),          // ✅ Removed .default(true) — required field
// });

// type ProductInput = z.infer<typeof productSchema>;
// //   Now: { quantity: number; inStock: boolean; ... }
// //   Matches both useForm AND zodResolver

// interface ProductFormProps {
//   initialData?: Partial<ProductInput> & { images?: string[]; tags?: string[] };
//   onSubmit: (data: ProductInput & { images: string[]; tags: string[] }) => Promise<void>;
//   isLoading?: boolean;
// }

// export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
//   const [images, setImages] = useState<string[]>(initialData?.images || []);
//   const [tags, setTags] = useState<string[]>(initialData?.tags || []);
//   const [tagInput, setTagInput] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm<ProductInput>({
//     resolver: zodResolver(productSchema),   // ✅ No more type error
//     defaultValues: {
//       name: initialData?.name || "",
//       description: initialData?.description || "",
//       price: initialData?.price || 0,
//       originalPrice: initialData?.originalPrice,
//       category: initialData?.category || "",
//       subcategory: initialData?.subcategory || "",
//       brand: initialData?.brand || "",
//       quantity: initialData?.quantity ?? 0,     // ✅ Default provided here
//       inStock: initialData?.inStock ?? true,    // ✅ Default provided here
//     },
//   });

//   const handleFormSubmit = async (data: ProductInput) => {  // ✅ No more type error
//     await onSubmit({ ...data, images, tags });
//   };

//   const addTag = () => {
//     if (tagInput.trim() && !tags.includes(tagInput.trim())) {
//       setTags([...tags, tagInput.trim()]);
//       setTagInput("");
//     }
//   };

//   const removeTag = (tag: string) => {
//     setTags(tags.filter((t) => t !== tag));
//   };

//   const handleImagesChange = (urls: string[]) => {
//     setImages(urls);
//   };

//   return (
//     <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
//       {/* Images */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Product Images</label>
//         <ImageUpload
//           images={images}
//           onChange={handleImagesChange}
//           maxImages={5}
//         />
//       </div>

//       {/* Basic Info */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium mb-2">Product Name *</label>
//           <Input
//             {...register("name")}
//             error={errors.name?.message}
//             placeholder="e.g., iPhone 15 Pro Max 256GB"
//           />
//         </div>

//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium mb-2">Description</label>
//           <textarea
//             {...register("description")}
//             className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
//             placeholder="Describe your product..."
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Category *</label>
//           <Select
//             value={watch("category")}
//             onChange={(value) => setValue("category", value)}
//             options={CATEGORIES.map((c) => ({ value: c.name, label: c.name }))}
//             error={errors.category?.message}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Brand</label>
//           <Input {...register("brand")} placeholder="e.g., Apple, Samsung" />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Price (₦) *</label>
//           <Input
//             type="number"
//             {...register("price", { valueAsNumber: true })}
//             error={errors.price?.message}
//             placeholder="0"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">
//             Original Price (₦)
//           </label>
//           <Input
//             type="number"
//             {...register("originalPrice", { valueAsNumber: true })}
//             placeholder="For discounts"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Quantity</label>
//           <Input
//             type="number"
//             {...register("quantity", { valueAsNumber: true })}
//             placeholder="0"
//           />
//         </div>

//         <div className="flex items-center gap-2 pt-6">
//           <input
//             type="checkbox"
//             {...register("inStock")}
//             id="inStock"
//             className="rounded border-input"
//           />
//           <label htmlFor="inStock" className="text-sm">
//             In Stock
//           </label>
//         </div>
//       </div>

//       {/* Tags */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Tags</label>
//         <div className="flex gap-2 mb-2">
//           <Input
//             value={tagInput}
//             onChange={(e) => setTagInput(e.target.value)}
//             placeholder="Add a tag"
//             onKeyPress={(e) => {
//               if (e.key === "Enter") {
//                 e.preventDefault();
//                 addTag();
//               }
//             }}
//           />
//           <Button type="button" variant="outline" onClick={addTag}>
//             Add
//           </Button>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {tags.map((tag) => (
//             <Badge key={tag} variant="secondary" className="gap-1">
//               {tag}
//               <button
//                 type="button"
//                 onClick={() => removeTag(tag)}
//                 className="hover:text-destructive"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </Badge>
//           ))}
//         </div>
//       </div>

//       <Button type="submit" isLoading={isLoading} className="w-full">
//         {initialData ? "Update Product" : "Add Product"}
//       </Button>
//     </form>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Select } from "@/components/ui";
import { X } from "lucide-react";

// ✅ Schema uses plain types — no transforms that cause input/output mismatch
const productSchema = z.object({
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

type ProductInput = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<ProductInput> & { id?: string };
  onSubmit: (data: ProductInput) => Promise<void>;
  isLoading?: boolean;
}

const PRODUCT_TYPE_OPTIONS = [
  { value: "sale", label: "For Sale" },
  { value: "lease", label: "For Lease" },
  { value: "rent", label: "For Rent" },
  { value: "service", label: "Service" },
];

const CATEGORY_OPTIONS = [
  "Electronics",
  "Fashion",
  "Phones & Tablets",
  "Computers & Accessories",
  "Home & Garden",
  "Health & Beauty",
  "Sports & Fitness",
  "Food & Groceries",
  "Baby & Kids",
  "Automotive",
  "Books & Media",
  "Office Supplies",
  "Building Materials",
  "Agriculture",
  "Services",
  "Other",
];

export function ProductForm({
  initialData,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      type: initialData?.type || "sale",
      price: initialData?.price ?? 0,
      originalPrice: initialData?.originalPrice,
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      brand: initialData?.brand || "",
      sku: initialData?.sku || "",
      barcode: initialData?.barcode || "",
      quantity: initialData?.quantity ?? 0,
      unit: initialData?.unit || "",
      inStock: initialData?.inStock ?? true,
      images: initialData?.images || [],
      tags: initialData?.tags || [],
      specifications: initialData?.specifications || {},
    },
  });

  const watchedTags = watch("tags") || [];
  const watchedImages = watch("images") || [];
  const watchedInStock = watch("inStock");

  // Reset form when initialData changes (edit mode)
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        type: initialData.type || "sale",
        price: initialData.price ?? 0,
        originalPrice: initialData.originalPrice,
        category: initialData.category || "",
        subcategory: initialData.subcategory || "",
        brand: initialData.brand || "",
        sku: initialData.sku || "",
        barcode: initialData.barcode || "",
        quantity: initialData.quantity ?? 0,
        unit: initialData.unit || "",
        inStock: initialData.inStock ?? true,
        images: initialData.images || [],
        tags: initialData.tags || [],
        specifications: initialData.specifications || {},
      });
    }
  }, [initialData, reset]);

  // --- Tag handlers ---
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !watchedTags.includes(tag)) {
      setValue("tags", [...watchedTags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watchedTags.filter((t) => t !== tagToRemove)
    );
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
    if (e.key === "Backspace" && tagInput === "" && watchedTags.length > 0) {
      handleRemoveTag(watchedTags[watchedTags.length - 1]);
    }
  };

  // --- Image URL handlers ---
  const handleAddImage = () => {
    const url = imageUrlInput.trim();
    if (url && !watchedImages.includes(url)) {
      setValue("images", [...watchedImages, url]);
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setValue(
      "images",
      watchedImages.filter((_, i) => i !== index)
    );
  };

  const handleImageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddImage();
    }
  };

  // --- Submit handler ---
  const handleFormSubmit = async (data: ProductInput) => {
    // Clean up empty optional string fields before sending to API
    const cleanData = { ...data };
    if (!cleanData.description) delete cleanData.description;
    if (!cleanData.subcategory) delete cleanData.subcategory;
    if (!cleanData.brand) delete cleanData.brand;
    if (!cleanData.sku) delete cleanData.sku;
    if (!cleanData.barcode) delete cleanData.barcode;
    if (!cleanData.unit) delete cleanData.unit;
    if (
      cleanData.originalPrice === undefined ||
      cleanData.originalPrice === null ||
      isNaN(cleanData.originalPrice)
    ) {
      delete cleanData.originalPrice;
    }

    await onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* ===== Basic Information ===== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Basic Information
        </h3>

        <div>
          <label className="block text-sm font-medium mb-2">
            Product Name <span className="text-destructive">*</span>
          </label>
          <Input
            {...register("name")}
            placeholder="e.g., iPhone 15 Pro Max 256GB"
            error={errors.name?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            {...register("description")}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            placeholder="Describe your product — condition, features, what's included..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Listing Type <span className="text-destructive">*</span>
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  options={PRODUCT_TYPE_OPTIONS}
                  error={errors.type?.message}
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <Input
              {...register("brand")}
              placeholder="e.g., Apple, Samsung, Nike"
            />
          </div>
        </div>
      </div>

      {/* ===== Category ===== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Category
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Category <span className="text-destructive">*</span>
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  options={CATEGORY_OPTIONS.map((c) => ({
                    value: c,
                    label: c,
                  }))}
                  placeholder="Select category"
                  error={errors.category?.message}
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Subcategory
            </label>
            <Input
              {...register("subcategory")}
              placeholder="e.g., Smartphones, Running Shoes"
            />
          </div>
        </div>
      </div>

      {/* ===== Pricing & Stock ===== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Pricing & Stock
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Price (₦) <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register("price", { valueAsNumber: true })}
              placeholder="0.00"
              error={errors.price?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Original Price (₦)
              <span className="text-xs text-muted-foreground ml-1">
                (for discounts)
              </span>
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register("originalPrice", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <Input
              type="number"
              min="0"
              {...register("quantity", { valueAsNumber: true })}
              placeholder="0"
              error={errors.quantity?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Unit</label>
            <Input
              {...register("unit")}
              placeholder="e.g., piece, kg, pack, dozen"
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("inStock")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              <span className="ml-3 text-sm font-medium">
                {watchedInStock ? "In Stock" : "Out of Stock"}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* ===== Product Identification ===== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Product Identification
          <span className="text-sm font-normal text-muted-foreground ml-2">
            (Optional — helps match with catalog for price comparison)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">SKU</label>
            <Input {...register("sku")} placeholder="Stock Keeping Unit" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Barcode</label>
            <Input {...register("barcode")} placeholder="UPC / EAN barcode" />
          </div>
        </div>
      </div>

      {/* ===== Tags ===== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Tags
          <span className="text-sm font-normal text-muted-foreground ml-2">
            (Help customers find your product)
          </span>
        </h3>

        <div>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type a tag and press Enter"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
            >
              Add
            </Button>
          </div>

          {watchedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {watchedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-primary/60 hover:text-primary"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== Images ===== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Images
        </h3>

        <div className="border-2 border-dashed border-border rounded-lg p-6">
          <div className="flex gap-2">
            <Input
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onKeyDown={handleImageKeyDown}
              placeholder="Paste image URL and press Enter"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddImage}
              disabled={!imageUrlInput.trim()}
            >
              Add
            </Button>
          </div>

          {watchedImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {watchedImages.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Product ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/96?text=Error";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {watchedImages.length === 0 && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              No images added yet. Paste image URLs above.
            </p>
          )}
        </div>
      </div>

      {/* ===== Submit ===== */}
      <div className="pt-4 border-t border-border">
        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          {initialData?.id ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}