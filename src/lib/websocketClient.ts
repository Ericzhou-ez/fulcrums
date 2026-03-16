import { auth } from "../configs/firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

export type WebSocketMessage = {
  type: "products" | "clients" | "suppliers" | "orders" | "sync" | "connected" | "pong";
  action?: "created" | "updated" | "deleted" | "completed";
  productId?: string;
  productIds?: string[];
  clientId?: string;
  supplierId?: string;
  orderId?: string;
  message?: string;
};

export type WebSocketCallback = (message: WebSocketMessage) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private callbacks: Set<WebSocketCallback> = new Set();
  private isConnecting = false;

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();
      const wsUrl = `${WS_BASE_URL}/ws?token=${encodeURIComponent(token)}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.callbacks.forEach((callback) => callback(message));
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.isConnecting = false;
        this.ws = null;

        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
          setTimeout(() => this.connect(), delay);
        }
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      this.isConnecting = false;
      throw error;
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.callbacks.clear();
  }

  subscribe(callback: WebSocketCallback): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  ping(): void {
    this.send({ type: "ping" });
  }
}

export const websocketClient = new WebSocketClient();
