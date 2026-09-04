export type UserRole =
  | "ADMIN"
  | "MERCHANT"
  | "BUYER";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string | null;
  isActive?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterBuyerInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterMerchantInput {
  name: string;
  email: string;
  password: string;

  storeName: string;
  storeSlug: string;
}

export interface AuthData {
  accessToken: string;
  user?: AuthUser;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}