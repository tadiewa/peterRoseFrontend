"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Package,
  MapPin,
  LogOut,
  Settings,
  Heart,
} from "lucide-react";

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-4">
              Please sign in to view your account
            </h1>
            <Button asChild className="rounded-full">
              <Link href="/login?redirect=/account">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const menuItems = [
    {
      icon: Package,
      label: "My Orders",
      description: "View and track your orders",
      href: "/track-order",
    },
    {
      icon: MapPin,
      label: "Delivery Addresses",
      description: "Manage your saved addresses",
      href: "#",
    },
    {
      icon: Heart,
      label: "Wishlist",
      description: "Your saved products",
      href: "/shop",
    },
    {
      icon: Settings,
      label: "Account Settings",
      description: "Update your profile and preferences",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-6 md:py-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Profile header */}
          <div className="bg-secondary rounded-lg p-4 sm:p-6 mb-6 md:mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl sm:text-2xl font-bold font-serif shrink-0">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-primary text-sm font-bold hover:underline"
                >
                  Go to Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Menu grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 md:mb-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-colors"
              >
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                <div>
                  <p className="font-bold text-sm sm:text-base text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="rounded-full bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
