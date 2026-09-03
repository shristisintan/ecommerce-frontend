import {
  ArrowLeft,
  ArrowRight,
  Check,
  Package,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  Navigate,
} from "react-router-dom";

import Header from "../../components/layout/Header";
import Container from "../../components/common/Container";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useCart,
} from "../../context/CartContext";

import {
  createOrder,
} from "../../api/orderApi";

import {
  initiateEsewaPayment,
} from "../../api/paymentApi";

import {
  submitEsewaPayment,
} from "../../utils/esewaPayment";

import type {
  CheckoutFormData,
  ShippingAddress,
} from "../../types/checkout";

import {
  getStoredCheckoutData,
  saveCheckoutData,
} from "../../utils/checkoutStorage";

import {
  checkoutSchema,
} from "../../utils/checkoutSchema";

type CheckoutStep =
  | 1
  | 2
  | 3;

type ShippingErrors =
  Partial<
    Record<
      keyof ShippingAddress,
      string
    >
  >;

const steps = [
  {
    id: 1,
    label: "Delivery",
  },
  {
    id: 2,
    label: "Review",
  },
  {
    id: 3,
    label: "Payment",
  },
];

const CheckoutPage = () => {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const {
    cart,
    loading: cartLoading,
  } = useCart();

  const [
    currentStep,
    setCurrentStep,
  ] =
    useState<CheckoutStep>(
      1
    );

  const [
    formData,
    setFormData,
  ] =
    useState<CheckoutFormData>(
      () =>
        getStoredCheckoutData()
    );

  const [
    errors,
    setErrors,
  ] =
    useState<ShippingErrors>(
      {}
    );

  const [
    paymentLoading,
    setPaymentLoading,
  ] =
    useState(false);

  const [
    paymentError,
    setPaymentError,
  ] = useState("");

  /*
   * Once an order has been
   * created, reuse its ID if
   * payment initiation needs
   * to be retried.
   *
   * This prevents creating
   * duplicate pending orders.
   */
  const [
    createdOrderId,
    setCreatedOrderId,
  ] = useState<
    string | null
  >(null);

  const items =
    cart?.items ?? [];

  /*
   * DISPLAY TOTAL ONLY.
   *
   * Backend calculates the
   * authoritative amount again
   * from MongoDB.
   */
  const subtotal =
    useMemo(() => {
      return items.reduce(
        (
          total,
          item
        ) => {
          if (
            typeof item.productId ===
            "string"
          ) {
            return total;
          }

          return (
            total +
            item.productId
              .price *
              item.quantity
          );
        },
        0
      );
    }, [items]);

  const itemCount =
    useMemo(() => {
      return items.reduce(
        (
          total,
          item
        ) =>
          total +
          item.quantity,
        0
      );
    }, [items]);

  /*
   * Automatically save
   * checkout fields.
   */
  useEffect(() => {
    saveCheckoutData(
      formData
    );
  }, [formData]);

  const handleFieldChange = (
    field:
      keyof ShippingAddress,
    value: string
  ) => {
    setFormData(
      (current) => ({
        ...current,

        shippingAddress: {
          ...current.shippingAddress,

          [field]: value,
        },
      })
    );

    setErrors(
      (current) => ({
        ...current,

        [field]:
          undefined,
      })
    );
  };

  const handleDeliverySubmit = (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const result =
      checkoutSchema.safeParse(
        formData
      );

    if (!result.success) {
      const nextErrors:
        ShippingErrors = {};

      result.error.issues.forEach(
        (issue) => {
          const field =
            issue.path[1] as
              | keyof ShippingAddress
              | undefined;

          if (
            field &&
            !nextErrors[
              field
            ]
          ) {
            nextErrors[
              field
            ] =
              issue.message;
          }
        }
      );

      setErrors(
        nextErrors
      );

      return;
    }

    setErrors({});

    /*
     * result.data contains
     * Zod-validated and
     * trimmed values.
     */
    setFormData(
      result.data
    );

    setCurrentStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToPayment = () => {
    setPaymentError("");

    setCurrentStep(3);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToDelivery =
    () => {
      setCurrentStep(1);

      window.scrollTo({
        top: 0,
        behavior:
          "smooth",
      });
    };

  const goToReview =
    () => {
      setCurrentStep(2);

      window.scrollTo({
        top: 0,
        behavior:
          "smooth",
      });
    };

  /*
   * REAL CHECKOUT FLOW
   *
   * 1. Validate address
   * 2. Create order
   * 3. Backend calculates price
   * 4. Initiate eSewa
   * 5. Backend signs request
   * 6. Submit form to eSewa
   */
  const handleEsewaPayment =
    async () => {
      if (
        paymentLoading
      ) {
        return;
      }

      try {
        setPaymentLoading(
          true
        );

        setPaymentError(
          ""
        );

        /*
         * Final frontend
         * validation.
         */
        const validation =
          checkoutSchema.safeParse(
            formData
          );

        if (
          !validation.success
        ) {
          setCurrentStep(
            1
          );

          throw new Error(
            "Please check your delivery information."
          );
        }

        let orderId =
          createdOrderId;

        /*
         * Create the backend
         * order only once.
         */
        if (!orderId) {
          const order =
            await createOrder(
              validation.data
                .shippingAddress
            );

          orderId =
            order._id;

          setCreatedOrderId(
            orderId
          );

          /*
           * Useful after returning
           * from eSewa and for
           * payment recovery.
           */
          localStorage.setItem(
            "pending_order_id",
            orderId
          );
        }

        /*
         * Backend creates the
         * signed eSewa request.
         */
        const payment =
          await initiateEsewaPayment(
            orderId
          );

        /*
         * Redirect browser to
         * real eSewa UAT form.
         */
        submitEsewaPayment(
          payment.paymentUrl,
          payment.formData
        );
      } catch (error) {
        setPaymentError(
          error instanceof Error
            ? error.message
            : "Unable to start payment."
        );

        setPaymentLoading(
          false
        );
      }
    };

  /*
   * Buyer-only route.
   */
  if (
    !authLoading &&
    (!isAuthenticated ||
      user?.role !==
        "BUYER")
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /*
   * Empty cart cannot
   * enter checkout.
   */
  if (
    !cartLoading &&
    cart &&
    cart.items.length ===
      0 &&
    !createdOrderId
  ) {
    return (
      <Navigate
        to="/cart"
        replace
      />
    );
  }

  return (
    <>
      <Header />

      <main className="bg-white">
        <Container className="py-10 lg:py-14">
          {/* Back */}

          <Link
            to="/cart"
            className="mb-8 inline-flex items-center gap-2 text-sm text-black/50 transition hover:text-black"
          >
            <ArrowLeft
              size={16}
            />

            Back to cart
          </Link>

          {/* Heading */}

          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40">
              Secure checkout
            </p>

            <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.04em] sm:text-5xl">
              Checkout
            </h1>
          </div>

          {/* Step Indicator */}

          <div className="mb-10 grid grid-cols-3 gap-3">
            {steps.map(
              (
                step,
                index
              ) => {
                const active =
                  currentStep ===
                  step.id;

                const complete =
                  currentStep >
                  step.id;

                return (
                  <div
                    key={
                      step.id
                    }
                  >
                    <div
                      className={`flex items-center gap-3 rounded-2xl border px-3 py-4 transition sm:px-4 ${
                        active
                          ? "border-black bg-black text-white"
                          : complete
                            ? "border-black/10 bg-[#f4f4f4]"
                            : "border-black/10 bg-white text-black/40"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          active
                            ? "bg-white text-black"
                            : complete
                              ? "bg-black text-white"
                              : "bg-[#f0f0f0]"
                        }`}
                      >
                        {complete ? (
                          <Check
                            size={
                              15
                            }
                          />
                        ) : (
                          step.id
                        )}
                      </div>

                      <div className="hidden sm:block">
                        <p className="text-xs uppercase tracking-[0.1em] opacity-60">
                          Step{" "}
                          {index +
                            1}
                        </p>

                        <p className="mt-0.5 text-sm font-semibold">
                          {
                            step.label
                          }
                        </p>
                      </div>

                      <span className="text-xs font-semibold sm:hidden">
                        {
                          step.label
                        }
                      </span>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* =====================
              STEP 1
              DELIVERY
          ====================== */}

          {currentStep ===
            1 && (
            <div className="mx-auto max-w-[850px] rounded-[24px] border border-black/10 p-6 sm:p-8 lg:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                  Step 1
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Delivery
                  Details
                </h2>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  Enter the
                  address where
                  you want your
                  order
                  delivered.
                </p>
              </div>

              <form
                onSubmit={
                  handleDeliverySubmit
                }
                className="mt-8"
              >
                {/* Name / Phone */}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium"
                    >
                      Full name

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      value={
                        formData
                          .shippingAddress
                          .fullName
                      }
                      onChange={(
                        event
                      ) =>
                        handleFieldChange(
                          "fullName",
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Enter your full name"
                      className={`h-13 w-full rounded-2xl border px-4 text-sm outline-none transition ${
                        errors.fullName
                          ? "border-red-400"
                          : "border-black/10 focus:border-black/40"
                      }`}
                    />

                    {errors.fullName && (
                      <p className="mt-2 text-xs text-red-500">
                        {
                          errors.fullName
                        }
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium"
                    >
                      Phone
                      number

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={
                        formData
                          .shippingAddress
                          .phone
                      }
                      onChange={(
                        event
                      ) =>
                        handleFieldChange(
                          "phone",
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="98XXXXXXXX"
                      className={`h-13 w-full rounded-2xl border px-4 text-sm outline-none transition ${
                        errors.phone
                          ? "border-red-400"
                          : "border-black/10 focus:border-black/40"
                      }`}
                    />

                    {errors.phone && (
                      <p className="mt-2 text-xs text-red-500">
                        {
                          errors.phone
                        }
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}

                <div className="mt-5">
                  <label
                    htmlFor="addressLine"
                    className="mb-2 block text-sm font-medium"
                  >
                    Address

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="addressLine"
                    type="text"
                    autoComplete="street-address"
                    value={
                      formData
                        .shippingAddress
                        .addressLine
                    }
                    onChange={(
                      event
                    ) =>
                      handleFieldChange(
                        "addressLine",
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Street, ward, area or landmark"
                    className={`h-13 w-full rounded-2xl border px-4 text-sm outline-none transition ${
                      errors.addressLine
                        ? "border-red-400"
                        : "border-black/10 focus:border-black/40"
                    }`}
                  />

                  {errors.addressLine && (
                    <p className="mt-2 text-xs text-red-500">
                      {
                        errors.addressLine
                      }
                    </p>
                  )}
                </div>

                {/* City / Country */}

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium"
                    >
                      City

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      id="city"
                      type="text"
                      autoComplete="address-level2"
                      value={
                        formData
                          .shippingAddress
                          .city
                      }
                      onChange={(
                        event
                      ) =>
                        handleFieldChange(
                          "city",
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Kathmandu"
                      className={`h-13 w-full rounded-2xl border px-4 text-sm outline-none transition ${
                        errors.city
                          ? "border-red-400"
                          : "border-black/10 focus:border-black/40"
                      }`}
                    />

                    {errors.city && (
                      <p className="mt-2 text-xs text-red-500">
                        {
                          errors.city
                        }
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="mb-2 block text-sm font-medium"
                    >
                      Country

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      id="country"
                      type="text"
                      autoComplete="country-name"
                      value={
                        formData
                          .shippingAddress
                          .country
                      }
                      onChange={(
                        event
                      ) =>
                        handleFieldChange(
                          "country",
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Nepal"
                      className={`h-13 w-full rounded-2xl border px-4 text-sm outline-none transition ${
                        errors.country
                          ? "border-red-400"
                          : "border-black/10 focus:border-black/40"
                      }`}
                    />

                    {errors.country && (
                      <p className="mt-2 text-xs text-red-500">
                        {
                          errors.country
                        }
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}

                <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-black/10 pt-7 sm:flex-row">
                  <Link
                    to="/cart"
                    className="text-sm font-medium text-black/50 transition hover:text-black"
                  >
                    Return to
                    cart
                  </Link>

                  <button
                    type="submit"
                    className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-black px-8 text-sm font-semibold text-white transition hover:bg-black/80 sm:w-auto"
                  >
                    Review Order

                    <ArrowRight
                      size={17}
                    />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =====================
              STEP 2
              REVIEW
          ====================== */}

          {currentStep ===
            2 && (
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
              <div className="space-y-6">
                {/* Products */}

                <section className="rounded-[24px] border border-black/10 p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                        Step 2
                      </p>

                      <h2 className="mt-2 text-2xl font-bold">
                        Review
                        Order
                      </h2>
                    </div>

                    <Link
                      to="/cart"
                      className="text-sm font-medium text-black/45 transition hover:text-black"
                    >
                      Edit cart
                    </Link>
                  </div>

                  <div className="divide-y divide-black/10">
                    {items.map(
                      (
                        item,
                        index
                      ) => {
                        if (
                          typeof item.productId ===
                          "string"
                        ) {
                          return (
                            <div
                              key={`${item.productId}-${index}`}
                              className="py-5"
                            >
                              <p className="text-sm text-red-500">
                                One
                                product
                                is no
                                longer
                                available.
                              </p>
                            </div>
                          );
                        }

                        const product =
                          item.productId;

                        const image =
                          product
                            .images?.[0];

                        const lineTotal =
                          product.price *
                          item.quantity;

                        return (
                          <article
                            key={
                              product._id
                            }
                            className="flex gap-4 py-5 first:pt-0 last:pb-0"
                          >
                            <Link
                              to={`/products/${product._id}`}
                              className="h-[90px] w-[85px] shrink-0 overflow-hidden rounded-[14px] bg-[#f0f0f0] sm:h-[105px] sm:w-[100px]"
                            >
                              {image ? (
                                <img
                                  src={
                                    image
                                  }
                                  alt={
                                    product.name
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-black/20">
                                  <Package
                                    size={
                                      25
                                    }
                                  />
                                </div>
                              )}
                            </Link>

                            <div className="flex min-w-0 flex-1 justify-between gap-4">
                              <div>
                                <Link
                                  to={`/products/${product._id}`}
                                  className="line-clamp-2 font-semibold"
                                >
                                  {
                                    product.name
                                  }
                                </Link>

                                <p className="mt-2 text-sm text-black/45">
                                  NPR{" "}
                                  {product.price.toLocaleString(
                                    "en-NP"
                                  )}{" "}
                                  ×{" "}
                                  {
                                    item.quantity
                                  }
                                </p>
                              </div>

                              <p className="shrink-0 font-bold">
                                NPR{" "}
                                {lineTotal.toLocaleString(
                                  "en-NP"
                                )}
                              </p>
                            </div>
                          </article>
                        );
                      }
                    )}
                  </div>
                </section>

                {/* Delivery */}

                <section className="rounded-[24px] border border-black/10 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">
                        Delivery
                        Information
                      </p>

                      <p className="mt-4 font-medium">
                        {
                          formData
                            .shippingAddress
                            .fullName
                        }
                      </p>

                      <p className="mt-1 text-sm leading-6 text-black/55">
                        {
                          formData
                            .shippingAddress
                            .addressLine
                        }
                        ,{" "}
                        {
                          formData
                            .shippingAddress
                            .city
                        }
                      </p>

                      <p className="text-sm leading-6 text-black/55">
                        {
                          formData
                            .shippingAddress
                            .country
                        }
                      </p>

                      <p className="mt-2 text-sm text-black/55">
                        {
                          formData
                            .shippingAddress
                            .phone
                        }
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        goToDelivery
                      }
                      className="text-sm font-medium underline underline-offset-4"
                    >
                      Edit
                    </button>
                  </div>
                </section>
              </div>

              {/* Summary */}

              <aside className="rounded-[24px] border border-black/10 p-6 lg:sticky lg:top-6">
                <h2 className="text-xl font-bold">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/55">
                      Products
                    </span>

                    <span>
                      {itemCount}{" "}
                      {itemCount ===
                      1
                        ? "item"
                        : "items"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/55">
                      Subtotal
                    </span>

                    <span className="font-medium">
                      NPR{" "}
                      {subtotal.toLocaleString(
                        "en-NP"
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/55">
                      Delivery
                    </span>

                    <span className="font-medium">
                      —
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px bg-black/10" />

                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    Total
                  </span>

                  <span className="text-2xl font-bold">
                    NPR{" "}
                    {subtotal.toLocaleString(
                      "en-NP"
                    )}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-black/40">
                  Final prices
                  and stock are
                  validated again
                  by the server
                  before payment.
                </p>

                <button
                  type="button"
                  onClick={
                    goToPayment
                  }
                  className="mt-7 flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80"
                >
                  Continue to
                  Payment

                  <ArrowRight
                    size={17}
                  />
                </button>

                <button
                  type="button"
                  onClick={
                    goToDelivery
                  }
                  className="mt-4 w-full text-center text-sm font-medium text-black/50 transition hover:text-black"
                >
                  Back to
                  delivery
                </button>
              </aside>
            </div>
          )}

          {/* =====================
              STEP 3
              PAYMENT
          ====================== */}

          {currentStep ===
            3 && (
            <div className="mx-auto max-w-[850px] rounded-[24px] border border-black/10 p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                Step 3
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Payment
              </h2>

              <p className="mt-3 text-sm leading-6 text-black/50">
                Complete your
                purchase securely
                using eSewa.
              </p>

              {/* Total */}

              <div className="mt-7 rounded-2xl bg-[#f7f7f7] p-5">
                <div className="flex items-center justify-between gap-5">
                  <span className="text-sm text-black/55">
                    Order amount
                  </span>

                  <span className="text-xl font-bold">
                    NPR{" "}
                    {subtotal.toLocaleString(
                      "en-NP"
                    )}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-black/40">
                  The backend
                  calculates and
                  verifies the
                  final amount
                  before creating
                  the eSewa
                  payment.
                </p>
              </div>

              {/* Payment option */}

              <div className="mt-6 rounded-[20px] border-2 border-black p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f3f3f3] text-sm font-black">
                    eS
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        eSewa
                      </h3>

                      <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                        Selected
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-black/50">
                      You will be
                      redirected to
                      eSewa to
                      securely
                      complete your
                      payment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment error */}

              {paymentError && (
                <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {
                    paymentError
                  }
                </div>
              )}

              {/* If order already
                  exists after an
                  initiation error */}

              {createdOrderId &&
                paymentError && (
                  <div className="mt-4 rounded-2xl bg-[#f7f7f7] px-4 py-3 text-xs leading-5 text-black/50">
                    Your order was
                    already
                    created. Retry
                    payment without
                    creating another
                    order.
                  </div>
                )}

              {/* Pay */}

              <button
                type="button"
                disabled={
                  paymentLoading
                }
                onClick={() =>
                  void handleEsewaPayment()
                }
                className="mt-7 flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-black px-7 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paymentLoading
                  ? "Redirecting to eSewa..."
                  : createdOrderId &&
                      paymentError
                    ? "Retry eSewa Payment"
                    : `Pay NPR ${subtotal.toLocaleString(
                        "en-NP"
                      )} with eSewa`}
              </button>

              {/* Back is safe
                  only before order
                  has been created */}

              {!createdOrderId && (
                <button
                  type="button"
                  disabled={
                    paymentLoading
                  }
                  onClick={
                    goToReview
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-medium text-black/50 transition hover:text-black disabled:opacity-40"
                >
                  <ArrowLeft
                    size={16}
                  />

                  Back to
                  review
                </button>
              )}
            </div>
          )}
        </Container>
      </main>
    </>
  );
};

export default CheckoutPage;