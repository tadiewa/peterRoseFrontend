"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Heart,
  Phone,
  Mail,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartDrawer } from "@/components/cart-drawer";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=roses", label: "Roses" },
  { href: "/shop?category=bouquets", label: "Bouquets" },
  { href: "/shop?category=treats", label: "Gifts & Treats" },
  { href: "/track-order", label: "Track Order" },
];

export function Navbar() {
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top utility bar - hidden on mobile */}
      <div className="hidden md:block bg-gradient-to-r from-foreground via-foreground/95 to-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-9 text-xs">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
              <Phone className="h-3 w-3" />
              +27 60 839 5675
            </span>
            <span className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
              <Mail className="h-3 w-3" />
              Peterroseenquiries@gmail.com
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="opacity-80">Same-day delivery Mon-Sat</span>
            <span className="text-background/30">|</span>
          </div>
        </div>
      </div>

      {/* Announcement bar - mobile only */}
      <div className="md:hidden bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground text-center py-2 text-xs font-sans tracking-wide">
        ✨ Same-day delivery Mon-Sat — R150 flat fee!
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b transition-all duration-300 ${
          scrolled
            ? "border-border/80 shadow-soft"
            : "border-border/40 shadow-none"
        }`}
      >
        {/* Top row: logo centered */}
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-14 md:h-16 lg:h-20">
            {/* Left: Mobile menu button + search */}
            <div className="flex items-center gap-1 w-28 md:w-36">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[280px] sm:w-[320px] bg-background text-foreground p-0"
                >
                  <div className="flex flex-col h-full">
                    <div className="p-5 border-b border-border flex items-center justify-between">
                      <Link
                        href="/"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2"
                      >
                        <Image 
                          src="/images/logo.png" 
                          alt="Peter Rose Logo" 
                          width={24} 
                          height={24}
                          className="object-contain"
                        />
                        <span className="font-serif text-xl font-bold text-foreground">
                          Peter Rose
                        </span>
                      </Link>
                      <ThemeToggle />
                    </div>
                    <nav className="flex-1 overflow-y-auto py-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-5 py-3.5 text-base font-sans text-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200 hover:pl-7"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                    <div className="border-t border-border p-5 space-y-3">
                      {isAuthenticated ? (
                        <>
                          <p className="text-sm text-muted-foreground">
                            Hello, {user?.firstName}
                          </p>
                          {user?.role === "admin" && (
                            <Link
                              href="/admin"
                              onClick={() => setMobileOpen(false)}
                              className="block py-2 text-sm text-foreground hover:text-primary transition-colors"
                            >
                              Admin Panel
                            </Link>
                          )}
                          {/* <Link
                            href="/account"
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 text-sm text-foreground hover:text-primary transition-colors"
                          >
                            My Account
                          </Link> */}
                          <button
                            onClick={() => {
                              logout();
                              setMobileOpen(false);
                            }}
                            className="block py-2 text-sm text-foreground hover:text-primary transition-colors"
                            type="button"
                          >
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Button asChild className="w-full rounded-full">
                            <Link
                              href="/login"
                              onClick={() => setMobileOpen(false)}
                            >
                              Sign In
                            </Link>
                          </Button>
                        </div>
                      )}
                      <div className="pt-3 text-xs text-muted-foreground space-y-1.5">
                        <p className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3" /> +27 60 839 5675
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3" /> Peterroseenquiries@gmail.com
                        </p>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/shop" className="hidden sm:flex">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </Link>
            </div>

            {/* Center: Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image 
                src="/images/logo.png"
                alt="Peter Rose" 
                height={120}
                width={120}          
                className="object-contain w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 transition-transform duration-300 group-hover:scale-105"  
              />
              <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                Peter Rose
              </span>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 w-28 md:w-36 justify-end">
              <ThemeToggle />

              {/* User menu - desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex h-9 w-9"
                  >
                    <User className="h-4 w-4" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-background text-foreground"
                >
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem
                        className="text-muted-foreground"
                        disabled
                      >
                        Hello, {user?.firstName}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user?.role === "admin" && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin">Admin Panel</Link>
                        </DropdownMenuItem>
                      )}
                      {/* <DropdownMenuItem asChild>
                        <Link href="/account">My Account</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account/orders">My Orders</Link>
                      </DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/login">Sign In</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 md:h-5 md:w-5 rounded-full bg-primary text-primary-foreground text-[10px] md:text-xs flex items-center justify-center font-bold animate-scaleIn">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Cart ({itemCount} items)</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop nav row */}
        <nav className="hidden lg:block border-t border-border/50">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-center gap-8 h-11">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-sans font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wider py-1 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
