export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  country: string;
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
}