"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { getProducts, getCategories } from "@/lib/api";
import type { ProductResponseDTO, CategoryResponseDTO } from "@/lib/types";

type SortOption = "featured" | "price-asc" | "price-desc" | "name" | "rating";

function ProductSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-border/40">
      <div className="aspect-square skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 skeleton-shimmer rounded" />
        <div className="h-4 w-full skeleton-shimmer rounded" />
        <div className="flex justify-between items-center">
          <div className="h-5 w-16 skeleton-shimmer rounded" />
          <div className="h-8 w-16 skeleton-shimmer rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categoryOptions = [
    { value: "all", label: "All Products" },
    ...categories.map((c) => ({ 
      value: c.name, 
      label: c.displayName 
    })),
  ];

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter((p) => {
        if (!p.category) return false;
        const catName = typeof p.category === "string" ? p.category : p.category.name;
        const catId = typeof p.category === "string" ? p.category : p.category.id;
        return catName === selectedCategory || catId === selectedCategory;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif font-bold text-foreground mb-3">Category</h3>
        <div className="flex flex-col gap-1.5">
          {categoryOptions.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                selectedCategory === cat.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-serif font-bold text-foreground mb-3">Sort By</h3>
        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as SortOption)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <section className="bg-secondary/50 py-10 md:py-14 lg:py-18">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="h-8 w-48 skeleton-shimmer rounded mx-auto mb-3" />
              <div className="h-4 w-72 skeleton-shimmer rounded mx-auto" />
            </div>
          </section>
          <section className="py-8 md:py-10">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-secondary/50 py-10 md:py-14 lg:py-18 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="max-w-7xl mx-auto px-4 text-center relative">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 md:mb-3 animate-fadeInUp">
              Our Collection
            </h1>
            <div className="section-ornament my-3 md:my-4">
              <span className="section-ornament-icon">❀</span>
            </div>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto animate-fadeInUp delay-200">
              Explore our hand-crafted flower arrangements for every occasion
            </p>
          </div>
        </section>

        <section className="py-6 md:py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4">
            {/* Top bar: search + filters */}
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search flowers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    type="button"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="md:hidden h-10 bg-transparent rounded-full"
                  >
                    <Filter className="h-4 w-4 mr-1.5" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[280px] bg-background text-foreground"
                >
                  <SheetHeader>
                    <SheetTitle className="font-serif">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop filters */}
              <div className="hidden md:flex gap-3">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-40 h-10 rounded-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as SortOption)}
                >
                  <SelectTrigger className="w-44 h-10 rounded-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category pills - scrollable on mobile */}
            <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {categoryOptions.map((cat) => (
                <Button
                  key={cat.value}
                  variant={
                    selectedCategory === cat.value ? "default" : "outline"
                  }
                  size="sm"
                  className={`rounded-full shrink-0 text-xs sm:text-sm transition-all duration-200 ${
                    selectedCategory === cat.value ? "shadow-sm" : "bg-transparent"
                  }`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Results count */}
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 md:mb-6">
              Showing {filtered.length} product
              {filtered.length !== 1 ? "s" : ""}
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-16 md:py-20">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <p className="font-serif text-lg md:text-xl text-foreground mb-2">
                  No products found
                </p>
                <p className="text-muted-foreground text-sm mb-5">
                  Try adjusting your search or filters
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="rounded-full"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {filtered.map((product, i) => (
                  <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${Math.min(i, 7) * 60}ms` }}>
                    <ProductCard product={product} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
