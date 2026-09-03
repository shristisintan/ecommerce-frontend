import {
  ArrowRight,
  Minus,
  Package,
  Plus,
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
  ] = useState<string | null>(
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
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to update cart."
        );
      } finally {
        setBusyProductId(null);
      }
    };

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
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to remove item."
        );
      } finally {
        setBusyProductId(null);
      }
    };

  const handleClear =
    async () => {
      try {
        setError("");
        setClearing(true);

        await clear();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to clear cart."
        );
      } finally {
        setClearing(false);
      }
    };

  if (
    !authLoading &&
    (!isAuthenticated ||
      user?.role !== "BUYER")
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

      <main className="bg-white">
        <Container className="py-10 lg:py-14">
          {/* Heading */}
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40">
                Your shopping bag
              </p>

              <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.04em] sm:text-5xl">
                Your Cart
              </h1>
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
                className="text-sm font-medium text-black/45 transition hover:text-black disabled:opacity-40"
              >
                {clearing
                  ? "Clearing..."
                  : "Clear cart"}
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Loading */}
          {(loading ||
            authLoading) && (
            <div className="grid animate-pulse gap-8 lg:grid-cols-[1fr_380px]">
              <div className="h-[420px] rounded-[24px] bg-black/5" />

              <div className="h-[330px] rounded-[24px] bg-black/5" />
            </div>
          )}

          {/* Empty Cart */}
          {!loading &&
            !authLoading &&
            items.length ===
              0 && (
              <div className="flex min-h-[460px] flex-col items-center justify-center rounded-[28px] bg-[#f7f7f7] px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <ShoppingBag
                    size={28}
                  />
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  Your cart is
                  empty
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-black/50">
                  Explore our
                  marketplace and
                  add something you
                  like.
                </p>

                <Link
                  to="/products"
                  className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-black px-7 text-sm font-medium !text-white"
                >
                  Continue Shopping

                  <ArrowRight
                    size={16}
                  />
                </Link>
              </div>
            )}

          {/* Cart */}
          {!loading &&
            !authLoading &&
            items.length >
              0 && (
              <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
                {/* Cart items */}
                <section className="rounded-[24px] border border-black/10 p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-semibold">
                      Items
                    </h2>

                    <span className="text-sm text-black/45">
                      {itemCount}{" "}
                      {itemCount ===
                      1
                        ? "item"
                        : "items"}
                    </span>
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
                              className="py-6"
                            >
                              <p className="text-sm text-black/50">
                                This
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
                              className="h-[110px] w-[100px] shrink-0 overflow-hidden rounded-[16px] bg-[#f0f0f0] sm:h-[125px] sm:w-[115px]"
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
                                      28
                                    }
                                  />
                                </div>
                              )}
                            </Link>

                            {/* Info */}
                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <Link
                                    to={`/products/${product._id}`}
                                    className="line-clamp-2 font-semibold leading-5"
                                  >
                                    {
                                      product.name
                                    }
                                  </Link>

                                  <p className="mt-1 text-xs text-black/45">
                                    {
                                      product.stock
                                    }{" "}
                                    available
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  disabled={
                                    busy
                                  }
                                  aria-label="Remove item"
                                  onClick={() =>
                                    void handleRemove(
                                      product._id
                                    )
                                  }
                                  className="shrink-0 text-red-500 transition hover:text-red-700 disabled:opacity-40"
                                >
                                  <Trash2
                                    size={
                                      18
                                    }
                                  />
                                </button>
                              </div>

                              <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-4">
                                <p className="text-lg font-bold">
                                  NPR{" "}
                                  {(
                                    product.price *
                                    item.quantity
                                  ).toLocaleString(
                                    "en-NP"
                                  )}
                                </p>

                                {/* Quantity */}
                                <div className="flex h-10 items-center gap-5 rounded-full bg-[#f0f0f0] px-4">
                                  <button
                                    type="button"
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
                                    className="disabled:opacity-30"
                                  >
                                    <Minus
                                      size={
                                        15
                                      }
                                    />
                                  </button>

                                  <span className="min-w-4 text-center text-sm font-medium">
                                    {
                                      item.quantity
                                    }
                                  </span>

                                  <button
                                    type="button"
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
                                    className="disabled:opacity-30"
                                  >
                                    <Plus
                                      size={
                                        15
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

                {/* Order Summary */}
                <aside className="rounded-[24px] border border-black/10 p-6 lg:sticky lg:top-6">
                  <h2 className="text-xl font-bold">
                    Order Summary
                  </h2>

                  <div className="mt-6 space-y-4">
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
                        Calculated
                        at checkout
                      </span>
                    </div>
                  </div>

                  <div className="my-6 h-px bg-black/10" />

                  <div className="flex items-center justify-between">
                    <span>
                      Total
                    </span>

                    <span className="text-2xl font-bold">
                      NPR{" "}
                      {subtotal.toLocaleString(
                        "en-NP"
                      )}
                    </span>
                  </div>

                  <Link
                    to="/checkout"
                    className="mt-7 flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-semibold !text-white transition hover:bg-black/80"
                  >
                    Go to Checkout

                    <ArrowRight
                      size={17}
                    />
                  </Link>

                  <Link
                    to="/products"
                    className="mt-4 block text-center text-sm font-medium text-black/50 transition hover:text-black"
                  >
                    Continue shopping
                  </Link>

                  <p className="mt-6 text-xs leading-5 text-black/40">
                    Final pricing
                    and stock
                    availability are
                    verified by the
                    server during
                    checkout.
                  </p>
                </aside>
              </div>
            )}
        </Container>
      </main>
    </>
  );
};

export default CartPage;