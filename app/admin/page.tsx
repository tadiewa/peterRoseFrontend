"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getProducts, getOrders, getDailyRevenue } from "@/lib/api";
import type { ProductResponseDTO, Order } from "@/lib/types";
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(price);
};

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dailyRevenueApi, setDailyRevenueApi] = useState({ amount: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [productsData, ordersData, revenueData] = await Promise.all([
          getProducts(),
          getOrders(),
          getDailyRevenue().catch(() => ({ amount: 0, count: 0 })),
        ]);
        setProducts(productsData);
        setOrders(ordersData);
        setDailyRevenueApi(revenueData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const dailyOrdersList = orders.filter((o) => new Date(o.createdAt) >= startOfDay);
  const dailyRevenue = dailyRevenueApi.amount;
  const todaySuccessPaymentsCount = dailyRevenueApi.count || dailyOrdersList.length;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const avgRating =
    products.length > 0
      ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
      : 0;

  const stats = [
    {
      title: "Daily Revenue",
      value: formatPrice(dailyRevenue),
      icon: DollarSign,
      description: `${todaySuccessPaymentsCount} payments today`,
    },
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      description: "All time",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      description: "All time",
    },
    {
      title: "Products",
      value: totalProducts.toString(),
      icon: Package,
      description: `${lowStockProducts.length} low stock`,
    },
    {
      title: "Avg. Rating",
      value: avgRating.toFixed(1),
      icon: TrendingUp,
      description: `From ${products.length} products`,
    },
  ];

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your florist business
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {lowStockProducts.length > 0 && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg"
                  >
                    <div>
                      <p className="font-bold text-sm text-foreground">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category.displayName}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold px-2 py-1 rounded ${
                        product.stock === 0
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No orders yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-bold text-sm text-foreground">
                        {order.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer.firstName} {order.customer.lastName} -{" "}
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-foreground">
                        {formatPrice(order.total)}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground capitalize">
                        {order.status.replace(/-/g, " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
