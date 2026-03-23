"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function CheckoutCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-md w-full px-4">
          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Payment Cancelled
            </h1>
            
            <p className="text-muted-foreground mb-8">
              Your payment was cancelled. No charges have been made.
            </p>

            {orderId && (
              <div className="bg-secondary rounded-lg p-6 mb-8">
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="font-bold text-lg text-foreground mb-4">{orderId}</p>
                
                <p className="text-xs text-muted-foreground">
                  Your order is still pending. You can try payment again.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => router.push("/checkout")}
                size="lg"
                className="w-full rounded-full"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/shop")}
                size="lg"
                className="w-full rounded-full"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
