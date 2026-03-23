import React from "react"
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { StoreProvider } from "@/lib/store-context";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const _playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const _lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Peter Rose | Premium Flower Delivery",
  description:
    "Beautiful hand-crafted flower arrangements delivered to your door. Same-day delivery available. Creating memories with every bouquet.",
};

export const viewport: Viewport = {
  themeColor: "#e8577e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Disable Grammarly */}
        <meta name="grammarly" content="false" />
        <meta name="grammarly-extension" content="false" />
        
        {/* Yoco SDK script */}
        <Script
          src="https://js.yoco.com/sdk/v1/yoco-sdk-web.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          <StoreProvider>
            <CartProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
                <Toaster />
              </ThemeProvider>
            </CartProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}