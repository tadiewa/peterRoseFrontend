"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/api";
import type { CategoryResponseDTO } from "@/lib/types";

export function CategorySection() {
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const data = await getCategories();
        const activeCategories = data.filter((cat) => cat.active);
        setCategories(activeCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-20 lg:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="h-3 w-16 skeleton-shimmer rounded mx-auto mb-3" />
            <div className="h-8 w-56 skeleton-shimmer rounded mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] skeleton-shimmer rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-12 md:py-20 lg:py-28 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-14 animate-fadeInUp">
          <p className="text-primary uppercase tracking-[0.25em] text-xs md:text-sm font-sans mb-2 font-medium">
            Explore
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1">
            Shop by Category
          </h2>
          <div className="section-ornament my-4">
            <span className="section-ornament-icon">❀</span>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base leading-relaxed">
            Find the perfect arrangement for every occasion
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {categories.slice(0, 4).map((cat, i) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className="group relative aspect-[3/4] md:aspect-[3/4] rounded-xl overflow-hidden animate-fadeInUp shadow-card hover:shadow-card-hover transition-all duration-500"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <Image
                src={cat.imageUrl || "/placeholder.svg"}
                alt={cat.displayName}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/25 to-transparent group-hover:from-foreground/80 transition-all duration-500" />
              {/* Glassmorphism label */}
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-6">
                <div className="backdrop-blur-md bg-white/10 rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-white/15 transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/25">
                  <h3 className="font-serif text-base sm:text-lg lg:text-xl font-bold text-background">
                    {cat.displayName}
                  </h3>
                  <p className="text-background/60 text-xs sm:text-sm mt-0.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    Shop now <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

