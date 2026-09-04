import type {
  EsewaFormData,
} from "../utils/esewaPayment";

import {
  authenticatedFetch,
} from "./apiClient";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

interface EsewaPaymentResponse {
  success: boolean;

  message?: string;

  data: {
    paymentId?: string;

    transactionUuid?: string;

    paymentUrl: string;

    formData: EsewaFormData;

    reused?: boolean;
  };
}

export const initiateEsewaPayment =
  async (
    orderId: string
  ): Promise<
    EsewaPaymentResponse["data"]
  > => {
    const response =
      await authenticatedFetch(
        `${API_URL}/payments/esewa/initiate`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              orderId,
            }),
        }
      );

    const result:
      EsewaPaymentResponse =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Unable to initiate eSewa payment."
      );
    }

    if (
      !result.data?.paymentUrl ||
      !result.data?.formData
    ) {
      throw new Error(
        "Invalid payment response from server."
      );
    }

    return result.data;
  };