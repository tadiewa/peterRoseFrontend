"use client";

import { AdminLayout } from "@/components/admin/admin-layout";
import { sampleOrders } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users } from "lucide-react";

export default function AdminCustomersPage() {
  // Derive unique customers from orders for demo
  const customers = sampleOrders.map((o) => ({
    ...o.customer,
    orderId: o.id,
    orderTotal: o.total,
    orderDate: o.createdAt,
  }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Customers
          </h1>
          <p className="text-muted-foreground">
            View and manage your customer database
          </p>
        </div>

        <div className="bg-secondary rounded-lg p-4 inline-flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">
            <strong>{customers.length}</strong> total customers
          </span>
        </div>

        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No customer data yet. Customer data will populate as
                      orders are placed.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.orderId}>
                    <TableCell className="font-bold text-sm text-foreground">
                      {customer.firstName} {customer.lastName}
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {customer.email}
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {customer.phone}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {customer.city ? `${customer.city}, ${customer.province}` : "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(customer.orderDate).toLocaleDateString("en-ZA")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground">
          Full customer management will be available via your Spring Boot backend
          API. Connect your endpoints at{" "}
          <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">
            GET /api/customers
          </code>
        </p>
      </div>
    </AdminLayout>
  );
}
