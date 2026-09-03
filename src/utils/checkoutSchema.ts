import { z } from "zod";

export const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name is required")
      .max(100, "Full name is too long"),

    phone: z
      .string()
      .trim()
      .min(10, "Phone number is required")
      .max(20, "Phone number is too long")
      .regex(
        /^[0-9+\-\s]+$/,
        "Enter a valid phone number"
      ),

    addressLine: z
      .string()
      .trim()
      .min(3, "Address is required")
      .max(200, "Address is too long"),

    city: z
      .string()
      .trim()
      .min(2, "City is required")
      .max(100, "City is too long"),

    country: z
      .string()
      .trim()
      .min(2, "Country is required")
      .max(100, "Country is too long"),
  }),
});

export type CheckoutSchemaType =
  z.infer<typeof checkoutSchema>;