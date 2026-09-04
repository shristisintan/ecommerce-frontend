import type {
  CartResponse,
} from "../types/cart";

import {
  authenticatedFetch,
} from "./apiClient";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

interface AddToCartInput {
  productId: string;
  quantity: number;
}

interface UpdateCartInput {
  productId: string;
  quantity: number;
}

const request = async (
  url: string,
  options: RequestInit = {}
) => {
  const token =
    localStorage.getItem(
      "access_token"
    );

  if (!token) {
    throw new Error(
      "Please sign in to continue."
    );
  }

  const headers =
    new Headers(
      options.headers
    );

  /*
   * Cart requests with a body
   * use JSON.
   */
  if (options.body) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  const response =
    await authenticatedFetch(
      `${API_URL}${url}`,
      {
        ...options,
        headers,
      }
    );

  const result =
    await response.json();

  if (
    !response.ok ||
    !result.success
  ) {
    throw new Error(
      result.message ||
        "Something went wrong"
    );
  }

  return result;
};

/* =========================================================
   GET CART
========================================================= */

export const getCart =
  async (): Promise<CartResponse> => {
    return request(
      "/cart"
    );
  };

/* =========================================================
   ADD PRODUCT TO CART
========================================================= */

export const addToCart =
  async ({
    productId,
    quantity,
  }: AddToCartInput): Promise<CartResponse> => {
    return request(
      "/cart/items",
      {
        method: "POST",

        body:
          JSON.stringify({
            productId,
            quantity,
          }),
      }
    );
  };

/* =========================================================
   UPDATE CART ITEM
========================================================= */

export const updateCartItem =
  async ({
    productId,
    quantity,
  }: UpdateCartInput): Promise<CartResponse> => {
    return request(
      `/cart/items/${productId}`,
      {
        method: "PATCH",

        body:
          JSON.stringify({
            quantity,
          }),
      }
    );
  };

/* =========================================================
   REMOVE CART ITEM
========================================================= */

export const removeCartItem =
  async (
    productId: string
  ): Promise<CartResponse> => {
    return request(
      `/cart/items/${productId}`,
      {
        method: "DELETE",
      }
    );
  };

/* =========================================================
   CLEAR CART
========================================================= */

export const clearCart =
  async (): Promise<CartResponse> => {
    return request(
      "/cart",
      {
        method: "DELETE",
      }
    );
  };