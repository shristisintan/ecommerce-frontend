import type {
  ProductDetailResponse,
  ProductListResponse,
} from "../types/product";

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

export const getProducts = async (
  params: GetProductsParams = {}
): Promise<ProductListResponse> => {
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

  if (params.search) {
    query.set(
      "search",
      params.search
    );
  }

  if (params.categoryId) {
    query.set(
      "categoryId",
      params.categoryId
    );
  }

  if (
    params.minPrice !== undefined
  ) {
    query.set(
      "minPrice",
      String(params.minPrice)
    );
  }

  if (
    params.maxPrice !== undefined
  ) {
    query.set(
      "maxPrice",
      String(params.maxPrice)
    );
  }

  if (params.sort) {
    query.set(
      "sort",
      params.sort
    );
  }

  const response =
    await fetch(
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

export const getProductById = async (
  productId: string
): Promise<ProductDetailResponse> => {
  const response = await fetch(
    `${API_URL}/products/${productId}`
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ||
        "Failed to load product"
    );
  }

  return result;
};