"use client";

import { useEffect, useState, useRef } from "react"; // ✅ Add useRef
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCart } from "@/lib/cart-context";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const orderId = searchParams.get("orderId");
  const checkoutId = searchParams.get("checkoutId");
  
  // ✅ Prevent multiple calls
  const hasVerified = useRef(false);

  useEffect(() => {
    // ✅ Only run once
    if (hasVerified.current) {
      return;
    }
    hasVerified.current = true;

    async function handlePaymentSuccess() {
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Processing payment for order:", orderId);

        // Check if payment already exists
        const checkResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payments/order/${orderId}`
        );

        if (checkResponse.ok) {
          console.log("✅ Payment already verified");
          clearCart();
          setLoading(false);
          return;
        }

        console.log("Payment doesn't exist yet, creating...");

        // Create payment
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              yocoPaymentId: checkoutId || `yoco_${Date.now()}`,
              orderId: orderId,
              amount: 0,
            }),
          }
        );

        if (response.ok || response.status === 409) {
          console.log("✅ Payment saved successfully");
          clearCart();
          setLoading(false);
        } else {
          const errorText = await response.text();
          console.error("❌ Error:", errorText);
          
          let errorData: any = {};
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { message: errorText || "Payment verification failed" };
          }
          
          setError(errorData.message || "Payment verification failed");
          setLoading(false);
        }
      } catch (err: any) {
        console.error("❌ Error:", err);
        setError(err.message || "Failed to verify payment");
        setLoading(false);
      }
    }

    handlePaymentSuccess();
  }, []); // ✅ Empty deps - only run on mount

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Confirming your payment...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Verification Failed
            </h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="space-y-3">
              <Button onClick={() => router.push("/")}>Go Home</Button>
              <p className="text-xs text-muted-foreground">
                Your payment was successful. Please contact support with Order ID: {orderId}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-md w-full px-4">
          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Payment Successful!
            </h1>
            
            <p className="text-muted-foreground mb-8">
              Your order has been confirmed and payment received.
            </p>

            <div className="bg-secondary rounded-lg p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="font-bold text-lg text-foreground mb-4">{orderId}</p>
              
              <p className="text-xs text-muted-foreground">
                A confirmation email will be sent to your email address.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push(`/track-order?id=${orderId}`)}
                size="lg"
                className="w-full rounded-full"
              >
                Track Order
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