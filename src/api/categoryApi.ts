import {
  authenticatedFetch,
} from "./apiClient";

import type {
  Category,
  CategoryListResponse,
} from "../types/category";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

interface CategoryResponse {
  success: boolean;
  message?: string;
  data: Category;
}

export interface CategoryInput {
  name: string;
  slug: string;
}

/* =========================================================
   PUBLIC
========================================================= */

export const getCategories =
  async (): Promise<CategoryListResponse> => {
    const response =
      await fetch(
        `${API_URL}/categories`
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Failed to load categories"
      );
    }

    return result;
  };

/* =========================================================
   ADMIN - ALL
========================================================= */

export const getAdminCategories =
  async (): Promise<CategoryListResponse> => {
    const response =
      await authenticatedFetch(
        `${API_URL}/categories/admin/all`
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Failed to load categories"
      );
    }

    return result;
  };

/* =========================================================
   CREATE
========================================================= */

export const createCategory =
  async (
    input: CategoryInput
  ): Promise<Category> => {
    const response =
      await authenticatedFetch(
        `${API_URL}/categories`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            input
          ),
        }
      );

    const result:
      CategoryResponse =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Failed to create category"
      );
    }

    return result.data;
  };

/* =========================================================
   UPDATE
========================================================= */

export const updateCategory =
  async (
    id: string,
    input: Partial<
      CategoryInput & {
        isActive: boolean;
      }
    >
  ): Promise<Category> => {
    const response =
      await authenticatedFetch(
        `${API_URL}/categories/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            input
          ),
        }
      );

    const result:
      CategoryResponse =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Failed to update category"
      );
    }

    return result.data;
  };

/* =========================================================
   DEACTIVATE
========================================================= */

export const deactivateCategory =
  async (
    id: string
  ): Promise<Category> => {
    const response =
      await authenticatedFetch(
        `${API_URL}/categories/${id}`,
        {
          method: "DELETE",
        }
      );

    const result:
      CategoryResponse =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Failed to deactivate category"
      );
    }

    return result.data;
  };