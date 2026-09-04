import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Package,
  ReceiptText,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import {
  getMyOrders,
} from "../../api/orderApi";

import type {
  BuyerOrder,
} from "../../api/orderApi";

const PAGE_LIMIT = 5;

const MyOrdersPage = () => {
  const [
    orders,
    setOrders,
  ] =
    useState<BuyerOrder[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    total,
    setTotal,
  ] = useState(0);

  /* ======================================================
     LOAD ORDERS
  ====================================================== */

  useEffect(() => {
    const loadOrders =
      async () => {
        try {
          setLoading(true);

          setError("");

          const result =
            await getMyOrders(
              page,
              PAGE_LIMIT
            );

          setOrders(
            result.data
          );

          setTotal(
            result.pagination
              .total
          );

          setTotalPages(
            Math.max(
              result.pagination
                .totalPages,
              1
            )
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load orders."
          );
        } finally {
          setLoading(false);
        }
      };

    void loadOrders();
  }, [page]);

  /* ======================================================
     FORMATTERS
  ====================================================== */

  const formatDate = (
    value: string
  ) =>
    new Intl.DateTimeFormat(
      "en-NP",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    ).format(
      new Date(value)
    );

  const formatStatus = (
    value: string
  ) =>
    value
      .replace(
        /_/g,
        " "
      )
      .toLowerCase()
      .replace(
        /\b\w/g,
        (
          letter
        ) =>
          letter.toUpperCase()
      );

  const orderBadgeClass = (
    status: string
  ) => {
    switch (status) {
      case "PAID":
      case "COMPLETED":
        return "bg-success-soft text-success";

      case "PROCESSING":
        return "bg-info-soft text-info";

      case "PENDING":
      case "PENDING_PAYMENT":
        return "bg-warning-soft text-warning";

      case "FAILED":
      case "PAYMENT_FAILED":
        return "bg-danger-soft text-danger";

      case "CANCELLED":
        return "bg-primary-100 text-primary-500";

      default:
        return "bg-primary-100 text-primary-500";
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-primary-50/50">
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="border-b border-border bg-white">
          <div className="mx-auto max-w-[1180px] px-4 py-9 sm:px-6 sm:py-11">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              My Account
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-primary-900 sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 max-w-[500px] text-sm leading-6 text-primary-500">
              Review your purchases,
              payment status and
              delivery information.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
          {/* =================================================
              SUMMARY
          ================================================= */}

          {!loading &&
            !error && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <ReceiptText
                      size={18}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-primary-900">
                      Order History
                    </p>

                    <p className="text-xs text-primary-400">
                      {total}{" "}
                      {total === 1
                        ? "order"
                        : "orders"}{" "}
                      in total
                    </p>
                  </div>
                </div>

                {totalPages >
                  1 && (
                  <p className="text-xs font-medium text-primary-400">
                    Page{" "}
                    <span className="font-bold text-primary-900">
                      {page}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-primary-900">
                      {
                        totalPages
                      }
                    </span>
                  </p>
                )}
              </div>
            )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="rounded-xl border border-danger/15 bg-danger-soft px-5 py-4 text-sm font-medium text-danger">
              {error}
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="space-y-4">
              {Array.from({
                length: 3,
              }).map(
                (
                  _,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="h-[220px] animate-pulse rounded-2xl bg-primary-100"
                  />
                )
              )}
            </div>
          )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            !error &&
            orders.length ===
              0 && (
              <div className="flex min-h-[430px] flex-col items-center justify-center rounded-2xl border border-border bg-white px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <Package
                    size={28}
                  />
                </div>

                <h2 className="mt-6 text-2xl font-black tracking-tight text-primary-900">
                  No orders yet
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-primary-500">
                  Once you place an
                  order, you will be
                  able to track its
                  payment and order
                  status here.
                </p>

                <a
                  href="/products"
                  className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-brand-600 px-7 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Start Shopping
                </a>
              </div>
            )}

          {/* =================================================
              ORDERS
          ================================================= */}

          {!loading &&
            !error &&
            orders.length >
              0 && (
              <div className="space-y-4">
                {orders.map(
                  (
                    order
                  ) => (
                    <article
                      key={
                        order._id
                      }
                      className="overflow-hidden rounded-2xl border border-border bg-white"
                    >
                      {/* =====================================
                          ORDER HEADER
                      ===================================== */}

                      <div className="flex flex-col gap-4 border-b border-border bg-primary-50/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-400">
                              Order
                            </p>

                            <p className="mt-1 text-sm font-black text-primary-900">
                              #
                              {order._id
                                .slice(
                                  -8
                                )
                                .toUpperCase()}
                            </p>
                          </div>

                          <div className="hidden h-8 w-px bg-border sm:block" />

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-400">
                              Placed On
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-primary-600 sm:text-sm">
                              <Clock3
                                size={
                                  14
                                }
                                className="text-brand-600"
                              />

                              {formatDate(
                                order.createdAt
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] ${orderBadgeClass(
                              order.paymentStatus
                            )}`}
                          >
                            Payment ·{" "}
                            {formatStatus(
                              order.paymentStatus
                            )}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] ${orderBadgeClass(
                              order.orderStatus
                            )}`}
                          >
                            {formatStatus(
                              order.orderStatus
                            )}
                          </span>
                        </div>
                      </div>

                      {/* =====================================
                          PRODUCTS
                      ===================================== */}

                      <div className="px-5 sm:px-6">
                        <div className="divide-y divide-border">
                          {order.items.map(
                            (
                              item,
                              index
                            ) => (
                              <div
                                key={`${order._id}-${index}`}
                                className="flex items-center justify-between gap-5 py-5"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-primary-900 sm:text-base">
                                    {
                                      item.productName
                                    }
                                  </p>

                                  <p className="mt-1 text-xs text-primary-400">
                                    NPR{" "}
                                    {item.unitPrice.toLocaleString(
                                      "en-NP"
                                    )}{" "}
                                    ×{" "}
                                    {
                                      item.quantity
                                    }
                                  </p>
                                </div>

                                <p className="shrink-0 text-sm font-black text-primary-900 sm:text-base">
                                  NPR{" "}
                                  {item.subtotal.toLocaleString(
                                    "en-NP"
                                  )}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* =====================================
                          ORDER FOOTER
                      ===================================== */}

                      <div className="grid gap-5 border-t border-border px-5 py-5 sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
                        {/* Delivery */}

                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                            <MapPin
                              size={16}
                            />
                          </div>

                          <div>
                            <p className="text-xs font-bold text-primary-900">
                              Delivery
                            </p>

                            <p className="mt-1 max-w-[600px] text-xs leading-5 text-primary-500">
                              {
                                order
                                  .shippingAddress
                                  .fullName
                              }
                              {" · "}
                              {
                                order
                                  .shippingAddress
                                  .addressLine
                              }
                              ,{" "}
                              {
                                order
                                  .shippingAddress
                                  .city
                              }
                              ,{" "}
                              {
                                order
                                  .shippingAddress
                                  .country
                              }
                            </p>
                          </div>
                        </div>

                        {/* Total */}

                        <div className="md:text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-400">
                            Order Total
                          </p>

                          <p className="mt-1 text-xl font-black tracking-tight text-primary-900">
                            NPR{" "}
                            {order.totalAmount.toLocaleString(
                              "en-NP"
                            )}
                          </p>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}

          {/* =================================================
              PAGINATION
          ================================================= */}

          {!loading &&
            !error &&
            totalPages >
              1 && (
              <div className="mt-7 flex items-center justify-between border-t border-border pt-6">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={
                    page <= 1
                  }
                  onClick={() =>
                    setPage(
                      (
                        current
                      ) =>
                        current -
                        1
                    )
                  }
                  className="flex h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft
                    size={16}
                  />

                  <span className="hidden sm:inline">
                    Previous
                  </span>
                </button>

                <p className="text-xs font-medium text-primary-400 sm:text-sm">
                  Page{" "}
                  <span className="font-bold text-primary-900">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-primary-900">
                    {
                      totalPages
                    }
                  </span>
                </p>

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={
                    page >=
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      (
                        current
                      ) =>
                        current +
                        1
                    )
                  }
                  className="flex h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <span className="hidden sm:inline">
                    Next
                  </span>

                  <ChevronRight
                    size={16}
                  />
                </button>
              </div>
            )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MyOrdersPage;