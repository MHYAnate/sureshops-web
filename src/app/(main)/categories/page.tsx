import { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Categories",
};

export default function CategoriesPage() {
  return (
    <div className="container-premium py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Categories</h1>
        <p className="text-muted-foreground mt-1">
          Browse products by category
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((category) => (
          <Link key={category.slug} href={`/categories/${category.slug}`}>
            <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer group">
              <span className="text-4xl mb-4 block">{category.icon}</span>
              <h3 className="font-medium group-hover:text-primary transition-colors">
                {category.name}
              </h3>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}