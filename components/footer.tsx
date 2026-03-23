import Link from "next/link";
import { Heart, Phone, Mail, MapPin, Clock, Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-foreground text-background relative">
      {/* Gradient accent line */}
      <div className="h-1 bg-gradient-to-r from-primary via-primary/70 to-primary" />

      {/* Newsletter bar */}
      <div className="border-b border-background/8">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-xl md:text-2xl font-bold mb-1.5">
                Stay in Bloom
              </h3>
              <p className="text-background/55 text-sm">
                Subscribe for exclusive offers, new arrivals, and seasonal
                inspiration.
              </p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <Input
                placeholder="Enter your email"
                className="bg-background/8 border-background/15 text-background placeholder:text-background/35 flex-1 focus:border-primary/50 focus:ring-primary/20 transition-all"
              />
              <Button className="rounded-full px-6 shrink-0 shadow-lg hover:shadow-xl transition-shadow">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-14 md:py-18">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5 group">
              <Heart className="h-5 w-5 text-primary fill-primary transition-transform duration-300 group-hover:scale-110" />
              <span className="font-serif text-xl font-bold">Peter Rose</span>
            </Link>
            <p className="text-background/55 text-sm leading-relaxed mb-5">
              Creating memories with every bouquet. Premium flower arrangements
              hand-crafted with love and delivered to your doorstep.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.tiktok.com/@peter_rose_florist?_r=1&_t=ZS-94n8nRJqxZo"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-background/8 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="TikTok"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/peter_rose_za?igsh=MWQ1NjYwMmV2ZWRnaQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-background/8 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-base font-bold mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "Shop All" },
                { href: "/shop?category=roses", label: "Roses" },
                { href: "/shop?category=bouquets", label: "Bouquets" },
                { href: "/shop?category=treats", label: "Gifts & Treats" },
                { href: "/track-order", label: "Track Order" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/55 hover:text-primary transition-colors duration-200 hover:translate-x-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-serif text-base font-bold mb-5">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/checkout", label: "Checkout" },
                { href: "/track-order", label: "Track Your Order" },
                { href: "#", label: "Delivery Information" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/55 hover:text-primary transition-colors duration-200 hover:translate-x-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-base font-bold mb-5">Contact Us</h3>
            <ul className="space-y-3.5">
              <li className="flex items-center gap-3 text-sm text-background/55">
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                +27 60 839 5675
              </li>
              <li className="flex items-center gap-3 text-sm text-background/55">
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                </div>
                Peterroseenquiries@gmail.com
              </li>
              <li className="flex items-start gap-3 text-sm text-background/55">
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                Sandton, Johannesburg, South Africa
              </li>
              <li className="flex items-start gap-3 text-sm text-background/55">
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>
                  Mon - Sat: 8:00 - 17:00
                  <br />
                  Sunday: Closed
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/8">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-background/35">
            &copy; {new Date().getFullYear()} Peter Rose. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-background/35">
            <span>Visa</span>
            <span className="text-background/15">|</span>
            <span>Mastercard</span>
            <span className="text-background/15">|</span>
            <span>EFT</span>
            <span className="text-background/15">|</span>
            <span>SnapScan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
