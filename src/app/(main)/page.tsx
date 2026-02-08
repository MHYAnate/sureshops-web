import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Store, TrendingUp, Shield } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { SearchBar } from "@/components/search";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "SureShops - Find Products, Compare Prices",
};

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background pt-12 pb-20">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Find Products.{" "}
              <span className="text-muted-foreground">Compare Prices.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover products from thousands of local shops across Nigeria.
              Compare prices, find the best deals, and support local businesses.
            </p>

            {/* Search Bar */}
            <div className="mt-10 max-w-2xl mx-auto">
              <SearchBar variant="hero" />
            </div>

            {/* Quick Links */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["iPhone", "Laptop", "Shoes", "Electronics", "Fashion"].map(
                (term) => (
                  <Link
                    key={term}
                    href={`/search?query=${term}`}
                    className="px-4 py-2 rounded-full bg-muted text-sm hover:bg-muted/80 transition-colors"
                  >
                    {term}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container-premium">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Compare Prices</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                See prices from multiple vendors and find the best deal instantly
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Find Nearby Shops</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Discover shops in your area with exact locations and directions
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Verified Vendors</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Shop with confidence from verified and trusted local businesses
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-premium">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Browse Categories</h2>
              <p className="text-muted-foreground mt-1">
                Explore products by category
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/categories">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.slice(0, 10).map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <Card className="p-6 text-center hover:shadow-lg transition-all">
                  <span className="text-3xl mb-3 block">{category.icon}</span>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-premium">
          <Card className="bg-foreground text-background p-12 text-center">
            <Store className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl font-bold">Are you a vendor?</h2>
            <p className="mt-4 text-background/80 max-w-xl mx-auto">
              Join thousands of vendors on SureShops. List your products, reach
              more customers, and grow your business.
            </p>
            <Button
              size="lg"
              className="mt-8 bg-background text-foreground hover:bg-background/90"
              asChild
            >
              <Link href="/vendor">
                Start Selling
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}