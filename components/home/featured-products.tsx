"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/api";
import type { ProductResponseDTO } from "@/lib/types";

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

export function FeaturedProducts() {
  const [featured, setFeatured] = useState<ProductResponseDTO[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const products = await getProducts();
        const featuredProducts = products.filter((p) => p.featured);
        const bestSellerProducts = products.filter((p) => p.bestSeller);
        setFeatured(featuredProducts);
        setBestSellers(bestSellerProducts);
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <div className="h-3 w-20 skeleton-shimmer rounded mx-auto mb-3" />
            <div className="h-8 w-48 skeleton-shimmer rounded mx-auto mb-3" />
            <div className="h-4 w-72 skeleton-shimmer rounded mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featured.length === 0 && bestSellers.length === 0) return null;

  return (
    <section className="py-12 md:py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Featured Collection */}
        {featured.length > 0 && (
          <>
            <div className="text-center mb-10 md:mb-14 animate-fadeInUp">
              <p className="text-primary uppercase tracking-[0.25em] text-xs md:text-sm font-sans mb-2 font-medium">
                Featured
              </p>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1">
                Collection
              </h2>
              <div className="section-ornament my-4">
                <span className="section-ornament-icon">❀</span>
              </div>
              <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base leading-relaxed">
                Hand-picked arrangements crafted with the freshest flowers for
                every special occasion
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 md:mb-8">
              {featured.map((product, i) => (
                <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <>
            <div className="text-center mb-10 md:mb-14 mt-16 md:mt-24 animate-fadeInUp">
              <p className="text-primary uppercase tracking-[0.25em] text-xs md:text-sm font-sans mb-2 font-medium">
                Best
              </p>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1">
                Sellers
              </h2>
              <div className="section-ornament my-4">
                <span className="section-ornament-icon">❀</span>
              </div>
              <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base leading-relaxed">
                Our most loved arrangements, chosen by customers who know
                quality
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {bestSellers.map((product, i) => (
                <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>
          </>
        )}

        <div className="text-center mt-10 md:mt-14 animate-fadeInUp">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 bg-transparent"
          >
            <Link href="/shop">
              View All Products <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
