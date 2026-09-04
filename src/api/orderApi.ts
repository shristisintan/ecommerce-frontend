import type {
  ShippingAddress,
} from "../types/checkout";

import {
  authenticatedFetch,
} from "./apiClient";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

/* =========================================================
   BUYER ORDER
========================================================= */

export interface CreatedOrder {
  _id: string;
  totalAmount: number;
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
    const response =
      await authenticatedFetch(
        `${API_URL}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            shippingAddress,
          }),
        }
      );

    const result:
      CreateOrderResponse =
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

/* =========================================================
   MERCHANT ORDERS
========================================================= */

export interface MerchantOrderItem {
  productId: string;
  tenantId: string;

  productName: string;

  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface MerchantOrderBuyer {
  _id: string;
  name: string;
  email: string;
}

export interface MerchantShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  country: string;
}

export interface MerchantOrder {
  _id: string;

  buyerId: MerchantOrderBuyer;

  items: MerchantOrderItem[];

  shippingAddress:
    MerchantShippingAddress;

  totalAmount: number;

  merchantTotal: number;

  orderStatus:
    | "PENDING_PAYMENT"
    | "PAID"
    | "PROCESSING"
    | "COMPLETED"
    | "CANCELLED"
    | "PAYMENT_FAILED";

  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED";

  createdAt: string;
  updatedAt: string;
}

interface MerchantOrdersResponse {
  success: boolean;

  message?: string;

  data: MerchantOrder[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface GetMerchantOrdersParams {
  page?: number;
  limit?: number;
  orderStatus?: string;
  paymentStatus?: string;
}

export const getMerchantOrders =
  async (
    params: GetMerchantOrdersParams = {}
  ): Promise<MerchantOrdersResponse> => {
    const query =
      new URLSearchParams();

    if (params.page) {
      query.set(
        "page",
        String(params.page)
      );
    }

    if (params.limit) {
      query.set(
        "limit",
        String(params.limit)
      );
    }

    if (params.orderStatus) {
      query.set(
        "orderStatus",
        params.orderStatus
      );
    }

    if (params.paymentStatus) {
      query.set(
        "paymentStatus",
        params.paymentStatus
      );
    }

    const response =
      await authenticatedFetch(
        `${API_URL}/orders/merchant/mine?${query.toString()}`
      );

    const result:
      MerchantOrdersResponse =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Unable to load merchant orders."
      );
    }

    return result;
  };

  /* =========================================================
   BUYER - MY ORDERS
========================================================= */

export interface BuyerOrderItem {
  productId: string;
  tenantId:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
      };

  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface BuyerOrder {
  _id: string;

  items: BuyerOrderItem[];

  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    country: string;
  };

  totalAmount: number;

  orderStatus:
    | "PENDING_PAYMENT"
    | "PAID"
    | "PROCESSING"
    | "COMPLETED"
    | "CANCELLED"
    | "PAYMENT_FAILED";

  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED";

  createdAt: string;
  updatedAt: string;
}

interface BuyerOrdersResponse {
  success: boolean;

  message?: string;

  data: BuyerOrder[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getMyOrders =
  async (
    page = 1,
    limit = 5
  ): Promise<BuyerOrdersResponse> => {
    const response =
      await authenticatedFetch(
        `${API_URL}/orders/mine?page=${page}&limit=${limit}`
      );

    const result:
      BuyerOrdersResponse =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Unable to load your orders."
      );
    }

    return result;
  };