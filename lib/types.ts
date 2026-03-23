export interface CategoryResponseDTO {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponseDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: CategoryResponseDTO; 
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  rating: number;
  reviewCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryCreateDTO {
  name: string;
  displayName: string;
  description?: string;
  imageUrl?: string;
  active?: boolean;
  displayOrder?: number;
}

export interface CategoryUpdateDTO {
  name: string;
  displayName: string;
  description?: string;
  imageUrl?: string;
  active?: boolean;
  displayOrder?: number;
}

export interface ProductCreateDTO {
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string; // Just the ID, not the full object
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
}

export interface ProductUpdateDTO {
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
}



export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}


export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  createdAt?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  deliveryDate: string;
  deliveryTime: string;
  deliveryCost: number;
  subtotal: number;
  total: number;
  customer: Customer;
  createdAt: string;
  trackingUpdates?: TrackingUpdate[];
  collectionPointId?: string;
}

export interface OrderItem {
  id?: number;
  product: ProductResponseDTO;
  quantity: number;
  priceAtOrder?: number;
}


export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "preparing" 
  | "out-for-delivery" 
  | "delivered"
  | "cancelled";

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  province?: string;
}

export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  province: string;
  hours: string;
  active: boolean;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  province?: string;
  collectionPoint?: string;
  notes?: string;
}

export interface TrackingUpdate {
  id?: number;
  status: string;
  timestamp: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "admin";
}

export type DeliveryMethod = "delivery" | "collection";

export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  province: string;
  hours: string;
}


export interface ValidationError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  fieldErrors?: Record<string, string>;
  path: string;
}
