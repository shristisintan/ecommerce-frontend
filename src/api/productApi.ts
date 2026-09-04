import type {
  ProductDetailResponse,
  ProductListResponse,
} from "../types/product";

import {
  authenticatedFetch,
} from "./apiClient";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

interface GetMerchantProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export interface CreateProductInput {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
}

export interface UpdateProductInput {
  categoryId?: string;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: string[];
  isActive?: boolean;
}

/* PUBLIC */

export const getProducts = async (
  params: GetProductsParams = {}
): Promise<ProductListResponse> => {
  const query = new URLSearchParams();

  if (params.page)
    query.set("page", String(params.page));

  if (params.limit)
    query.set("limit", String(params.limit));

  if (params.search)
    query.set("search", params.search);

  if (params.categoryId)
    query.set(
      "categoryId",
      params.categoryId
    );

  if (params.minPrice !== undefined)
    query.set(
      "minPrice",
      String(params.minPrice)
    );

  if (params.maxPrice !== undefined)
    query.set(
      "maxPrice",
      String(params.maxPrice)
    );

  if (params.sort)
    query.set("sort", params.sort);

  const response = await fetch(
    `${API_URL}/products?${query.toString()}`
  );

  const result =
    await response.json();

  if (
    !response.ok ||
    !result.success
  ) {
    throw new Error(
      result.message ||
        "Failed to load products"
    );
  }

  return result;
};

export const getProductById =
  async (
    productId: string
  ): Promise<ProductDetailResponse> => {
    const response = await fetch(
      `${API_URL}/products/${productId}`
    );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Failed to load product"
      );
    }

    return result;
  };

/* MERCHANT */

export const getMerchantProducts =
  async (
    _accessToken: string,
    params: GetMerchantProductsParams = {}
  ): Promise<ProductListResponse> => {
    const query = new URLSearchParams();

    if (params.page)
      query.set(
        "page",
        String(params.page)
      );

    if (params.limit)
      query.set(
        "limit",
        String(params.limit)
      );

    if (params.search)
      query.set(
        "search",
        params.search
      );

    if (params.categoryId)
      query.set(
        "categoryId",
        params.categoryId
      );

    const response =
      await authenticatedFetch(
        `${API_URL}/products/merchant/mine?${query.toString()}`
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Failed to load merchant products"
      );
    }

    return result;
  };

export const createProduct =
  async (
    _accessToken: string,
    data: CreateProductInput
  ): Promise<ProductDetailResponse> => {
    const response =
      await authenticatedFetch(
        `${API_URL}/products`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(data),
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
          "Failed to create product"
      );
    }

    return result;
  };

/* EDIT + STOCK UPDATE */

export const updateProduct =
  async (
    _accessToken: string,
    productId: string,
    data: UpdateProductInput
  ): Promise<ProductDetailResponse> => {
    const response =
      await authenticatedFetch(
        `${API_URL}/products/${productId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(data),
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
          "Failed to update product"
      );
    }

    return result;
  };

/* SOFT DELETE */

export const deleteProduct =
  async (
    _accessToken: string,
    productId: string
  ): Promise<ProductDetailResponse> => {
    const response =
      await authenticatedFetch(
        `${API_URL}/products/${productId}`,
        {
          method: "DELETE",
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
          "Failed to delete product"
      );
    }

    return result;
  };