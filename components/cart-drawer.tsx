"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background text-foreground p-0">
        <SheetHeader className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 font-serif text-foreground text-base sm:text-lg">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-4">
            <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/30" />
            <div>
              <p className="font-serif text-base sm:text-lg text-foreground">
                Your cart is empty
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Add some beautiful flowers to your cart
              </p>
            </div>
            <Button
              asChild
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto px-4 py-3 sm:px-5 sm:py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50"
                >
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-md overflow-hidden shrink-0">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-bold text-xs sm:text-sm truncate text-foreground">
                      {item.product.name}
                    </h4>
                    <p className="text-primary font-bold text-xs sm:text-sm">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border border-border flex items-center justify-center hover:bg-accent text-foreground"
                        type="button"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </button>
                      <span className="text-xs sm:text-sm font-medium w-5 sm:w-6 text-center text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border border-border flex items-center justify-center hover:bg-accent text-foreground"
                        type="button"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto text-muted-foreground hover:text-destructive"
                        type="button"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-4 py-3 sm:px-5 sm:py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold text-foreground">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Delivery fee calculated at checkout
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  size="lg"
                  onClick={() => onOpenChange(false)}
                  className="rounded-full h-10 sm:h-11"
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onOpenChange(false)}
                  asChild
                  className="rounded-full h-10 sm:h-11 bg-transparent"
                >
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
