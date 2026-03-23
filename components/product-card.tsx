"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Eye } from "lucide-react";
import type { ProductResponseDTO } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(price);
};

interface ProductCardProps {
  product: ProductResponseDTO;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("This product is currently out of stock");
      return;
    }
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div
      className="group relative bg-card rounded-xl overflow-hidden border border-border/60 shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-1"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link
        href={`/product/${product.id}`}
        className="block relative aspect-square overflow-hidden"
      >
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
            Only {product.stock} left
          </span>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-background text-foreground text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
        {/* Quick view overlay - desktop/tablet only */}
        <div className="hidden sm:flex absolute inset-0 bg-foreground/0 group-hover:bg-foreground/15 transition-all duration-400 items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Button size="sm" variant="secondary" className="rounded-full text-xs shadow-md backdrop-blur-sm">
            <Eye className="h-3.5 w-3.5 mr-1" />
            Quick View
          </Button>
        </div>
      </Link>
      <div className="p-3.5 sm:p-4">
        <div className="flex items-center gap-0.5 mb-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={`star-${product.id}-${i}`}
              className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                i < Math.floor(product.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
          <span className="text-[10px] sm:text-xs text-muted-foreground ml-1.5">
            ({product.reviewCount})
          </span>
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-sm sm:text-base font-bold text-card-foreground hover:text-primary transition-colors line-clamp-1 mb-0.5">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2.5 sm:mt-3">
          <span className="text-base sm:text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="rounded-full h-8 sm:h-9 text-xs sm:text-sm px-3 sm:px-3.5 shadow-sm"
          >
            <ShoppingBag className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
