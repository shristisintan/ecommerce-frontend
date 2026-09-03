import type {
  ShippingAddress,
} from "../types/checkout";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

export interface CreatedOrder {
  _id: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
}

interface CreateOrderResponse {
  success: boolean;
  message?: string;
  data: CreatedOrder;
}

export const createOrder =
  async (
    shippingAddress: ShippingAddress
  ): Promise<CreatedOrder> => {
    const accessToken =
      localStorage.getItem(
        "access_token"
      );

    if (!accessToken) {
      throw new Error(
        "Please sign in to continue."
      );
    }

    const response = await fetch(
      `${API_URL}/orders`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${accessToken}`,
        },

        body: JSON.stringify({
          shippingAddress,
        }),
      }
    );

    const result: CreateOrderResponse =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Unable to create order."
      );
    }

    return result.data;
  };