"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Select } from "@/components/ui";
import { ImageUpload } from "@/components/common/image-upload";
import { X } from "lucide-react";

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

  // --- Image handlers ---
  const handleImagesChange = (newImages: string[]) => {
    setValue("images", newImages, { shouldValidate: true });
  };

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

  // --- Submit handler ---
  const handleFormSubmit = async (data: ProductInput) => {
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
      {/* ===== Product Images ===== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Product Images
        </h3>
        <ImageUpload
          images={watchedImages}
          onChange={handleImagesChange}
          maxImages={5}
        />
      </div>

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
            (Optional — helps match for price comparison)
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