"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Select, Badge } from "@/components/ui";
import { ImageUpload } from "@/components/common/image-upload";
import { CATEGORIES } from "@/lib/constants";
import { X } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(1, "Price is required"),
  originalPrice: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  quantity: z.number().min(0),   // ✅ Removed .default(0) — required field
  inStock: z.boolean(),          // ✅ Removed .default(true) — required field
});

type ProductInput = z.infer<typeof productSchema>;
//   Now: { quantity: number; inStock: boolean; ... }
//   Matches both useForm AND zodResolver

interface ProductFormProps {
  initialData?: Partial<ProductInput> & { images?: string[]; tags?: string[] };
  onSubmit: (data: ProductInput & { images: string[]; tags: string[] }) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),   // ✅ No more type error
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      originalPrice: initialData?.originalPrice,
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      brand: initialData?.brand || "",
      quantity: initialData?.quantity ?? 0,     // ✅ Default provided here
      inStock: initialData?.inStock ?? true,    // ✅ Default provided here
    },
  });

  const handleFormSubmit = async (data: ProductInput) => {  // ✅ No more type error
    await onSubmit({ ...data, images, tags });
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleImagesChange = (urls: string[]) => {
    setImages(urls);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Images */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Images</label>
        <ImageUpload
          images={images}
          onChange={handleImagesChange}
          maxImages={5}
        />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Product Name *</label>
          <Input
            {...register("name")}
            error={errors.name?.message}
            placeholder="e.g., iPhone 15 Pro Max 256GB"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            {...register("description")}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
            placeholder="Describe your product..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <Select
            value={watch("category")}
            onChange={(value) => setValue("category", value)}
            options={CATEGORIES.map((c) => ({ value: c.name, label: c.name }))}
            error={errors.category?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Brand</label>
          <Input {...register("brand")} placeholder="e.g., Apple, Samsung" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price (₦) *</label>
          <Input
            type="number"
            {...register("price", { valueAsNumber: true })}
            error={errors.price?.message}
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Original Price (₦)
          </label>
          <Input
            type="number"
            {...register("originalPrice", { valueAsNumber: true })}
            placeholder="For discounts"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <Input
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            {...register("inStock")}
            id="inStock"
            className="rounded border-input"
          />
          <label htmlFor="inStock" className="text-sm">
            In Stock
          </label>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        {initialData ? "Update Product" : "Add Product"}
      </Button>
    </form>
  );
}