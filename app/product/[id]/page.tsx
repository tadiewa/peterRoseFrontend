"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, ShoppingCart, ArrowLeft, Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { getProductById, getProducts } from "@/lib/api";
import type { ProductResponseDTO } from "@/lib/types";
import Link from "next/link";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(price);
};

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<ProductResponseDTO | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductResponseDTO[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        setProduct(productData);

        const allProducts = await getProducts();
        const related = allProducts
          .filter(p => p.category.id === productData.category.id && p.id !== productData.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Failed to load product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock <= 0) {
      toast.error("Out of stock");
      return;
    }
    
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }
    
    addItem(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <h1 className="text-2xl font-serif font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">This product may no longer be available.</p>
            <Link href="/shop">
              <Button className="rounded-full">Back to Shop</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 md:mb-8 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-16 md:mb-24">
            {/* Image */}
            <div className="animate-fadeIn">
              <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden shadow-card">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col animate-slideInRight">
              <div className="mb-5">
                <p className="text-sm text-primary uppercase tracking-wider mb-2 font-medium">
                  {product.category.displayName}
                </p>
                <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-snug">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
                
                <p className="text-3xl font-bold text-foreground mb-1">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="border-t border-border/60 pt-5 mb-6">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-sm text-green-600 font-medium">
                      In stock ({product.stock} available)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
                    <p className="text-sm text-destructive font-medium">
                      Out of stock
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 hover:bg-accent transition-colors disabled:opacity-50"
                    disabled={product.stock <= 0}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-5 py-2.5 font-medium text-sm tabular-nums min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2.5 hover:bg-accent transition-colors disabled:opacity-50"
                    disabled={product.stock <= 0}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  size="lg"
                  className="flex-1 rounded-full shadow-lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="animate-fadeInUp">
              <div className="text-center mb-8 md:mb-10">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-1">
                  Related Products
                </h2>
                <div className="section-ornament my-3">
                  <span className="section-ornament-icon">❀</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}