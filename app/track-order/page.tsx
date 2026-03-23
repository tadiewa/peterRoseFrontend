// "use client";

// import React from "react"

// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { Navbar } from "@/components/navbar";
// import { Footer } from "@/components/footer";
// import { sampleOrders, formatPrice } from "@/lib/data";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Package,
//   Search,
//   CheckCircle2,
//   Clock,
//   Truck,
//   MapPin,
//   ChefHat,
// } from "lucide-react";
// import type { Order } from "@/lib/types";

// const statusIcons: Record<string, React.ReactNode> = {
//   "Order Placed": <Clock className="h-5 w-5" />,
//   "Order Confirmed": <CheckCircle2 className="h-5 w-5" />,
//   "Being Prepared": <ChefHat className="h-5 w-5" />,
//   "Out for Delivery": <Truck className="h-5 w-5" />,
//   Delivered: <MapPin className="h-5 w-5" />,
//   "Ready for Collection": <Package className="h-5 w-5" />,
// };

// export default function TrackOrderPage() {
//   const searchParams = useSearchParams();
//   const initialId = searchParams.get("id") || "";
//   const [orderId, setOrderId] = useState(initialId);
//   const [order, setOrder] = useState<Order | null>(
//     initialId ? sampleOrders.find((o) => o.id === initialId) || null : null
//   );
//   const [searched, setSearched] = useState(!!initialId);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     // TODO: Replace with Spring Boot API call: GET /api/orders/{orderId}
//     const found = sampleOrders.find((o) => o.id === orderId);
//     setOrder(found || null);
//     setSearched(true);
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-1">
//         <section className="bg-secondary py-12 lg:py-16">
//           <div className="max-w-2xl mx-auto px-4 text-center">
//             <Package className="h-12 w-12 text-primary mx-auto mb-4" />
//             <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
//               Track Your Order
//             </h1>
//             <p className="text-muted-foreground mb-8">
//               Enter your order ID to see real-time updates on your delivery
//             </p>

//             <form
//               onSubmit={handleSearch}
//               className="flex gap-3 max-w-md mx-auto"
//             >
//               <Input
//                 value={orderId}
//                 onChange={(e) => setOrderId(e.target.value)}
//                 placeholder="e.g. ORD-2026-001"
//                 className="flex-1"
//               />
//               <Button type="submit" className="rounded-full px-6">
//                 <Search className="h-4 w-4 mr-2" />
//                 Track
//               </Button>
//             </form>
//           </div>
//         </section>

//         <section className="py-12">
//           <div className="max-w-3xl mx-auto px-4">
//             {searched && !order && (
//               <div className="text-center py-12">
//                 <p className="font-serif text-xl text-foreground mb-2">
//                   Order not found
//                 </p>
//                 <p className="text-muted-foreground">
//                   Please check your order ID and try again. For the demo, try:
//                   ORD-2026-001
//                 </p>
//               </div>
//             )}

//             {order && (
//               <div className="space-y-8">
//                 {/* Order header */}
//                 <div className="bg-secondary rounded-lg p-6">
//                   <div className="flex flex-col sm:flex-row justify-between gap-4">
//                     <div>
//                       <p className="text-sm text-muted-foreground">Order ID</p>
//                       <p className="font-bold text-lg text-foreground">
//                         {order.id}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">Status</p>
//                       <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium capitalize">
//                         {order.status.replace(/-/g, " ")}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">Total</p>
//                       <p className="font-bold text-lg text-primary">
//                         {formatPrice(order.total)}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">
//                         {order.deliveryMethod === "delivery"
//                           ? "Delivery"
//                           : "Collection"}
//                       </p>
//                       <p className="font-bold text-foreground">
//                         {order.deliveryDate} at {order.deliveryTime}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Timeline */}
//                 <div>
//                   <h2 className="font-serif text-xl font-bold text-foreground mb-6">
//                     Tracking Updates
//                   </h2>
//                   <div className="space-y-0">
//                     {order.trackingUpdates.map((update, index) => (
//                       <div key={update.timestamp} className="flex gap-4">
//                         <div className="flex flex-col items-center">
//                           <div
//                             className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
//                               index === order.trackingUpdates.length - 1
//                                 ? "bg-primary text-primary-foreground"
//                                 : "bg-muted text-muted-foreground"
//                             }`}
//                           >
//                             {statusIcons[update.status] || (
//                               <Clock className="h-5 w-5" />
//                             )}
//                           </div>
//                           {index < order.trackingUpdates.length - 1 && (
//                             <div className="w-0.5 h-12 bg-border" />
//                           )}
//                         </div>
//                         <div className="pb-8">
//                           <p className="font-bold text-foreground">
//                             {update.status}
//                           </p>
//                           <p className="text-sm text-muted-foreground">
//                             {update.description}
//                           </p>
//                           <p className="text-xs text-muted-foreground mt-1">
//                             {new Date(update.timestamp).toLocaleString("en-ZA")}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Order items */}
//                 <div>
//                   <h2 className="font-serif text-xl font-bold text-foreground mb-4">
//                     Order Items
//                   </h2>
//                   <div className="bg-secondary rounded-lg divide-y divide-border">
//                     {order.items.map((item) => (
//                       <div
//                         key={item.product.id}
//                         className="flex items-center justify-between p-4"
//                       >
//                         <div>
//                           <p className="font-bold text-sm text-foreground">
//                             {item.product.name}
//                           </p>
//                           <p className="text-xs text-muted-foreground">
//                             Qty: {item.quantity}
//                           </p>
//                         </div>
//                         <span className="font-bold text-foreground">
//                           {formatPrice(item.product.price * item.quantity)}
//                         </span>
//                       </div>
//                     ))}
//                     <div className="p-4 space-y-1">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-muted-foreground">Subtotal</span>
//                         <span className="text-foreground">
//                           {formatPrice(order.subtotal)}
//                         </span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-muted-foreground">Delivery</span>
//                         <span className="text-foreground">
//                           {formatPrice(order.deliveryCost)}
//                         </span>
//                       </div>
//                       <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
//                         <span className="text-foreground">Total</span>
//                         <span className="text-primary">
//                           {formatPrice(order.total)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// }
//###################################################################
"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { formatPrice } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ChefHat,
} from "lucide-react";
import type { Order } from "@/lib/types";
import { toast } from "sonner";

// ✅ Import API function
import { getOrderById } from "@/lib/api";

const statusIcons: Record<string, React.ReactNode> = {
  "Order Placed": <Clock className="h-5 w-5" />,
  "Order Confirmed": <CheckCircle2 className="h-5 w-5" />,
  "Being Prepared": <ChefHat className="h-5 w-5" />,
  "Out for Delivery": <Truck className="h-5 w-5" />,
  Delivered: <MapPin className="h-5 w-5" />,
  "Ready for Collection": <Package className="h-5 w-5" />,
};

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [orderId, setOrderId] = useState(initialId);
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch order from backend
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      toast.error("Please enter an order ID");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const found = await getOrderById(orderId.trim());
      setOrder(found);
    } catch (error: any) {
      console.error("Failed to fetch order:", error);
      setOrder(null);
      toast.error("Order not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-secondary py-12 lg:py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Track Your Order
            </h1>
            <p className="text-muted-foreground mb-8">
              Enter your order ID to see real-time updates on your delivery
            </p>

            <form
              onSubmit={handleSearch}
              className="flex gap-3 max-w-md mx-auto"
            >
              <Input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ORD-2026-001"
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" className="rounded-full px-6" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Track"}
              </Button>
            </form>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4">
            {loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading order details...</p>
              </div>
            )}

            {searched && !loading && !order && (
              <div className="text-center py-12">
                <p className="font-serif text-xl text-foreground mb-2">
                  Order not found
                </p>
                <p className="text-muted-foreground">
                  Please check your order ID and try again.
                </p>
              </div>
            )}

            {order && (
              <div className="space-y-8">
                {/* Order header */}
                <div className="bg-secondary rounded-lg p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-bold text-lg text-foreground">
                        {order.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium capitalize">
                        {order.status.replace(/-/g, " ")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-bold text-lg text-primary">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {order.deliveryMethod === "delivery"
                          ? "Delivery"
                          : "Collection"}
                      </p>
                      <p className="font-bold text-foreground">
                        {order.deliveryDate} at {order.deliveryTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                {order.trackingUpdates && order.trackingUpdates.length > 0 && (
                  <div>
                    <h2 className="font-serif text-xl font-bold text-foreground mb-6">
                      Tracking Updates
                    </h2>
                    <div className="space-y-0">
                      {order.trackingUpdates
                        .slice()
                        .reverse()
                        .map((update, index) => (
                          <div key={update.timestamp} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                                  index === 0
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {statusIcons[update.status] || (
                                  <Clock className="h-5 w-5" />
                                )}
                              </div>
                              {index < order.trackingUpdates.length - 1 && (
                                <div className="w-0.5 h-12 bg-border" />
                              )}
                            </div>
                            <div className="pb-8">
                              <p className="font-bold text-foreground">
                                {update.status}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {update.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(update.timestamp).toLocaleString(
                                  "en-ZA"
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Order items */}
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground mb-4">
                    Order Items
                  </h2>
                  <div className="bg-secondary rounded-lg divide-y divide-border">
                    {order.items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between p-4"
                      >
                        <div>
                          <p className="font-bold text-sm text-foreground">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-bold text-foreground">
                          {formatPrice(item.priceAtOrder * item.quantity)}
                        </span>
                      </div>
                    ))}
                    <div className="p-4 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">
                          {formatPrice(order.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="text-foreground">
                          {formatPrice(order.deliveryCost)}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                        <span className="text-foreground">Total</span>
                        <span className="text-primary">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense>
      <TrackOrderContent />
    </Suspense>
  );
}
