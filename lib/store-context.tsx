"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Product, Review } from "./types";
import { products as initialProducts, reviews as initialReviews } from "./data";

export interface Category {
  id: string;
  slug: string;
  name: string;
  image: string;
  description: string;
}

const defaultCategories: Category[] = [
  {
    id: "cat-1",
    slug: "roses",
    name: "Roses",
    image: "/images/category-roses.jpg",
    description: "Beautiful fresh roses for every occasion",
  },
  {
    id: "cat-2",
    slug: "bouquets",
    name: "Bouquets",
    image: "/images/category-bouquets.jpg",
    description: "Hand-crafted mixed bouquets",
  },
  {
    id: "cat-3",
    slug: "treats",
    name: "Gifts & Treats",
    image: "/images/category-treats.jpg",
    description: "Flower and gift hampers",
  },
  {
    id: "cat-4",
    slug: "boxed",
    name: "Boxed Roses",
    image: "/images/product-petite-box.jpg",
    description: "Premium boxed rose arrangements",
  },
  {
    id: "cat-5",
    slug: "valentines",
    name: "Valentines",
    image: "/images/product-heart-box.jpg",
    description: "Romantic arrangements for Valentine's Day",
  },
];

interface StoreContextType {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, stock: number) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addReview: (review: Omit<Review, "id" | "status">) => void;
  updateReviewStatus: (id: string, status: Review["status"]) => void;
  deleteReview: (id: string) => void;
  getReviewsByProduct: (productId: string) => Review[];
  getProductsByCategory: (slug: string) => Product[];
  getFeaturedProducts: () => Product[];
  getBestSellers: () => Product[];
  getProductById: (id: string) => Product | undefined;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // --- Products ---
  const addProduct = useCallback((product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateStock = useCallback((id: string, stock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, stock) } : p))
    );
  }, []);

  // --- Categories ---
  const addCategory = useCallback((category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCategory]);
  }, []);

  const updateCategory = useCallback((category: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? category : c))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // --- Reviews ---
  const addReview = useCallback((review: Omit<Review, "id" | "status">) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      status: "pending",
    };
    setReviews((prev) => [newReview, ...prev]);
  }, []);

  const updateReviewStatus = useCallback(
    (id: string, status: Review["status"]) => {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    },
    []
  );

  const deleteReview = useCallback((id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const getReviewsByProduct = useCallback(
    (productId: string) =>
      reviews.filter(
        (r) => r.productId === productId && r.status === "approved"
      ),
    [reviews]
  );

  // --- Queries ---
  const getProductsByCategory = useCallback(
    (slug: string) => products.filter((p) => p.category === slug),
    [products]
  );

  const getFeaturedProducts = useCallback(
    () => products.filter((p) => p.featured).slice(0, 4),
    [products]
  );

  const getBestSellers = useCallback(
    () => products.filter((p) => p.bestSeller).slice(0, 4),
    [products]
  );

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        reviews,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        addCategory,
        updateCategory,
        deleteCategory,
        addReview,
        updateReviewStatus,
        deleteReview,
        getReviewsByProduct,
        getProductsByCategory,
        getFeaturedProducts,
        getBestSellers,
        getProductById,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
