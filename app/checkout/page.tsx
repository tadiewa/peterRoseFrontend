"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import type { DeliveryMethod, CustomerInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingBag,
  Truck,
  MapPin,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";


import { createOrder } from "@/lib/api";
import { YocoPayment } from "@/components/payments/yoco-payment";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(price);
};

const DELIVERY_FEE = 150;

const provinces = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
];

const getAvailableDeliveryDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    // Skip Sundays
    if (date.getDay() !== 0) {
      dates.push(date);
    }
  }
  return dates;
};

const getDeliveryTimeSlots = () => [
  "09:00 - 12:00",
  "12:00 - 15:00",
  "15:00 - 18:00",
];

type CheckoutStep = "details" | "delivery" | "payment" | "confirmation";

export default function CheckoutPage() {
  const { items, subtotal, clearCart, itemCount } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState<CheckoutStep>("details");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isGuestCheckout, setIsGuestCheckout] = useState(!isAuthenticated);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    province: "",
    notes: "",
  });

  const deliveryCost = deliveryMethod === "delivery" ? (subtotal >= 1500 ? 0 : DELIVERY_FEE) : 0;
  const total = subtotal + deliveryCost;
  const deliveryDates = getAvailableDeliveryDates();
  const timeSlots = getDeliveryTimeSlots();

  const updateInfo = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const canProceedToDelivery = () => {
    return (
      customerInfo.firstName &&
      customerInfo.lastName &&
      customerInfo.email &&
      customerInfo.phone
    );
  };

  const canProceedToPayment = () => {
    if (deliveryMethod === "delivery") {
      return (
        selectedDate &&
        selectedTime &&
        customerInfo.address &&
        customerInfo.city &&
        customerInfo.province
      );
    }
    return selectedDate && selectedTime;
  };

  const handleCreateOrder = async () => {
    try {
      setLoading(true);

      // Calculate delivery cost explicitly
      const calculatedDeliveryCost = deliveryMethod === "delivery" 
        ? (subtotal >= 1500 ? 0 : DELIVERY_FEE) 
        : 0;

      // Create order DTO
      const orderDTO = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        deliveryMethod: deliveryMethod,
        deliveryDate: selectedDate,
        deliveryTime: selectedTime.split(" ")[0], // "09:00" from "09:00 - 12:00"
        deliveryCost: calculatedDeliveryCost,
        customer: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: deliveryMethod === "delivery" ? customerInfo.address : undefined,
          city: deliveryMethod === "delivery" ? customerInfo.city : undefined,
          province: customerInfo.province,
        },
      };

      console.log("Creating order:", orderDTO);

      const createdOrder = await createOrder(orderDTO);
      
      setOrderId(createdOrder.id);
      setStep("payment"); // Move to payment step
      toast.success("Order created! Please complete payment.");
    } catch (error: any) {
      console.error("Failed to create order:", error);
      toast.error(error.message || "Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    console.log("Payment succeeded:", paymentId);
    setStep("confirmation");
    clearCart();
    toast.success("Payment successful! Order confirmed.");
  };

  // ✅ Handle payment error
  const handlePaymentError = (error: string) => {
    console.error("Payment failed:", error);
    toast.error("Payment failed. Please try again.");
  };

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-6">
              Add some beautiful flowers to get started
            </p>
            <Button asChild>
              <Link href="/shop">Browse Flowers</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16 relative overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-accent/30 rounded-full blur-3xl" />
          <div className="max-w-lg mx-auto text-center px-4 relative animate-scaleIn">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-6">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-3">
              Thank You!
            </h1>
            <p className="text-muted-foreground mb-2">
              Your order has been placed successfully.
            </p>
            <div className="bg-card border border-border/50 rounded-xl p-4 my-6 shadow-card">
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="text-lg font-bold text-primary">{orderId}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              We will send a confirmation email to {customerInfo.email} with
              your order details and tracking information.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="rounded-full shadow-md">
                <Link href={`/track?id=${orderId}`}>Track Your Order</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
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
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>

          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Checkout
          </h1>
          <div className="section-ornament mb-8 justify-start">
            <span className="section-ornament-icon">❀</span>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
            {(["details", "delivery", "payment"] as CheckoutStep[]).map(
              (s, i) => {
                const stepOrder = ["details", "delivery", "payment"];
                const currentIndex = stepOrder.indexOf(step);
                const isPast = i < currentIndex;
                const isCurrent = step === s;
                return (
                  <div key={s} className="flex items-center gap-0">
                    <button
                      onClick={() => {
                        if (i === 0) setStep("details");
                        if (i === 1 && canProceedToDelivery()) setStep("delivery");
                        if (i === 2 && canProceedToPayment()) setStep("payment");
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        isCurrent
                          ? "bg-primary text-primary-foreground shadow-md scale-105"
                          : isPast
                            ? "bg-primary/15 text-primary"
                            : "bg-secondary text-secondary-foreground"
                      }`}
                      type="button"
                    >
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isPast ? "bg-primary text-primary-foreground" : ""
                      }`}>
                        {isPast ? "✓" : i + 1}
                      </span>
                      <span className="hidden sm:inline capitalize">{s}</span>
                    </button>
                    {i < 2 && (
                      <div className={`w-8 sm:w-12 h-0.5 transition-colors duration-300 ${
                        isPast ? "bg-primary/40" : "bg-border"
                      }`} />
                    )}
                  </div>
                );
              }
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Guest/Account toggle */}
              {!isAuthenticated && step === "details" && (
                <div className="bg-accent/50 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between">
                  <div>
                    <p className="font-bold text-sm text-foreground">
                      Already have an account?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sign in for a faster checkout experience
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login?redirect=/checkout">Sign In</Link>
                  </Button>
                </div>
              )}

              {/* Step 1: Customer Details */}
              {step === "details" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                      1
                    </span>
                    Your Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={customerInfo.firstName}
                        onChange={(e) => updateInfo("firstName", e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={customerInfo.lastName}
                        onChange={(e) => updateInfo("lastName", e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => updateInfo("email", e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => updateInfo("phone", e.target.value)}
                        placeholder="+27 82 123 4567"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => setStep("delivery")}
                    disabled={!canProceedToDelivery()}
                    className="rounded-full px-8"
                  >
                    Continue to Delivery
                  </Button>
                </div>
              )}

              {/* Step 2: Delivery */}
              {step === "delivery" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                      2
                    </span>
                    Delivery Method
                  </h2>

                  <RadioGroup
                    value={deliveryMethod}
                    onValueChange={(v) =>
                      setDeliveryMethod(v as DeliveryMethod)
                    }
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <label
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        deliveryMethod === "delivery"
                          ? "border-primary bg-accent/50"
                          : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="delivery" className="mt-1" />
                      <div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-primary" />
                          <span className="font-bold text-foreground">Delivery</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          R150 flat fee (Free over R1,500)
                        </p>
                      </div>
                    </label>
                    <label
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        deliveryMethod === "collection"
                          ? "border-primary bg-accent/50"
                          : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="collection" className="mt-1" />
                      <div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-bold text-foreground">Collection</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Free - Pick up from our store
                        </p>
                      </div>
                    </label>
                  </RadioGroup>

                  {/* Scheduled Date & Time */}
                  <div className="bg-accent/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm font-bold text-foreground">
                        No deliveries on Sundays
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Preferred Date *</Label>
                        <Select value={selectedDate} onValueChange={setSelectedDate}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date" />
                          </SelectTrigger>
                          <SelectContent>
                            {deliveryDates.map((date) => {
                              const dateStr = date.toISOString().split("T")[0];
                              const isToday =
                                dateStr ===
                                new Date().toISOString().split("T")[0];
                              return (
                                <SelectItem key={dateStr} value={dateStr}>
                                  {isToday ? "Today - " : ""}
                                  {date.toLocaleDateString("en-ZA", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Preferred Time *</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Delivery address or Collection point */}
                  {deliveryMethod === "delivery" ? (
                    <div className="space-y-4">
                      <h3 className="font-bold text-foreground">Delivery Address</h3>
                      <div>
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          value={customerInfo.address}
                          onChange={(e) => updateInfo("address", e.target.value)}
                          placeholder="123 Main Road"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={customerInfo.city}
                            onChange={(e) => updateInfo("city", e.target.value)}
                            placeholder="Johannesburg"
                          />
                        </div>
                        <div>
                          <Label>Province *</Label>
                          <Select
                            value={customerInfo.province}
                            onValueChange={(v) => updateInfo("province", v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.map((p) => (
                                <SelectItem key={p} value={p}>
                                  {p}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div>
                    <Label htmlFor="notes">Special Instructions (optional)</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.notes}
                      onChange={(e) => updateInfo("notes", e.target.value)}
                      placeholder="E.g., include a card message, gate code, etc."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep("details")}
                      className="rounded-full"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleCreateOrder}
                      disabled={!canProceedToPayment() || loading}
                      className="rounded-full px-8"
                    >
                      {loading ? "Creating Order..." : "Continue to Payment"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === "payment" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                      3
                    </span>
                    Payment
                  </h2>

                  <div className="bg-accent/30 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <span className="font-bold text-foreground">Secure Payment with Yoco</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pay securely with your credit or debit card. All transactions are encrypted and secure.
                    </p>

                    {/* Accepted cards */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>We accept:</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-white rounded border border-border font-bold text-foreground">Visa</span>
                        <span className="px-2 py-1 bg-white rounded border border-border font-bold text-foreground">Mastercard</span>
                      </div>
                    </div>

                    {/* Security badges */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>PCI DSS compliant</span>
                    </div>
                  </div>

                  {/* Order confirmation */}
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                    <p className="font-bold text-foreground">{orderId}</p>
                    <p className="text-sm text-muted-foreground mt-2 mb-1">Total Amount</p>
                    <p className="font-bold text-lg text-foreground">{formatPrice(total)}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep("delivery");
                        setOrderId(""); // Clear order if going back
                      }}
                      className="rounded-full"
                    >
                      Back
                    </Button>
                    
                    {/* ✅ Yoco Payment Component */}
                    <div className="flex-1">
                      <YocoPayment
                        orderId={orderId}
                        amount={total}
                        customerEmail={customerInfo.email}
                        customerName={`${customerInfo.firstName} ${customerInfo.lastName}`}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-xl border border-border/50 p-6 space-y-4 shadow-card gradient-border-top">
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Order Summary
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3"
                    >
                      <div className="relative h-12 w-12 rounded overflow-hidden shrink-0">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground">
                      {deliveryMethod === "collection"
                        ? "Free (Collection)"
                        : subtotal >= 1500
                          ? "Free"
                          : formatPrice(DELIVERY_FEE)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {subtotal < 1500 && deliveryMethod === "delivery" && (
                  <p className="text-xs text-primary">
                    Add {formatPrice(1500 - subtotal)} more for free delivery!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
