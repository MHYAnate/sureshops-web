// src/app/(main)/categories/[category]/page.tsx
"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BackButton, Pagination, LoadingState } from "@/components/common";
import { ProductGrid } from "@/components/products";
import { SearchFilters } from "@/components/search";
import { searchService } from "@/services";
import { CATEGORIES } from "@/lib/constants";

// ✅ FIX: params is a Promise in Next.js 15
interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // ✅ FIX: Unwrap the promise with React.use()
  const { category: categorySlug } = use(params);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<any>({});

  // ✅ FIX: Match by slug (which now equals the category name)
  const category = CATEGORIES.find(
    (c) =>
      c.slug === categorySlug ||
      c.slug === decodeURIComponent(categorySlug) ||
      c.name.toLowerCase() === decodeURIComponent(categorySlug).toLowerCase()
  );
  const categoryName = category?.name || decodeURIComponent(categorySlug);

  const { data, isLoading } = useQuery({
    queryKey: ["category-products", categorySlug, page, filters],
    queryFn: () =>
      searchService.searchProducts({
        query: "",
        category: categoryName,
        page,
        limit: 20,
        ...filters,
      }),
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className="container-premium py-6">
      <BackButton className="mb-6" />

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {category && <span className="text-4xl">{category.icon}</span>}
          <h1 className="text-3xl font-bold">{categoryName}</h1>
        </div>
        {data?.total !== undefined && (
          <p className="text-muted-foreground">
            {data.total} products found
          </p>
        )}
      </div>

      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={() => {
          setFilters({});
          setPage(1);
        }}
        className="mb-6"
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <ProductGrid products={data?.items || []} />
          {data && data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
              className="mt-8"
            />
          )}
        </>
      )}
    </div>
  );
}