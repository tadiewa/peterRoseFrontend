"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface YocoPaymentProps {
  orderId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

export function YocoPayment({
  orderId,
  amount,
  customerEmail,
  customerName,
  onSuccess,
  onError,
}: YocoPaymentProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      console.log("Creating Yoco checkout session...");

      // ✅ Create checkout session on backend
      const checkoutSession = await createCheckoutSession(
        orderId,
        amount,
        customerEmail,
        customerName
      );

      console.log("Checkout session created:", checkoutSession);

      // ✅ Redirect to Yoco hosted checkout page
      window.location.href = checkoutSession.redirectUrl;

    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed");
      onError(error.message);
      setLoading(false);
    }
  };

  const createCheckoutSession = async (
    orderId: string,
    amount: number,
    email: string,
    name: string
  ) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-checkout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount,
          currency: "ZAR",
          customerEmail: email,
          customerName: name,
          successUrl: `${window.location.origin}/checkout/success?orderId=${orderId}`,
          cancelUrl: `${window.location.origin}/checkout/cancel?orderId=${orderId}`,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create checkout session");
    }

    return response.json();
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      size="lg"
      className="w-full rounded-full"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Redirecting to Payment...
        </>
      ) : (
        <>
          <CreditCard className="h-5 w-5 mr-2" />
          Pay with Card
        </>
      )}
    </Button>
  );
}