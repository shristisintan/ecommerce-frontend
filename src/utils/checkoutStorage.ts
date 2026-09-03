import type {
  CheckoutFormData,
} from "../types/checkout";

const CHECKOUT_STORAGE_KEY =
  "checkout_form_data";

const defaultCheckoutData: CheckoutFormData = {
  shippingAddress: {
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    country: "Nepal",
  },
};

export const getStoredCheckoutData =
  (): CheckoutFormData => {
    try {
      const stored =
        localStorage.getItem(
          CHECKOUT_STORAGE_KEY
        );

      if (!stored) {
        return defaultCheckoutData;
      }

      const parsed =
        JSON.parse(
          stored
        ) as CheckoutFormData;

      return {
        shippingAddress: {
          ...defaultCheckoutData.shippingAddress,
          ...parsed.shippingAddress,
        },
      };
    } catch {
      return defaultCheckoutData;
    }
  };

export const saveCheckoutData = (
  data: CheckoutFormData
): void => {
  localStorage.setItem(
    CHECKOUT_STORAGE_KEY,
    JSON.stringify(data)
  );
};

export const clearCheckoutData =
  (): void => {
    localStorage.removeItem(
      CHECKOUT_STORAGE_KEY
    );
  };