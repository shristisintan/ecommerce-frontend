import {
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  PackageCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import {
  getMerchantOrders,
} from "../../api/orderApi";

import type {
  MerchantOrder,
} from "../../api/orderApi";

const PAGE_LIMIT = 5;

const MerchantOrdersPage = () => {
  const [
    orders,
    setOrders,
  ] =
    useState<MerchantOrder[]>([]);

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
    total,
    setTotal,
  ] = useState(0);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    orderStatus,
    setOrderStatus,
  ] = useState("");

  const [
    paymentStatus,
    setPaymentStatus,
  ] = useState("");

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
            await getMerchantOrders({
              page,

              limit:
                PAGE_LIMIT,

              orderStatus:
                orderStatus ||
                undefined,

              paymentStatus:
                paymentStatus ||
                undefined,
            });

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
  }, [
    page,
    orderStatus,
    paymentStatus,
  ]);

  /* ======================================================
     STATUS HELPERS
  ====================================================== */

  const statusBadge = (
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

  const formatStatus = (
    status: string
  ) =>
    status
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

  const filtersActive =
    Boolean(
      orderStatus ||
        paymentStatus
    );

  return (
    <div className="space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <section>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
          Store Orders
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-primary-900 sm:text-4xl">
          Orders
        </h1>

        <p className="mt-2 max-w-[560px] text-sm leading-6 text-primary-500">
          Review marketplace
          orders containing
          products from your
          store.
        </p>
      </section>

      {/* =================================================
          FILTERS
      ================================================= */}

      <section className="rounded-2xl border border-border bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Order Status */}

          <select
            value={
              orderStatus
            }
            onChange={(
              event
            ) => {
              setOrderStatus(
                event.target
                  .value
              );

              setPage(1);
            }}
            className="h-11 min-w-[210px] rounded-xl border border-border bg-white px-4 text-sm font-medium text-primary-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
          >
            <option value="">
              All Order Statuses
            </option>

            <option value="PENDING_PAYMENT">
              Pending Payment
            </option>

            <option value="PAID">
              Paid
            </option>

            <option value="PROCESSING">
              Processing
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>

            <option value="PAYMENT_FAILED">
              Payment Failed
            </option>
          </select>

          {/* Payment Status */}

          <select
            value={
              paymentStatus
            }
            onChange={(
              event
            ) => {
              setPaymentStatus(
                event.target
                  .value
              );

              setPage(1);
            }}
            className="h-11 min-w-[190px] rounded-xl border border-border bg-white px-4 text-sm font-medium text-primary-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
          >
            <option value="">
              All Payments
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="PAID">
              Paid
            </option>

            <option value="FAILED">
              Failed
            </option>
          </select>

          {filtersActive && (
            <button
              type="button"
              onClick={() => {
                setOrderStatus("");

                setPaymentStatus("");

                setPage(1);
              }}
              className="h-11 rounded-xl px-4 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>

      {/* =================================================
          ORDER TABLE
      ================================================= */}

      <section className="overflow-hidden rounded-2xl border border-border bg-white">
        {/* Table heading */}

        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info-soft text-info">
              <ShoppingBag
                size={17}
              />
            </div>

            <div>
              <p className="text-sm font-bold text-primary-900">
                Marketplace Orders
              </p>

              <p className="text-xs text-primary-400">
                {total}{" "}
                {total === 1
                  ? "order"
                  : "orders"}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="m-5 rounded-xl border border-danger/15 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px]">
            <thead className="bg-primary-50/70">
              <tr className="text-left text-[10px] font-bold uppercase tracking-[0.12em] text-primary-400">
                <th className="px-5 py-4">
                  Order
                </th>

                <th className="px-5 py-4">
                  Customer
                </th>

                <th className="px-5 py-4">
                  Products
                </th>

                <th className="px-5 py-4">
                  Merchant Amount
                </th>

                <th className="px-5 py-4">
                  Payment
                </th>

                <th className="px-5 py-4">
                  Order Status
                </th>

                <th className="px-5 py-4">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {/* Loading */}

              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >
                    <div className="mx-auto flex w-fit items-center gap-3 text-sm text-primary-400">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />

                      Loading
                      orders...
                    </div>
                  </td>
                </tr>
              ) : orders.length ===
                0 ? (
                /* Empty */

                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-300">
                        <PackageCheck
                          size={22}
                        />
                      </div>

                      <p className="mt-4 text-sm font-bold text-primary-900">
                        No orders
                        found
                      </p>

                      <p className="mt-1 text-xs leading-5 text-primary-400">
                        No orders
                        currently match
                        the selected
                        filters.
                      </p>

                      {filtersActive && (
                        <button
                          type="button"
                          onClick={() => {
                            setOrderStatus(
                              ""
                            );

                            setPaymentStatus(
                              ""
                            );

                            setPage(
                              1
                            );
                          }}
                          className="mt-4 text-xs font-semibold text-brand-700"
                        >
                          Clear
                          Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map(
                  (
                    order
                  ) => (
                    <tr
                      key={
                        order._id
                      }
                      className="transition hover:bg-primary-50/45"
                    >
                      {/* Order */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                            <PackageCheck
                              size={
                                16
                              }
                            />
                          </div>

                          <p className="text-sm font-bold text-primary-900">
                            #
                            {order._id
                              .slice(
                                -8
                              )
                              .toUpperCase()}
                          </p>
                        </div>
                      </td>

                      {/* Customer */}

                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-400">
                            <UserRound
                              size={
                                14
                              }
                            />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-primary-900">
                              {
                                order
                                  .buyerId
                                  .name
                              }
                            </p>

                            <p className="mt-1 text-xs text-primary-400">
                              {
                                order
                                  .buyerId
                                  .email
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Products */}

                      <td className="px-5 py-4">
                        <div className="max-w-[260px] space-y-1.5">
                          {order.items.map(
                            (
                              item,
                              index
                            ) => (
                              <p
                                key={`${order._id}-${index}`}
                                className="text-sm text-primary-600"
                              >
                                <span className="font-semibold text-primary-800">
                                  {
                                    item.productName
                                  }
                                </span>

                                <span className="ml-1 text-primary-400">
                                  ×{" "}
                                  {
                                    item.quantity
                                  }
                                </span>
                              </p>
                            )
                          )}
                        </div>
                      </td>

                      {/* Merchant Amount */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <CircleDollarSign
                            size={
                              15
                            }
                            className="text-brand-600"
                          />

                          <span className="text-sm font-bold text-primary-900">
                            NPR{" "}
                            {order.merchantTotal.toLocaleString(
                              "en-NP"
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Payment */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] ${statusBadge(
                            order.paymentStatus
                          )}`}
                        >
                          {formatStatus(
                            order.paymentStatus
                          )}
                        </span>
                      </td>

                      {/* Order Status */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] ${statusBadge(
                            order.orderStatus
                          )}`}
                        >
                          {formatStatus(
                            order.orderStatus
                          )}
                        </span>
                      </td>

                      {/* Date */}

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-primary-500">
                          {formatDate(
                            order.createdAt
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        {totalPages >
          1 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-4">
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

            <div className="flex gap-2">
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
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-primary-600 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft
                  size={17}
                />
              </button>

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
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-primary-600 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight
                  size={17}
                />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MerchantOrdersPage;