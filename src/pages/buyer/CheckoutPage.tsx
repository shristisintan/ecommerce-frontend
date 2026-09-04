import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
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
import Footer from "../../components/layout/Footer";
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
    icon: MapPin,
  },
  {
    id: 2,
    label: "Review",
    icon: Package,
  },
  {
    id: 3,
    label: "Payment",
    icon: CreditCard,
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

  const [
    createdOrderId,
    setCreatedOrderId,
  ] = useState<
    string | null
  >(null);

  const items =
    cart?.items ?? [];

  /* ======================================================
     DISPLAY TOTAL

     Backend remains authoritative.
  ====================================================== */

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
            item.productId.price *
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

  /* ======================================================
     LOCAL STORAGE PERSISTENCE
  ====================================================== */

  useEffect(() => {
    saveCheckoutData(
      formData
    );
  }, [formData]);

  /* ======================================================
     FIELD CHANGE
  ====================================================== */

  const handleFieldChange = (
    field:
      keyof ShippingAddress,
    value: string
  ) => {
    setFormData(
      (
        current
      ) => ({
        ...current,

        shippingAddress: {
          ...current.shippingAddress,

          [field]: value,
        },
      })
    );

    setErrors(
      (
        current
      ) => ({
        ...current,

        [field]:
          undefined,
      })
    );
  };

  /* ======================================================
     DELIVERY VALIDATION
  ====================================================== */

  const handleDeliverySubmit = (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const result =
      checkoutSchema.safeParse(
        formData
      );

    if (
      !result.success
    ) {
      const nextErrors:
        ShippingErrors = {};

      result.error.issues.forEach(
        (
          issue
        ) => {
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

    setFormData(
      result.data
    );

    setCurrentStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ======================================================
     STEP NAVIGATION
  ====================================================== */

  const goToPayment =
    () => {
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
        behavior: "smooth",
      });
    };

  const goToReview =
    () => {
      setCurrentStep(2);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  /* ======================================================
     ESEWA PAYMENT FLOW

     1. Validate checkout
     2. Create order once
     3. Backend calculates amount
     4. Backend signs eSewa request
     5. Browser redirects to eSewa
  ====================================================== */

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
         * Avoid duplicate orders
         * when payment initiation
         * is retried.
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

          localStorage.setItem(
            "pending_order_id",
            orderId
          );
        }

        const payment =
          await initiateEsewaPayment(
            orderId
          );

        submitEsewaPayment(
          payment.paymentUrl,
          payment.formData
        );
      } catch (
        paymentStartError
      ) {
        setPaymentError(
          paymentStartError instanceof
            Error
            ? paymentStartError.message
            : "Unable to start payment."
        );

        setPaymentLoading(
          false
        );
      }
    };

  /* ======================================================
     BUYER GUARD
  ====================================================== */

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

  /* ======================================================
     EMPTY CART GUARD
  ====================================================== */

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

  /* ======================================================
     SHARED INPUT CLASS
  ====================================================== */

  const inputClass = (
    hasError: boolean
  ) =>
    `h-12 w-full rounded-xl border bg-white px-4 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 ${
      hasError
        ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/10"
        : "border-border focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
    }`;

  /* ======================================================
     PAGE
  ====================================================== */

  return (
    <>
      <Header />

      <main className="min-h-screen bg-primary-50/50">
        <Container className="py-8 sm:py-10 lg:py-12">
          {/* Back */}

          <Link
            to="/cart"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition hover:text-brand-700"
          >
            <ArrowLeft
              size={16}
            />

            Back to Cart
          </Link>

          {/* Heading */}

          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Secure Checkout
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-primary-900 sm:text-4xl">
              Complete Your Order
            </h1>

            <p className="mt-2 text-sm text-primary-500">
              Delivery, review
              and secure payment
              in three simple
              steps.
            </p>
          </div>

          {/* =================================================
              STEP INDICATOR
          ================================================= */}

          <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-3">
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

                const Icon =
                  step.icon;

                return (
                  <div
                    key={
                      step.id
                    }
                    className={`rounded-xl border px-3 py-3 transition sm:px-4 sm:py-4 ${
                      active
                        ? "border-brand-300 bg-brand-50"
                        : complete
                          ? "border-border bg-white"
                          : "border-border bg-white/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          active
                            ? "bg-brand-600 text-white"
                            : complete
                              ? "bg-success text-white"
                              : "bg-primary-100 text-primary-400"
                        }`}
                      >
                        {complete ? (
                          <Check
                            size={14}
                          />
                        ) : (
                          <Icon
                            size={15}
                          />
                        )}
                      </div>

                      <div className="hidden sm:block">
                        <p
                          className={`text-[10px] font-bold uppercase tracking-[0.12em] ${
                            active
                              ? "text-brand-700"
                              : "text-primary-400"
                          }`}
                        >
                          Step{" "}
                          {index +
                            1}
                        </p>

                        <p
                          className={`mt-0.5 text-sm font-semibold ${
                            active
                              ? "text-primary-900"
                              : complete
                                ? "text-primary-700"
                                : "text-primary-400"
                          }`}
                        >
                          {
                            step.label
                          }
                        </p>
                      </div>

                      <span
                        className={`text-[11px] font-semibold sm:hidden ${
                          active
                            ? "text-brand-700"
                            : "text-primary-500"
                        }`}
                      >
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

          {/* =================================================
              STEP 1 - DELIVERY
          ================================================= */}

          {currentStep ===
            1 && (
            <div className="mx-auto max-w-[860px] overflow-hidden rounded-2xl border border-border bg-white">
              {/* Card heading */}

              <div className="border-b border-border px-6 py-6 sm:px-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <MapPin
                      size={20}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                      Delivery
                    </p>

                    <h2 className="mt-1 text-xl font-black text-primary-900 sm:text-2xl">
                      Delivery
                      Details
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-primary-500">
                      Enter the
                      address where
                      your order
                      should be
                      delivered.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={
                  handleDeliverySubmit
                }
                className="p-6 sm:p-8"
              >
                {/* Name / Phone */}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-semibold text-primary-800"
                    >
                      Full Name

                      <span className="ml-1 text-danger">
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
                      className={inputClass(
                        Boolean(
                          errors.fullName
                        )
                      )}
                    />

                    {errors.fullName && (
                      <p className="mt-2 text-xs font-medium text-danger">
                        {
                          errors.fullName
                        }
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-primary-800"
                    >
                      Phone Number

                      <span className="ml-1 text-danger">
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
                      className={inputClass(
                        Boolean(
                          errors.phone
                        )
                      )}
                    />

                    {errors.phone && (
                      <p className="mt-2 text-xs font-medium text-danger">
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
                    className="mb-2 block text-sm font-semibold text-primary-800"
                  >
                    Address

                    <span className="ml-1 text-danger">
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
                    className={inputClass(
                      Boolean(
                        errors.addressLine
                      )
                    )}
                  />

                  {errors.addressLine && (
                    <p className="mt-2 text-xs font-medium text-danger">
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
                      className="mb-2 block text-sm font-semibold text-primary-800"
                    >
                      City

                      <span className="ml-1 text-danger">
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
                      className={inputClass(
                        Boolean(
                          errors.city
                        )
                      )}
                    />

                    {errors.city && (
                      <p className="mt-2 text-xs font-medium text-danger">
                        {
                          errors.city
                        }
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="mb-2 block text-sm font-semibold text-primary-800"
                    >
                      Country

                      <span className="ml-1 text-danger">
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
                      className={inputClass(
                        Boolean(
                          errors.country
                        )
                      )}
                    />

                    {errors.country && (
                      <p className="mt-2 text-xs font-medium text-danger">
                        {
                          errors.country
                        }
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}

                <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
                  <Link
                    to="/cart"
                    className="text-sm font-semibold text-primary-500 transition hover:text-brand-700"
                  >
                    Return to Cart
                  </Link>

                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-7 text-sm font-semibold text-white transition hover:bg-brand-700 sm:w-auto"
                  >
                    Review Order

                    <ArrowRight
                      size={16}
                    />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =================================================
              STEP 2 - REVIEW
          ================================================= */}

          {currentStep ===
            2 && (
            <div className="grid items-start gap-7 lg:grid-cols-[1fr_370px] xl:grid-cols-[1fr_400px]">
              <div className="space-y-5">
                {/* Products */}

                <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                        Review
                      </p>

                      <h2 className="mt-1 text-xl font-black text-primary-900 sm:text-2xl">
                        Your Order
                      </h2>
                    </div>

                    <Link
                      to="/cart"
                      className="text-sm font-semibold text-primary-400 transition hover:text-brand-700"
                    >
                      Edit Cart
                    </Link>
                  </div>

                  <div className="divide-y divide-border">
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
                              <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
                                One product
                                is no
                                longer
                                available.
                              </div>
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
                              className="h-[88px] w-[82px] shrink-0 overflow-hidden rounded-xl bg-primary-50 sm:h-[100px] sm:w-[95px]"
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
                                <div className="flex h-full w-full items-center justify-center text-primary-300">
                                  <Package
                                    size={
                                      24
                                    }
                                  />
                                </div>
                              )}
                            </Link>

                            <div className="flex min-w-0 flex-1 justify-between gap-4">
                              <div>
                                <Link
                                  to={`/products/${product._id}`}
                                  className="line-clamp-2 text-sm font-semibold text-primary-900 transition hover:text-brand-700 sm:text-base"
                                >
                                  {
                                    product.name
                                  }
                                </Link>

                                <p className="mt-2 text-xs text-primary-400 sm:text-sm">
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

                              <p className="shrink-0 text-sm font-bold text-primary-900 sm:text-base">
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

                <section className="rounded-2xl border border-border bg-white p-6">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin
                          size={17}
                          className="text-brand-600"
                        />

                        <h3 className="text-sm font-bold text-primary-900">
                          Delivery
                          Information
                        </h3>
                      </div>

                      <p className="mt-4 font-semibold text-primary-900">
                        {
                          formData
                            .shippingAddress
                            .fullName
                        }
                      </p>

                      <p className="mt-1 text-sm leading-6 text-primary-500">
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

                      <p className="text-sm leading-6 text-primary-500">
                        {
                          formData
                            .shippingAddress
                            .country
                        }
                      </p>

                      <p className="mt-2 text-sm text-primary-500">
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
                      className="text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                    >
                      Edit
                    </button>
                  </div>
                </section>
              </div>

              {/* Summary */}

              <aside className="rounded-2xl border border-border bg-white p-6 lg:sticky lg:top-[115px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                  Summary
                </p>

                <h2 className="mt-2 text-xl font-black text-primary-900">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-500">
                      Products
                    </span>

                    <span className="font-semibold text-primary-800">
                      {itemCount}{" "}
                      {itemCount ===
                      1
                        ? "item"
                        : "items"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-500">
                      Subtotal
                    </span>

                    <span className="font-semibold text-primary-900">
                      NPR{" "}
                      {subtotal.toLocaleString(
                        "en-NP"
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-500">
                      Delivery
                    </span>

                    <span className="font-medium text-primary-700">
                      —
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px bg-border" />

                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm font-semibold text-primary-700">
                    Total
                  </span>

                  <span className="text-2xl font-black tracking-tight text-primary-900">
                    NPR{" "}
                    {subtotal.toLocaleString(
                      "en-NP"
                    )}
                  </span>
                </div>

                <div className="mt-5 flex gap-3 rounded-xl bg-brand-50 p-4">
                  <ShieldCheck
                    size={18}
                    className="shrink-0 text-brand-700"
                  />

                  <p className="text-xs leading-5 text-primary-600">
                    Price and stock
                    are verified
                    again by the
                    backend before
                    payment.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    goToPayment
                  }
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Continue to
                  Payment

                  <ArrowRight
                    size={16}
                  />
                </button>

                <button
                  type="button"
                  onClick={
                    goToDelivery
                  }
                  className="mt-4 w-full text-center text-sm font-semibold text-primary-400 transition hover:text-brand-700"
                >
                  Back to Delivery
                </button>
              </aside>
            </div>
          )}

          {/* =================================================
              STEP 3 - PAYMENT
          ================================================= */}

          {currentStep ===
            3 && (
            <div className="mx-auto max-w-[760px] overflow-hidden rounded-2xl border border-border bg-white">
              {/* Heading */}

              <div className="border-b border-border px-6 py-6 sm:px-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <CreditCard
                      size={20}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                      Payment
                    </p>

                    <h2 className="mt-1 text-xl font-black text-primary-900 sm:text-2xl">
                      Secure Payment
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-primary-500">
                      Complete your
                      purchase using
                      eSewa.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {/* Amount */}

                <div className="rounded-xl bg-primary-50 p-5">
                  <div className="flex items-end justify-between gap-5">
                    <span className="text-sm text-primary-500">
                      Order Amount
                    </span>

                    <span className="text-2xl font-black tracking-tight text-primary-900">
                      NPR{" "}
                      {subtotal.toLocaleString(
                        "en-NP"
                      )}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-primary-400">
                    The backend
                    recalculates and
                    verifies this
                    amount before
                    creating the
                    payment request.
                  </p>
                </div>

                {/* eSewa */}

                <div className="mt-6 rounded-xl border-2 border-[#60bb46] bg-[#f7fff5] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#60bb46] text-sm font-black text-white">
                      eS
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-primary-900">
                          eSewa
                        </h3>

                        <span className="rounded-full bg-[#60bb46] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                          Selected
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-primary-500">
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

                {/* Security */}

                <div className="mt-5 flex gap-3 rounded-xl border border-border p-4">
                  <ShieldCheck
                    size={20}
                    className="shrink-0 text-brand-700"
                  />

                  <div>
                    <p className="text-sm font-semibold text-primary-900">
                      Server verified
                      payment
                    </p>

                    <p className="mt-1 text-xs leading-5 text-primary-500">
                      Your order is
                      marked as paid
                      only after the
                      backend verifies
                      the eSewa
                      payment.
                    </p>
                  </div>
                </div>

                {/* Payment error */}

                {paymentError && (
                  <div className="mt-5 rounded-xl border border-danger/15 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
                    {
                      paymentError
                    }
                  </div>
                )}

                {/* Retry notice */}

                {createdOrderId &&
                  paymentError && (
                    <div className="mt-4 rounded-xl bg-warning-soft px-4 py-3 text-xs leading-5 text-warning">
                      Your order
                      already exists.
                      Retrying payment
                      will not create
                      another order.
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
                  className="mt-7 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#60bb46] px-7 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
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

                {/* Back */}

                {!createdOrderId && (
                  <button
                    type="button"
                    disabled={
                      paymentLoading
                    }
                    onClick={
                      goToReview
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-semibold text-primary-400 transition hover:text-brand-700 disabled:opacity-40"
                  >
                    <ArrowLeft
                      size={16}
                    />

                    Back to Review
                  </button>
                )}
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default CheckoutPage;