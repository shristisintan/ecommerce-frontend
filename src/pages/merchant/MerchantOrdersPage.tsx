import {
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  PackageCheck,
} from "lucide-react";

import {
  getMerchantOrders,
} from "../../api/orderApi";

import type {
  MerchantOrder,
} from "../../api/orderApi";

const PAGE_LIMIT = 5;

const MerchantOrdersPage =
  () => {
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

    const statusBadge = (
      status: string
    ) => {
      switch (status) {
        case "PAID":
          return "bg-green-50 text-green-700";

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
          (letter) =>
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

    return (
      <div className="space-y-6">
        {/* Header */}

        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Orders
          </h1>

          <p className="mt-1 text-sm text-black/45">
            View orders containing
            products from your store.
          </p>
        </div>

        {/* Filters */}

        <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 md:flex-row">
          <select
            value={
              orderStatus
            }
            onChange={(
              event
            ) => {
              setOrderStatus(
                event.target.value
              );

              setPage(1);
            }}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
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

          <select
            value={
              paymentStatus
            }
            onChange={(
              event
            ) => {
              setPaymentStatus(
                event.target.value
              );

              setPage(1);
            }}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
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
        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
          <div className="border-b border-black/10 px-5 py-4">
            <p className="text-sm font-semibold">
              {total}{" "}
              {total === 1
                ? "Order"
                : "Orders"}
            </p>
          </div>

          {error && (
            <div className="m-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-[#fafafa]">
                <tr className="text-left text-xs uppercase tracking-wider text-black/40">
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
                    Amount
                  </th>

                  <th className="px-5 py-4">
                    Payment
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-black/40"
                    >
                      Loading
                      orders...
                    </td>
                  </tr>
                ) : orders.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-14 text-center"
                    >
                      <PackageCheck
                        size={30}
                        className="mx-auto text-black/20"
                      />

                      <p className="mt-3 text-sm font-semibold">
                        No orders
                        found
                      </p>
                    </td>
                  </tr>
                ) : (
                  orders.map(
                    (order) => (
                      <tr
                        key={
                          order._id
                        }
                        className="border-t border-black/5"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold">
                            #
                            {order._id
                              .slice(-8)
                              .toUpperCase()}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold">
                            {
                              order
                                .buyerId
                                .name
                            }
                          </p>

                          <p className="mt-1 text-xs text-black/40">
                            {
                              order
                                .buyerId
                                .email
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            {order.items.map(
                              (
                                item,
                                index
                              ) => (
                                <p
                                  key={`${order._id}-${index}`}
                                  className="text-sm text-black/65"
                                >
                                  {
                                    item.productName
                                  }{" "}
                                  ×{" "}
                                  {
                                    item.quantity
                                  }
                                </p>
                              )
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold">
                          NPR{" "}
                          {order.merchantTotal.toLocaleString()}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                              order.paymentStatus
                            )}`}
                          >
                            {formatStatus(
                              order.paymentStatus
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                              order.orderStatus
                            )}`}
                          >
                            {formatStatus(
                              order.orderStatus
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-black/55">
                          {formatDate(
                            order.createdAt
                          )}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-black/10 px-5 py-4">
              <p className="text-sm text-black/45">
                Page {page} of{" "}
                {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={
                    page <= 1
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        current - 1
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 disabled:opacity-30"
                >
                  <ChevronLeft
                    size={17}
                  />
                </button>

                <button
                  type="button"
                  disabled={
                    page >=
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        current + 1
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 disabled:opacity-30"
                >
                  <ChevronRight
                    size={17}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

export default MerchantOrdersPage;