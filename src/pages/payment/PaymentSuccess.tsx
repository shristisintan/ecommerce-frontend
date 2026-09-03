import {
  Check,
  ShoppingBag,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  clearCheckoutData,
} from "../../utils/checkoutStorage";

const PaymentSuccess = () => {
  /*
   * Payment is complete, so the old
   * checkout state must not be reused
   * for the next order.
   */
  useEffect(() => {
    localStorage.removeItem(
      "pending_order_id"
    );

    clearCheckoutData();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-5 py-10">
      <div className="w-full max-w-[540px] rounded-[28px] bg-white p-7 text-center shadow-sm sm:p-10">
        {/* Success Icon */}

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
          <Check
            size={30}
          />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-black/40">
          Payment successful
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
          Order Confirmed
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-black/50">
          Your payment has been
          verified successfully and
          your order has been
          confirmed.
        </p>

        {/* Status */}

        <div className="mt-7 rounded-2xl bg-[#f7f7f7] p-5">
          <div className="flex items-center justify-between gap-5">
            <span className="text-sm text-black/50">
              Payment
            </span>

            <span className="flex items-center gap-2 text-sm font-semibold">
              <span className="h-2 w-2 rounded-full bg-black" />

              Paid
            </span>
          </div>

          <div className="my-4 h-px bg-black/10" />

          <div className="flex items-center justify-between gap-5">
            <span className="text-sm text-black/50">
              Order status
            </span>

            <span className="text-sm font-semibold">
              Confirmed
            </span>
          </div>
        </div>

        {/* Continue Shopping */}

        <Link
          to="/products"
          className="mt-7 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-semibold !text-white transition hover:bg-black/80"
        >
          <ShoppingBag
            size={17}
          />

          Continue Shopping
        </Link>

        <Link
          to="/"
          className="mt-5 inline-block text-sm font-medium text-black/45 transition hover:text-black"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default PaymentSuccess;