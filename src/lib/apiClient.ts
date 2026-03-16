import { auth } from "../configs/firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ApiError {
  message: string;
  detail?: string;
  status?: number;
}

/**
 * Get Firebase ID token for authentication
 */
async function getIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  return await user.getIdToken();
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getIdToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `Request failed: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use status text
    }
    const error: ApiError = {
      message: errorMessage,
      detail: errorMessage,
      status: response.status,
    };
    throw error;
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return {} as T;
}

/**
 * API client methods
 */
export const apiClient = {
  // Products
  getProducts: () => apiRequest<any[]>("/products"),
  getProduct: (productId: string) => apiRequest<any>(`/products/${productId}`),
  createProduct: (product: any) =>
    apiRequest<{ success: boolean; productId: string }>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),
  updateProduct: (productId: string, product: any) =>
    apiRequest<any>(`/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify(product),
    }),
  deleteProducts: (productIds: string[]) =>
    apiRequest<{ success: boolean; summary: any[] }>("/products", {
      method: "DELETE",
      body: JSON.stringify(productIds),
    }),
  toggleSaveProduct: (productId: string) =>
    apiRequest<{ success: boolean; saved: boolean }>(
      `/products/${productId}/save`,
      {
        method: "PATCH",
      }
    ),

  // Clients
  getClients: () => apiRequest<any[]>("/clients"),
  getClient: (clientId: string) => apiRequest<any>(`/clients/${clientId}`),
  createClient: (client: any) =>
    apiRequest<{ success: boolean; clientId: string }>("/clients", {
      method: "POST",
      body: JSON.stringify(client),
    }),
  updateClient: (clientId: string, client: any) =>
    apiRequest<any>(`/clients/${clientId}`, {
      method: "PATCH",
      body: JSON.stringify(client),
    }),
  deleteClient: (clientId: string) =>
    apiRequest<{ success: boolean }>(`/clients/${clientId}`, {
      method: "DELETE",
    }),
  updateClientProducts: (clientId: string, productIds: string[]) =>
    apiRequest<{ success: boolean }>(`/clients/${clientId}/products`, {
      method: "PATCH",
      body: JSON.stringify(productIds),
    }),

  // Suppliers
  getSuppliers: () => apiRequest<any[]>("/suppliers"),
  getSupplier: (supplierId: string) =>
    apiRequest<any>(`/suppliers/${supplierId}`),
  createSupplier: (supplier: any) =>
    apiRequest<{ success: boolean; supplierId: string }>("/suppliers", {
      method: "POST",
      body: JSON.stringify(supplier),
    }),
  updateSupplier: (supplierId: string, supplier: any) =>
    apiRequest<any>(`/suppliers/${supplierId}`, {
      method: "PATCH",
      body: JSON.stringify(supplier),
    }),
  deleteSupplier: (supplierId: string) =>
    apiRequest<{ success: boolean }>(`/suppliers/${supplierId}`, {
      method: "DELETE",
    }),

  // Orders
  getOrders: () => apiRequest<any[]>("/orders"),
  getOrder: (orderId: string) => apiRequest<any>(`/orders/${orderId}`),
  createOrder: (order: any) =>
    apiRequest<{ success: boolean; orderId: string }>("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    }),
  updateOrder: (orderId: string, order: any) =>
    apiRequest<any>(`/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify(order),
    }),
  deleteOrder: (orderId: string) =>
    apiRequest<{ success: boolean }>(`/orders/${orderId}`, {
      method: "DELETE",
    }),
  updateOrderState: (orderId: string, status: string) =>
    apiRequest<{ success: boolean; orderId: string; status: string }>(
      `/orders/${orderId}/state?status=${encodeURIComponent(status)}`,
      {
        method: "PATCH",
      }
    ),

  // Sync
  syncAll: (payload: any) =>
    apiRequest<{ success: boolean }>("/sync", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
