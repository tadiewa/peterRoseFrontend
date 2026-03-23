// "use client";

// import { useState } from "react";
// import { AdminLayout } from "@/components/admin/admin-layout";
// import { sampleOrders, formatPrice } from "@/lib/data";
// import type { Order } from "@/lib/types";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Search, Eye } from "lucide-react";
// import { toast } from "sonner";

// const statusOptions = [
//   { value: "pending", label: "Pending" },
//   { value: "confirmed", label: "Confirmed" },
//   { value: "preparing", label: "Preparing" },
//   { value: "out-for-delivery", label: "Out for Delivery" },
//   { value: "delivered", label: "Delivered" },
//   { value: "ready-for-collection", label: "Ready for Collection" },
// ];

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState<Order[]>(sampleOrders);
//   const [search, setSearch] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   const filtered = orders.filter((o) => {
//     const matchSearch =
//       o.id.toLowerCase().includes(search.toLowerCase()) ||
//       `${o.customer.firstName} ${o.customer.lastName}`
//         .toLowerCase()
//         .includes(search.toLowerCase());
//     const matchStatus =
//       filterStatus === "all" || o.status === filterStatus;
//     return matchSearch && matchStatus;
//   });

//   const updateOrderStatus = (orderId: string, status: Order["status"]) => {
//     // TODO: Replace with Spring Boot API call: PATCH /api/orders/{orderId}/status
//     setOrders((prev) =>
//       prev.map((o) => (o.id === orderId ? { ...o, status } : o))
//     );
//     toast.success("Order status updated");
//   };

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         <div>
//           <h1 className="font-serif text-2xl font-bold text-foreground">
//             Orders
//           </h1>
//           <p className="text-muted-foreground">
//             Manage and track all customer orders
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search by order ID or customer..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <Select value={filterStatus} onValueChange={setFilterStatus}>
//             <SelectTrigger className="w-48">
//               <SelectValue placeholder="Filter by status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Statuses</SelectItem>
//               {statusOptions.map((s) => (
//                 <SelectItem key={s.value} value={s.value}>
//                   {s.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Table */}
//         <div className="border border-border rounded-lg overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Order ID</TableHead>
//                 <TableHead>Customer</TableHead>
//                 <TableHead>Items</TableHead>
//                 <TableHead>Method</TableHead>
//                 <TableHead>Date</TableHead>
//                 <TableHead className="text-right">Total</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-center">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filtered.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8} className="text-center py-8">
//                     <p className="text-muted-foreground">No orders found</p>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filtered.map((order) => (
//                   <TableRow key={order.id}>
//                     <TableCell className="font-bold text-sm text-foreground">
//                       {order.id}
//                     </TableCell>
//                     <TableCell>
//                       <p className="text-sm text-foreground">
//                         {order.customer.firstName} {order.customer.lastName}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {order.customer.email}
//                       </p>
//                     </TableCell>
//                     <TableCell className="text-sm text-foreground">
//                       {order.items.length} item
//                       {order.items.length !== 1 ? "s" : ""}
//                     </TableCell>
//                     <TableCell>
//                       <span className="text-xs capitalize bg-secondary px-2 py-1 rounded text-foreground">
//                         {order.deliveryMethod}
//                       </span>
//                     </TableCell>
//                     <TableCell className="text-sm text-muted-foreground">
//                       {order.deliveryDate}
//                     </TableCell>
//                     <TableCell className="text-right font-bold text-foreground">
//                       {formatPrice(order.total)}
//                     </TableCell>
//                     <TableCell>
//                       <Select
//                         value={order.status}
//                         onValueChange={(v) =>
//                           updateOrderStatus(
//                             order.id,
//                             v as Order["status"]
//                           )
//                         }
//                       >
//                         <SelectTrigger className="h-8 text-xs w-36">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {statusOptions.map((s) => (
//                             <SelectItem key={s.value} value={s.value}>
//                               {s.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </TableCell>
//                     <TableCell className="text-center">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => setSelectedOrder(order)}
//                       >
//                         <Eye className="h-4 w-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Order detail dialog */}
//         <Dialog
//           open={!!selectedOrder}
//           onOpenChange={() => setSelectedOrder(null)}
//         >
//           <DialogContent className="max-w-lg bg-background text-foreground">
//             <DialogHeader>
//               <DialogTitle className="font-serif text-foreground">
//                 Order Details - {selectedOrder?.id}
//               </DialogTitle>
//             </DialogHeader>
//             {selectedOrder && (
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <p className="text-muted-foreground">Customer</p>
//                     <p className="font-bold text-foreground">
//                       {selectedOrder.customer.firstName}{" "}
//                       {selectedOrder.customer.lastName}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Phone</p>
//                     <p className="font-bold text-foreground">
//                       {selectedOrder.customer.phone}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Email</p>
//                     <p className="font-bold text-foreground">
//                       {selectedOrder.customer.email}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Delivery Method</p>
//                     <p className="font-bold capitalize text-foreground">
//                       {selectedOrder.deliveryMethod}
//                     </p>
//                   </div>
//                   {selectedOrder.customer.address && (
//                     <div className="col-span-2">
//                       <p className="text-muted-foreground">Address</p>
//                       <p className="font-bold text-foreground">
//                         {selectedOrder.customer.address},{" "}
//                         {selectedOrder.customer.city},{" "}
//                         {selectedOrder.customer.province}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="border-t border-border pt-4">
//                   <p className="font-bold mb-2 text-foreground">Items</p>
//                   {selectedOrder.items.map((item) => (
//                     <div
//                       key={item.product.id}
//                       className="flex justify-between text-sm py-1"
//                     >
//                       <span className="text-foreground">
//                         {item.quantity}x {item.product.name}
//                       </span>
//                       <span className="font-bold text-foreground">
//                         {formatPrice(item.product.price * item.quantity)}
//                       </span>
//                     </div>
//                   ))}
//                   <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold">
//                     <span className="text-foreground">Total</span>
//                     <span className="text-primary">
//                       {formatPrice(selectedOrder.total)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </AdminLayout>
//   );
// }
//###################################################
"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { formatPrice } from "@/lib/data";
import type { Order } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { getOrders, updateOrderStatus } from "@/lib/api";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "out-for-delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      `${o.customer.firstName} ${o.customer.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ✅ Update order status via API
  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      toast.success("Order status updated");
    } catch (error: any) {
      console.error("Failed to update order status:", error);
      toast.error(error.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Orders
          </h1>
          <p className="text-muted-foreground">
            Manage and track all customer orders
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">No orders found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-bold text-sm text-foreground">
                      {order.id}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer.email}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs capitalize bg-secondary px-2 py-1 rounded text-foreground">
                        {order.deliveryMethod}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.deliveryDate}
                    </TableCell>
                    <TableCell className="text-right font-bold text-foreground">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(v) => handleUpdateStatus(order.id, v)}
                      >
                        <SelectTrigger className="h-8 text-xs w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Order detail dialog */}
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-lg bg-background text-foreground">
            <DialogHeader>
              <DialogTitle className="font-serif text-foreground">
                Order Details - {selectedOrder?.id}
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-bold text-foreground">
                      {selectedOrder.customer.firstName}{" "}
                      {selectedOrder.customer.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-bold text-foreground">
                      {selectedOrder.customer.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-bold text-foreground">
                      {selectedOrder.customer.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery Method</p>
                    <p className="font-bold capitalize text-foreground">
                      {selectedOrder.deliveryMethod}
                    </p>
                  </div>
                  {selectedOrder.customer.address && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-bold text-foreground">
                        {selectedOrder.customer.address},{" "}
                        {selectedOrder.customer.city},{" "}
                        {selectedOrder.customer.province}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4">
                  <p className="font-bold mb-2 text-foreground">Items</p>
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between text-sm py-1"
                    >
                      <span className="text-foreground">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="font-bold text-foreground">
                        {formatPrice(item.priceAtOrder * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">
                      {formatPrice(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
