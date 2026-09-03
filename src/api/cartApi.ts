import type {
  CartResponse,
} from "../types/cart";

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

const getToken = () => {
  return localStorage.getItem(
    "access_token"
  );
};

const request = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Please sign in to continue."
    );
  }

  const response = await fetch(
    `${API_URL}${url}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,

        ...options.headers,
      },
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

export const getCart =
  async (): Promise<CartResponse> => {
    return request("/cart");
  };

export const addToCart =
  async ({
    productId,
    quantity,
  }: AddToCartInput): Promise<CartResponse> => {
    return request(
      "/cart/items",
      {
        method: "POST",

        body: JSON.stringify({
          productId,
          quantity,
        }),
      }
    );
  };

export const updateCartItem =
  async ({
    productId,
    quantity,
  }: UpdateCartInput): Promise<CartResponse> => {
    return request(
      `/cart/items/${productId}`,
      {
        method: "PATCH",

        body: JSON.stringify({
          quantity,
        }),
      }
    );
  };

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

export const clearCart =
  async (): Promise<CartResponse> => {
    return request(
      "/cart",
      {
        method: "DELETE",
      }
    );
  };