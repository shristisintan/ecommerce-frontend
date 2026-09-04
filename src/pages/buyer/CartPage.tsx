import {
  ArrowRight,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import {
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
  useCart,
} from "../../context/CartContext";

import {
  useAuth,
} from "../../context/AuthContext";

import type {
  Product,
} from "../../types/product";

const CartPage = () => {
  const {
    user,
    loading: authLoading,
    isAuthenticated,
  } = useAuth();

  const {
    cart,
    loading,
    itemCount,
    updateItem,
    removeItem,
    clear,
  } = useCart();

  const [
    busyProductId,
    setBusyProductId,
  ] =
    useState<string | null>(
      null
    );

  const [
    clearing,
    setClearing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const items =
    cart?.items ?? [];

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

  /* ======================================================
     QUANTITY
  ====================================================== */

  const handleQuantity =
    async (
      product: Product,
      quantity: number
    ) => {
      if (
        quantity < 1 ||
        quantity >
          product.stock
      ) {
        return;
      }

      try {
        setError("");

        setBusyProductId(
          product._id
        );

        await updateItem(
          product._id,
          quantity
        );
      } catch (
        updateError
      ) {
        setError(
          updateError instanceof
            Error
            ? updateError.message
            : "Unable to update cart."
        );
      } finally {
        setBusyProductId(
          null
        );
      }
    };

  /* ======================================================
     REMOVE
  ====================================================== */

  const handleRemove =
    async (
      productId: string
    ) => {
      try {
        setError("");

        setBusyProductId(
          productId
        );

        await removeItem(
          productId
        );
      } catch (
        removeError
      ) {
        setError(
          removeError instanceof
            Error
            ? removeError.message
            : "Unable to remove item."
        );
      } finally {
        setBusyProductId(
          null
        );
      }
    };

  /* ======================================================
     CLEAR CART
  ====================================================== */

  const handleClear =
    async () => {
      try {
        setError("");

        setClearing(true);

        await clear();
      } catch (
        clearError
      ) {
        setError(
          clearError instanceof
            Error
            ? clearError.message
            : "Unable to clear cart."
        );
      } finally {
        setClearing(false);
      }
    };

  /* ======================================================
     AUTH GUARD
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

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <Container className="py-8 sm:py-10 lg:py-12">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
                Shopping Bag
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-primary-900 sm:text-4xl">
                Your Cart
              </h1>

              <p className="mt-2 text-sm text-primary-500">
                Review your
                products before
                checkout.
              </p>
            </div>

            {items.length >
              0 && (
              <button
                type="button"
                disabled={
                  clearing
                }
                onClick={() =>
                  void handleClear()
                }
                className="text-sm font-semibold text-primary-400 transition hover:text-danger disabled:opacity-40"
              >
                {clearing
                  ? "Clearing..."
                  : "Clear Cart"}
              </button>
            )}
          </div>

          {/* Error */}

          {error && (
            <div className="mb-6 rounded-xl border border-danger/15 bg-danger-soft px-5 py-4 text-sm font-medium text-danger">
              {error}
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================= */}

          {(loading ||
            authLoading) && (
            <div className="grid animate-pulse gap-7 lg:grid-cols-[1fr_370px]">
              <div className="h-[420px] rounded-2xl bg-primary-100" />

              <div className="h-[330px] rounded-2xl bg-primary-100" />
            </div>
          )}

          {/* =================================================
              EMPTY CART
          ================================================= */}

          {!loading &&
            !authLoading &&
            items.length ===
              0 && (
              <div className="flex min-h-[430px] flex-col items-center justify-center rounded-2xl border border-border bg-primary-50 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <ShoppingBag
                    size={28}
                  />
                </div>

                <h2 className="mt-6 text-2xl font-black tracking-tight text-primary-900">
                  Your cart is
                  empty
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-primary-500">
                  Explore products
                  from stores across
                  the NOVA
                  marketplace.
                </p>

                <Link
                  to="/products"
                  className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-brand-600 px-7 text-sm font-semibold !text-white transition hover:bg-brand-700"
                >
                  Continue Shopping

                  <ArrowRight
                    size={16}
                  />
                </Link>
              </div>
            )}

          {/* =================================================
              CART
          ================================================= */}

          {!loading &&
            !authLoading &&
            items.length >
              0 && (
              <div className="grid items-start gap-7 lg:grid-cols-[1fr_370px] xl:grid-cols-[1fr_400px]">
                {/* ===========================================
                    CART ITEMS
                =========================================== */}

                <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-base font-bold text-primary-900">
                      Cart Items
                    </h2>

                    <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-500">
                      {itemCount}{" "}
                      {itemCount ===
                      1
                        ? "item"
                        : "items"}
                    </span>
                  </div>

                  <div className="divide-y divide-border">
                    {items.map(
                      (
                        item,
                        index
                      ) => {
                        /* Missing/deleted product */

                        if (
                          typeof item.productId ===
                          "string"
                        ) {
                          return (
                            <div
                              key={`${item.productId}-${index}`}
                              className="py-6"
                            >
                              <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
                                This
                                product
                                is no
                                longer
                                available.
                              </div>
                            </div>
                          );
                        }

                        const product =
                          item.productId;

                        const busy =
                          busyProductId ===
                          product._id;

                        const image =
                          product
                            .images?.[0];

                        return (
                          <article
                            key={
                              product._id
                            }
                            className="flex gap-4 py-6 first:pt-0 last:pb-0 sm:gap-5"
                          >
                            {/* Image */}

                            <Link
                              to={`/products/${product._id}`}
                              className="h-[105px] w-[95px] shrink-0 overflow-hidden rounded-xl bg-primary-50 sm:h-[120px] sm:w-[110px]"
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
                                      28
                                    }
                                  />
                                </div>
                              )}
                            </Link>

                            {/* Information */}

                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <Link
                                    to={`/products/${product._id}`}
                                    className="line-clamp-2 text-sm font-semibold leading-5 text-primary-900 transition hover:text-brand-700 sm:text-base"
                                  >
                                    {
                                      product.name
                                    }
                                  </Link>

                                  <p className="mt-1 text-xs text-primary-400">
                                    {
                                      product.stock
                                    }{" "}
                                    available
                                  </p>

                                  <p className="mt-1 text-xs text-primary-400">
                                    NPR{" "}
                                    {product.price.toLocaleString(
                                      "en-NP"
                                    )}{" "}
                                    each
                                  </p>
                                </div>

                                {/* Remove */}

                                <button
                                  type="button"
                                  disabled={
                                    busy
                                  }
                                  aria-label="Remove item"
                                  title="Remove"
                                  onClick={() =>
                                    void handleRemove(
                                      product._id
                                    )
                                  }
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-primary-400 transition hover:bg-danger-soft hover:text-danger disabled:opacity-40"
                                >
                                  <Trash2
                                    size={
                                      17
                                    }
                                  />
                                </button>
                              </div>

                              {/* Bottom row */}

                              <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-4">
                                <p className="text-lg font-black tracking-tight text-primary-900">
                                  NPR{" "}
                                  {(
                                    product.price *
                                    item.quantity
                                  ).toLocaleString(
                                    "en-NP"
                                  )}
                                </p>

                                {/* Quantity */}

                                <div className="flex h-10 items-center gap-4 rounded-full bg-primary-50 px-3">
                                  <button
                                    type="button"
                                    aria-label="Decrease quantity"
                                    disabled={
                                      busy ||
                                      item.quantity <=
                                        1
                                    }
                                    onClick={() =>
                                      void handleQuantity(
                                        product,
                                        item.quantity -
                                          1
                                      )
                                    }
                                    className="flex h-7 w-7 items-center justify-center rounded-full text-primary-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                                  >
                                    <Minus
                                      size={
                                        14
                                      }
                                    />
                                  </button>

                                  <span className="min-w-4 text-center text-sm font-bold text-primary-900">
                                    {
                                      item.quantity
                                    }
                                  </span>

                                  <button
                                    type="button"
                                    aria-label="Increase quantity"
                                    disabled={
                                      busy ||
                                      item.quantity >=
                                        product.stock
                                    }
                                    onClick={() =>
                                      void handleQuantity(
                                        product,
                                        item.quantity +
                                          1
                                      )
                                    }
                                    className="flex h-7 w-7 items-center justify-center rounded-full text-primary-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                                  >
                                    <Plus
                                      size={
                                        14
                                      }
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      }
                    )}
                  </div>
                </section>

                {/* ===========================================
                    ORDER SUMMARY
                =========================================== */}

                <aside className="rounded-2xl border border-border bg-white p-6 lg:sticky lg:top-[115px]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
                    Summary
                  </p>

                  <h2 className="mt-2 text-xl font-black text-primary-900">
                    Order Summary
                  </h2>

                  <div className="mt-6 space-y-4">
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

                    <div className="flex items-start justify-between gap-4 text-sm">
                      <span className="text-primary-500">
                        Delivery
                      </span>

                      <span className="text-right font-medium text-primary-700">
                        Calculated at
                        checkout
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

                  <Link
                    to="/checkout"
                    className="mt-7 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold !text-white transition hover:bg-brand-700"
                  >
                    Go to Checkout

                    <ArrowRight
                      size={17}
                    />
                  </Link>

                  <Link
                    to="/products"
                    className="mt-4 block text-center text-sm font-semibold text-primary-500 transition hover:text-brand-700"
                  >
                    Continue Shopping
                  </Link>

                  {/* Security */}

                  <div className="mt-6 flex gap-3 rounded-xl bg-brand-50 p-4">
                    <ShieldCheck
                      size={19}
                      className="mt-0.5 shrink-0 text-brand-700"
                    />

                    <p className="text-xs leading-5 text-primary-600">
                      Product
                      pricing and
                      stock are
                      verified again
                      during
                      checkout.
                    </p>
                  </div>
                </aside>
              </div>
            )}
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default CartPage;