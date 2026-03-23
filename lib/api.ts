// lib/api.ts - Complete API layer with JWT authentication

import type { 
  ProductResponseDTO, 
  ProductCreateDTO, 
  ProductUpdateDTO,
  CategoryResponseDTO,
  CategoryCreateDTO,
  CategoryUpdateDTO,
  Order,
  Review, 
  CollectionPoint 
} from "./types";

//const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9039';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? `http://${window.location.hostname}:9039` 
    : 'http://localhost:9039');


// ========== AUTH API ==========

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

/**
 * Login user and get JWT token
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Login failed");
  }

  return response.json();
}

/**
 * Validate JWT token
 */
export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/auth/validate`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Helper to get auth headers with JWT token
 */
export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  
  if (token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
  
  return {
    "Content-Type": "application/json",
  };
}

// ============ CATEGORIES ============

export async function getCategories(): Promise<CategoryResponseDTO[]> {
  const res = await fetch(`${API_URL}/api/categories`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch categories');
  }
  return res.json();
}

export async function getActiveCategories(): Promise<CategoryResponseDTO[]> {
  const res = await fetch(`${API_URL}/api/categories?active=true`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch active categories');
  return res.json();
}

export async function getCategoryById(id: string): Promise<CategoryResponseDTO> {
  const res = await fetch(`${API_URL}/api/categories/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch category');
  return res.json();
}

export async function getCategoryByName(name: string): Promise<CategoryResponseDTO> {
  const res = await fetch(`${API_URL}/api/categories/by-name/${name}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch category');
  return res.json();
}

export async function createCategory(category: CategoryCreateDTO): Promise<CategoryResponseDTO> {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/api/categories`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(category),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create category');
  }
  
  return res.json();
}

export async function updateCategory(id: string, category: CategoryUpdateDTO): Promise<CategoryResponseDTO> {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(category),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update category');
  }
  
  return res.json();
}

export async function toggleCategoryStatus(id: string): Promise<CategoryResponseDTO> {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/api/categories/${id}/toggle`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error('Failed to toggle category status');
  return res.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) {
    let errorMsg = 'Failed to delete category';
    try {
      const text = await res.text();
      let parseText = text;
      try {
        const data = JSON.parse(text);
        parseText = data.message || data.error || text;
      } catch {}

      if (parseText.includes('violates foreign key constraint') && parseText.includes('table "products"')) {
        errorMsg = "Cannot delete this category because there are still products linked to it. Please reassign or delete the products first.";
      } else if (parseText && parseText.length < 150) {
        errorMsg = parseText;
      }
    } catch {
      // Ignored
    }
    throw new Error(errorMsg);
  }
}

// ============ PRODUCTS ============

export async function getProducts(): Promise<ProductResponseDTO[]> {
  const res = await fetch(`${API_URL}/api/products`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getFeaturedProducts(): Promise<ProductResponseDTO[]> {
  const res = await fetch(`${API_URL}/api/products?featured=true`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch featured products');
  return res.json();
}

export async function getProductsByCategoryId(categoryId: string): Promise<ProductResponseDTO[]> {
  const res = await fetch(`${API_URL}/api/products?categoryId=${categoryId}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch products by category');
  return res.json();
}

export async function getProductById(id: string): Promise<ProductResponseDTO> {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function createProduct(product: ProductCreateDTO): Promise<ProductResponseDTO> {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(product),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create product');
  }
  
  return res.json();
}

export async function updateProduct(id: string, product: ProductUpdateDTO): Promise<ProductResponseDTO> {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(product),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update product');
  }
  
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) {
    let errorMsg = 'Failed to delete product';
    try {
      const text = await res.text();
      let parseText = text;
      try {
        const data = JSON.parse(text);
        parseText = data.message || data.error || text;
      } catch {}

      if (parseText.includes('violates foreign key constraint') && parseText.includes('table "order_items"')) {
        errorMsg = "Cannot delete this product because it is part of existing customer orders. Please mark it as inactive instead.";
      } else if (parseText && parseText.length < 150) {
        errorMsg = parseText;
      }
    } catch {
      // Ignored
    }
    throw new Error(errorMsg);
  }
}

export async function updateProductStock(id: string, stock: number): Promise<ProductResponseDTO> {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/api/products/${id}/stock`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ stock }),
  });
  if (!res.ok) throw new Error('Failed to update stock');
  return res.json();
}

// ============ ORDERS ============

export async function getOrders(filters?: {
  status?: string;
  email?: string;
  deliveryDate?: string;
  search?: string;
}): Promise<Order[]> {
  let url = `${API_URL}/api/orders`;
  const params = new URLSearchParams();
  
  if (filters?.status) params.append('status', filters.status);
  if (filters?.email) params.append('email', filters.email);
  if (filters?.deliveryDate) params.append('deliveryDate', filters.deliveryDate);
  if (filters?.search) params.append('search', filters.search);
  
  if (params.toString()) url += `?${params.toString()}`;
  
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function getOrderById(id: string): Promise<Order> {
  const res = await fetch(`${API_URL}/api/orders/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Order not found');
  }
  return res.json();
}

export async function createOrder(order: any): Promise<Order> {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create order');
  }
  return res.json();
}

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ status }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update order status');
  }
  
  return res.json();
}

export async function deleteOrder(id: string): Promise<void> {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/api/orders/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error('Failed to delete order');
}

export async function getDailyRevenue(): Promise<{ amount: number; count: number }> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/payments/summary/today`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch daily revenue');
  
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (typeof data === 'number') return { amount: data, count: 0 };
    
    let calcAmount = data.totalAmount || data.total || data.revenue || data.amount || 0;
    if (!calcAmount && Array.isArray(data.payments)) {
      calcAmount = data.payments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
    }

    return {
      amount: calcAmount,
      count: data.paymentCount || (Array.isArray(data.payments) ? data.payments.length : 0) || data.count || 0
    };
  } catch (e) {
    return { amount: Number(text) || 0, count: 0 };
  }
}


// ============ REVIEWS ============

export async function getReviews(): Promise<Review[]> {
  const res = await fetch(`${API_URL}/api/reviews`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const res = await fetch(`${API_URL}/api/products/${productId}/reviews`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch product reviews');
  return res.json();
}

// ============ COLLECTION POINTS ============

export async function getCollectionPoints(): Promise<CollectionPoint[]> {
  const res = await fetch(`${API_URL}/api/collection-points`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch collection points');
  return res.json();
}