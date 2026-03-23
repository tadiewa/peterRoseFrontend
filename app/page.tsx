"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategorySection } from "@/components/home/category-section";
import { AboutSection } from "@/components/home/about-section";
import { FeaturesBar } from "@/components/home/features-bar";
import { ReviewsSection } from "@/components/home/reviews-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />
        <CategorySection />
        <AboutSection />
        <FeaturesBar />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  );
}
