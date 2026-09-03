import {
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  initiateEsewaPayment,
} from "../../api/paymentApi";

import {
  submitEsewaPayment,
} from "../../utils/esewaPayment";

const PaymentFailure = () => {
  const orderId =
    localStorage.getItem(
      "pending_order_id"
    );

  const [
    retrying,
    setRetrying,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const handleRetry =
    async () => {
      if (
        !orderId ||
        retrying
      ) {
        return;
      }

      try {
        setRetrying(true);
        setError("");

        /*
         * Reuse the existing order.
         *
         * DO NOT create another order
         * because the original cart
         * was already cleared.
         */
        const payment =
          await initiateEsewaPayment(
            orderId
          );

        submitEsewaPayment(
          payment.paymentUrl,
          payment.formData
        );
      } catch (error) {
        setRetrying(false);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to retry payment."
        );
      }
    };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-5 py-10">
      <div className="w-full max-w-[520px] rounded-[28px] bg-white p-7 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertCircle
            size={30}
          />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-black/40">
          Payment unsuccessful
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em]">
          Payment Failed
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-black/50">
          Your payment was not
          completed. No stock has
          been deducted.
        </p>

        {orderId ? (
          <>
            <div className="mt-7 rounded-2xl bg-[#f7f7f7] px-5 py-4 text-left">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-black/40">
                Order
              </p>

              <p className="mt-2 break-all text-sm font-medium">
                {orderId}
              </p>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-left text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="button"
              disabled={
                retrying
              }
              onClick={() =>
                void handleRetry()
              }
              className="mt-7 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  retrying
                    ? "animate-spin"
                    : ""
                }
              />

              {retrying
                ? "Redirecting to eSewa..."
                : "Retry Payment"}
            </button>
          </>
        ) : (
          <div className="mt-7 rounded-2xl bg-[#f7f7f7] px-5 py-4 text-sm text-black/50">
            No pending order was
            found.
          </div>
        )}

        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-black/50 transition hover:text-black"
        >
          <ArrowLeft
            size={16}
          />

          Continue Shopping
        </Link>
      </div>
    </main>
  );
};

export default PaymentFailure;