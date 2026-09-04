import {
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import Header from "../../components/layout/Header";

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

  const badgeClass = (
    status: string
  ) => {
    switch (status) {
      case "PAID":
      case "COMPLETED":
        return "bg-green-50 text-green-700";

      case "PROCESSING":
        return "bg-blue-50 text-blue-700";

      case "PENDING":
      case "PENDING_PAYMENT":
        return "bg-amber-50 text-amber-700";

      case "FAILED":
      case "PAYMENT_FAILED":
        return "bg-red-50 text-red-600";

      case "CANCELLED":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f7f7] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-[1100px]">
          {/* Page Header */}

          <div>
            <p className="text-sm font-medium text-black/40">
              My Account
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-black/50">
              View your
              purchases and
              payment status.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Orders */}

          <div className="mt-8">
            {loading ? (
              <div className="rounded-2xl border border-black/10 bg-white py-16 text-center text-sm text-black/40">
                Loading
                orders...
              </div>
            ) : orders.length ===
              0 ? (
              <div className="rounded-2xl border border-black/10 bg-white py-16 text-center">
                <Package
                  size={34}
                  className="mx-auto text-black/20"
                />

                <p className="mt-4 font-semibold">
                  No orders yet
                </p>

                <p className="mt-1 text-sm text-black/40">
                  Your
                  purchases will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(
                  (
                    order
                  ) => (
                    <div
                      key={
                        order._id
                      }
                      className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"
                    >
                      {/* Order Header */}

                      <div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-black/40">
                            Order
                          </p>

                          <p className="mt-1 font-bold">
                            #
                            {order._id
                              .slice(
                                -8
                              )
                              .toUpperCase()}
                          </p>

                          <p className="mt-1 text-xs text-black/40">
                            {formatDate(
                              order.createdAt
                            )}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(
                              order.paymentStatus
                            )}`}
                          >
                            Payment:{" "}
                            {formatStatus(
                              order.paymentStatus
                            )}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(
                              order.orderStatus
                            )}`}
                          >
                            {formatStatus(
                              order.orderStatus
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Products */}

                      <div className="divide-y divide-black/5">
                        {order.items.map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={`${order._id}-${index}`}
                              className="flex items-center justify-between gap-4 py-4"
                            >
                              <div>
                                <p className="text-sm font-semibold">
                                  {
                                    item.productName
                                  }
                                </p>

                                <p className="mt-1 text-xs text-black/45">
                                  NPR{" "}
                                  {item.unitPrice.toLocaleString()}{" "}
                                  ×{" "}
                                  {
                                    item.quantity
                                  }
                                </p>
                              </div>

                              <p className="text-sm font-bold">
                                NPR{" "}
                                {item.subtotal.toLocaleString()}
                              </p>
                            </div>
                          )
                        )}
                      </div>

                      {/* Order Footer */}

                      <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-xs leading-5 text-black/45">
                          Delivery:{" "}
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
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-black/40">
                            Order
                            Total
                          </p>

                          <p className="mt-1 text-xl font-black">
                            NPR{" "}
                            {order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Pagination */}

          {!loading &&
            totalPages >
              1 && (
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-black/10 bg-white px-5 py-4">
                <p className="text-sm text-black/45">
                  {total}{" "}
                  orders ·
                  Page {page}{" "}
                  of{" "}
                  {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={
                      page <=
                      1
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 transition hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-30"
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 transition hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight
                      size={17}
                    />
                  </button>
                </div>
              </div>
            )}
        </div>
      </main>
    </>
  );
};

export default MyOrdersPage;