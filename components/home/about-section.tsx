"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-12 md:py-20 lg:py-28 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image with decorative frame */}
          <div className="relative order-1 md:order-none animate-slideInLeft">
            <div className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden shadow-card">
              <Image
                src="/images/about-florist.jpg"
                alt="Our florist at work"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 md:w-40 md:h-40 border-2 border-primary/20 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 md:w-32 md:h-32 bg-accent/40 rounded-full blur-2xl -z-10" />
          </div>

          {/* Content */}
          <div className="order-2 md:order-none text-center md:text-left animate-slideInRight">
            <p className="text-primary uppercase tracking-[0.25em] text-xs md:text-sm font-sans mb-3 font-medium">
              Our Story
            </p>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 text-balance leading-snug">
              The language of the heart, spoken in moments that last a lifetime.
            </h2>
            <div className="section-ornament my-5 md:justify-start">
              <span className="section-ornament-icon">❀</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4 md:mb-5 text-sm md:text-base">
              At Peter Rose, we believe every flower tells a story. Our expert
              florists hand-select the freshest blooms daily to create
              arrangements that capture emotions words cannot express.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-7 md:mb-9 text-sm md:text-base">
              From romantic gestures to celebrations, sympathy to simple joys —
              we craft each bouquet with the same love and attention to detail
              that makes your moments truly special. With same-day delivery
              across South Africa, your perfect arrangement is just a click
              away.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 shadow-lg">
              <Link href="/shop">
                Shop Now <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
