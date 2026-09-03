import type { Product } from "./product";

export interface CartItem {
  productId: Product | string;
  quantity: number;
}

export interface Cart {
  _id: string;
  buyerId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data: Cart;
}