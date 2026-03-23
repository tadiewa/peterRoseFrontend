"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Mobile: stacked layout */}
      <div className="md:hidden relative">
        <div className="relative aspect-[4/5]">
          <Image
            src="/images/hero-flowers.jpg"
            alt="Beautiful flower arrangements"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/10" />
        </div>
        <div className="absolute inset-0 flex items-end pb-14 px-6">
          <div className="text-center w-full">
            <p className="animate-fadeIn text-background/70 uppercase tracking-[0.25em] text-[11px] font-sans mb-3">
              Premium Flower Delivery
            </p>
            <h1 className="animate-fadeInUp font-serif text-4xl font-bold text-background leading-[1.1] mb-4 text-balance">
              Creating Memories
            </h1>
            <p className="animate-fadeInUp delay-200 text-background/75 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
              Hand-crafted bouquets delivered with love across South Africa.
            </p>
            <div className="animate-fadeInUp delay-400 flex flex-col gap-2.5 max-w-xs mx-auto">
              <Button asChild size="lg" className="rounded-full text-sm shadow-lg">
                <Link href="/shop">
                  Shop Now <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full text-sm border-background/40 text-background hover:bg-background hover:text-foreground bg-transparent backdrop-blur-sm"
              >
                <Link href="/track-order">Track Your Order</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet + Desktop: split layout */}
      <div className="hidden md:flex min-h-[60vh] lg:min-h-[75vh] xl:min-h-[80vh]">
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16 xl:px-20 py-16 lg:py-20 relative">
          {/* Decorative background accent */}
          <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-accent/40 rounded-full blur-3xl" />
          
          <div className="max-w-lg relative">
            <p className="animate-fadeIn text-primary uppercase tracking-[0.3em] text-xs lg:text-sm font-sans mb-4 lg:mb-5 font-medium">
              Premium Flower Delivery
            </p>
            <h1 className="animate-fadeInUp font-serif text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-[1.08] mb-5 lg:mb-7 text-balance">
              Creating
              <br />
              <span className="text-gradient-rose">Memories</span>
            </h1>
            <div className="animate-fadeInUp delay-100 section-ornament mb-5 lg:mb-7 justify-start">
              <span className="section-ornament-icon">❀</span>
            </div>
            <p className="animate-fadeInUp delay-200 text-muted-foreground text-base lg:text-lg max-w-md mb-7 lg:mb-9 leading-relaxed">
              The language of the heart, spoken in moments that last a lifetime.
              Hand-crafted bouquets delivered with love.
            </p>
            <div className="animate-fadeInUp delay-300 flex flex-row gap-3">
              <Button asChild size="lg" className="rounded-full px-8 text-sm shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/shop">
                  Shop Now <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-sm bg-transparent"
              >
                <Link href="/track-order">Track Order</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 relative">
          <Image
            src="/images/hero-flowers.jpg"
            alt="Beautiful flower arrangements"
            fill
            className="object-cover"
            priority
          />
          {/* Soft edge blend */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}
