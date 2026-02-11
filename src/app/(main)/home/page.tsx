// src/app/(main)/home/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Store,
  TrendingUp,
  Shield,
  Search,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import { HomeSearch } from "@/components/search/home-search";
import { HeroCarousel } from "@/components/hero-carousel";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "SureShops - Find Products, Compare Prices",
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-12 pb-20 min-h-[600px] flex items-center justify-center overflow-hidden">
        <HeroCarousel />
        <div className="container-premium relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Find Products.{" "}
              <span className="text-muted-foreground">And Shops.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
               The Sure Way to Shop.
            </p>

            <div className="mt-10 max-w-2xl mx-auto">
              <HomeSearch />
            </div>

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

      {/* How it works */}
      <section className="py-16">
        <div className="container-premium">
          <h2 className="text-2xl font-bold text-center mb-10">
            How SureShops Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                icon: <MapPin className="h-6 w-6" />,
                title: "Select Your Market",
                desc: "Choose your state, area, and the specific market you are visiting or near",
              },
              {
                step: "2",
                icon: <Search className="h-6 w-6" />,
                title: "Search a Product",
                desc: "Type the product you are looking for — phones, shoes, laptops, anything",
              },
              {
                step: "3",
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Compare Prices",
                desc: "See all shops that carry that product with their prices side by side",
              },
              {
                step: "4",
                icon: <Store className="h-6 w-6" />,
                title: "Visit the Shop",
                desc: "Get the exact shop number, floor, block, and call the vendor directly",
              },
            ].map((item) => (
              <Card key={item.step} className="p-6 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 mt-2">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container-premium">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Compare Prices</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                See prices from multiple vendors in the same market instantly
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Find Exact Shop</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Get shop numbers, floor, block, and landmark directions
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Verified Vendors</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Shop with confidence from verified local businesses
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
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

      {/* CTA */}
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
