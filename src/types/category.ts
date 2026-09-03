export interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface CategoryListResponse {
  success: boolean;
  data: Category[];
}