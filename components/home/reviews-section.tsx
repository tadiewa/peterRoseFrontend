"use client";

import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const SAMPLE_REVIEWS = [
  {
    id: "1",
    userName: "Sarah M.",
    rating: 5,
    comment: "Absolutely stunning! The roses were fresh and the arrangement was beautiful. Delivery was prompt too.",
    date: "March 15, 2024",
  },
  {
    id: "2",
    userName: "John D.",
    rating: 5,
    comment: "Ordered flowers for my wife's birthday and she loved them! Will definitely order again.",
    date: "March 12, 2024",
  },
  {
    id: "3",
    userName: "Emily R.",
    rating: 5,
    comment: "Professional service and gorgeous flowers. The bouquet lasted over a week!",
    date: "March 10, 2024",
  },
  {
    id: "4",
    userName: "Michael P.",
    rating: 5,
    comment: "Beautiful arrangements and excellent customer service. Highly recommend Peter Rose!",
    date: "March 8, 2024",
  },
];

export function ReviewsSection() {
  const [reviews] = useState(SAMPLE_REVIEWS);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const next = () => {
    setDirection("right");
    setCurrent((prev) => (prev + 1) % reviews.length);
  };
  const prev = () => {
    setDirection("left");
    setCurrent((p) => (p - 1 + reviews.length) % reviews.length);
  };

  if (reviews.length === 0) return null;
  const review = reviews[current];

  return (
    <section className="py-12 md:py-20 lg:py-28 bg-secondary/50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 text-center relative">
        <p className="text-primary uppercase tracking-[0.25em] text-xs md:text-sm font-sans mb-2 font-medium animate-fadeIn">
          Testimonials
        </p>
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 animate-fadeInUp">
          What Our Customers Say
        </h2>
        <div className="section-ornament my-5 md:my-7">
          <span className="section-ornament-icon">❀</span>
        </div>

        <div className="relative px-2">
          {/* Decorative quote icon */}
          <Quote className="h-8 w-8 md:h-10 md:w-10 text-primary/15 mx-auto mb-4 md:mb-5" />

          {/* Review card */}
          <div
            key={review.id}
            className="animate-fadeIn"
          >
            <div className="flex items-center gap-0.5 justify-center mb-4 md:mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={`review-star-${i}`}
                  className={`h-4 w-4 md:h-5 md:w-5 ${
                    i < review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <blockquote className="text-base md:text-lg lg:text-xl text-foreground leading-relaxed mb-5 md:mb-7 italic font-serif">
              &ldquo;{review.comment}&rdquo;
            </blockquote>
            
            {/* Reviewer info */}
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold text-sm">
                {review.userName.charAt(0)}
              </div>
              <div className="text-left">
                <p className="font-sans font-bold text-foreground text-sm md:text-base">
                  {review.userName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {review.date}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-7 md:mt-9">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full h-9 w-9 md:h-10 md:w-10 bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1.5">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current 
                      ? "w-6 h-2 bg-primary" 
                      : "w-2 h-2 bg-primary/25 hover:bg-primary/40"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full h-9 w-9 md:h-10 md:w-10 bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
              aria-label="Next review"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
