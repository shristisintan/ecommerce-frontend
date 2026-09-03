import type {
  CategoryListResponse,
} from "../types/category";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

export const getCategories =
  async (): Promise<CategoryListResponse> => {
    const response = await fetch(
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