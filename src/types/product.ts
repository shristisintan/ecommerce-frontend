export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductTenant {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;

  name: string;
  slug: string;
  description: string;

  price: number;
  stock: number;

  images: string[];

  isActive: boolean;

  categoryId:
    | ProductCategory
    | string;

  tenantId:
    | ProductTenant
    | string;

  createdAt: string;
  updatedAt: string;
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  success: boolean;
  data: Product[];
  pagination: ProductPagination;
}

export interface ProductDetailResponse {
  success: boolean;
  data: Product;
}