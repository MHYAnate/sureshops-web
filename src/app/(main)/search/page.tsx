// src/app/(main)/search/page.tsx
"use client";

import { Suspense } from "react";
import { LoadingState } from "@/components/common";
import { SearchPageContent } from "./search-content";

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingState text="Loading search..." />}>
      <SearchPageContent />
    </Suspense>
  );
}