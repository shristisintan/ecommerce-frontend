import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getMerchantProducts,
} from "../../api/productApi";

import {
  getMerchantOrders,
} from "../../api/orderApi";

import {
  useAuth,
} from "../../context/AuthContext";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalOrders: number;
}

const initialStats: DashboardStats = {
  totalProducts: 0,
  activeProducts: 0,
  lowStockProducts: 0,
  totalOrders: 0,
};

const MerchantDashboard = () => {
  const {
    user,
    accessToken,
  } = useAuth();

  const [
    stats,
    setStats,
  ] =
    useState<DashboardStats>(
      initialStats
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* ======================================================
     LOAD DASHBOARD
  ====================================================== */

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const loadDashboard =
      async () => {
        try {
          setLoading(true);

          setError("");

          const firstProductResult =
            await getMerchantProducts(
              accessToken,
              {
                page: 1,
                limit: 50,
              }
            );

          let allProducts =
            firstProductResult.data;

          if (
            firstProductResult
              .pagination
              .totalPages > 1
          ) {
            const remainingPages =
              Array.from(
                {
                  length:
                    firstProductResult
                      .pagination
                      .totalPages -
                    1,
                },
                (
                  _,
                  index
                ) =>
                  index +
                  2
              );

            const remainingResults =
              await Promise.all(
                remainingPages.map(
                  (
                    page
                  ) =>
                    getMerchantProducts(
                      accessToken,
                      {
                        page,
                        limit: 50,
                      }
                    )
                )
              );

            allProducts = [
              ...allProducts,
              ...remainingResults.flatMap(
                (
                  result
                ) =>
                  result.data
              ),
            ];
          }

          const ordersResult =
            await getMerchantOrders(
              {
                page: 1,
                limit: 1,
              }
            );

          const activeProducts =
            allProducts.filter(
              (
                product
              ) =>
                product.isActive
            ).length;

          const lowStockProducts =
            allProducts.filter(
              (
                product
              ) =>
                product.isActive &&
                product.stock <=
                  5
            ).length;

          setStats({
            totalProducts:
              firstProductResult
                .pagination
                .total,

            activeProducts,

            lowStockProducts,

            totalOrders:
              ordersResult
                .pagination
                .total,
          });
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load dashboard."
          );
        } finally {
          setLoading(false);
        }
      };

    void loadDashboard();
  }, [accessToken]);

  const statCards = [
    {
      label:
        "Total Products",

      value:
        stats.totalProducts,

      icon:
        Package,

      iconClass:
        "bg-brand-50 text-brand-700",

      to:
        "/merchant/products",
    },

    {
      label:
        "Active Products",

      value:
        stats.activeProducts,

      icon:
        CheckCircle2,

      iconClass:
        "bg-success-soft text-success",

      to:
        "/merchant/products",
    },

    {
      label:
        "Low Stock",

      value:
        stats.lowStockProducts,

      icon:
        AlertTriangle,

      iconClass:
        "bg-warning-soft text-warning",

      to:
        "/merchant/products",
    },

    {
      label:
        "Total Orders",

      value:
        stats.totalOrders,

      icon:
        ShoppingBag,

      iconClass:
        "bg-info-soft text-info",

      to:
        "/merchant/orders",
    },
  ];

  return (
    <div className="space-y-7">
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="rounded-2xl border border-border bg-white p-6 sm:p-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Merchant Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-primary-900 sm:text-4xl">
              Welcome back,{" "}
              {user?.name}
            </h1>

            <p className="mt-2 max-w-[620px] text-sm leading-6 text-primary-500">
              Manage your store,
              products and incoming
              orders from one place.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-primary-50 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <Store
                size={18}
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-primary-900">
                Merchant Account
              </p>

              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-700">
                Active
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-danger/15 bg-danger-soft px-5 py-4 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(
          ({
            label,
            value,
            icon: Icon,
            iconClass,
            to,
          }) => (
            <Link
              key={
                label
              }
              to={
                to
              }
              className="group rounded-2xl border border-border bg-white p-5 transition hover:border-brand-200 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
                >
                  <Icon
                    size={20}
                  />
                </div>

                <ArrowRight
                  size={16}
                  className="text-primary-300 transition group-hover:text-brand-600"
                />
              </div>

              <p className="mt-6 text-xs font-semibold text-primary-400">
                {label}
              </p>

              <p className="mt-1 text-4xl font-black tracking-[-0.05em] text-primary-900">
                {loading
                  ? "—"
                  : value}
              </p>
            </Link>
          )
        )}
      </section>

      {/* =================================================
          OVERVIEW SECTION
      ================================================= */}

      <section className="grid gap-5 lg:grid-cols-2">
        {/* Inventory Overview */}

        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                Inventory
              </p>

              <h2 className="mt-2 text-xl font-black text-primary-900">
                Inventory Overview
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Package
                size={18}
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={18}
                  className="text-success"
                />

                <span className="text-sm font-semibold text-primary-700">
                  Active Products
                </span>
              </div>

              <span className="text-xl font-black text-primary-900">
                {loading
                  ? "—"
                  : stats.activeProducts}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <AlertTriangle
                  size={18}
                  className="text-warning"
                />

                <span className="text-sm font-semibold text-primary-700">
                  Low Stock
                </span>
              </div>

              <span className="text-xl font-black text-primary-900">
                {loading
                  ? "—"
                  : stats.lowStockProducts}
              </span>
            </div>
          </div>

          <Link
            to="/merchant/products"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
          >
            Manage Products

            <ArrowRight
              size={15}
            />
          </Link>
        </div>

        {/* Store Overview */}

        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                Store Activity
              </p>

              <h2 className="mt-2 text-xl font-black text-primary-900">
                Store Overview
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info-soft text-info">
              <ShoppingBag
                size={18}
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <Package
                  size={18}
                  className="text-brand-700"
                />

                <span className="text-sm font-semibold text-primary-700">
                  Total Products
                </span>
              </div>

              <span className="text-xl font-black text-primary-900">
                {loading
                  ? "—"
                  : stats.totalProducts}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <ShoppingBag
                  size={18}
                  className="text-info"
                />

                <span className="text-sm font-semibold text-primary-700">
                  Total Orders
                </span>
              </div>

              <span className="text-xl font-black text-primary-900">
                {loading
                  ? "—"
                  : stats.totalOrders}
              </span>
            </div>
          </div>

          <Link
            to="/merchant/orders"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
          >
            View Orders

            <ArrowRight
              size={15}
            />
          </Link>
        </div>
      </section>

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="rounded-2xl border border-border bg-white p-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
            Quick Actions
          </p>

          <h2 className="mt-2 text-xl font-black text-primary-900">
            Manage Your Store
          </h2>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            to="/merchant/products"
            className="group flex items-center justify-between rounded-xl border border-border p-4 transition hover:border-brand-200 hover:bg-brand-50/40"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Package
                  size={18}
                />
              </div>

              <div>
                <p className="text-sm font-bold text-primary-900">
                  Manage Products
                </p>

                <p className="mt-1 text-xs text-primary-400">
                  Add and update
                  products.
                </p>
              </div>
            </div>

            <ArrowRight
              size={17}
              className="text-primary-300 transition group-hover:text-brand-600"
            />
          </Link>

          <Link
            to="/merchant/orders"
            className="group flex items-center justify-between rounded-xl border border-border p-4 transition hover:border-brand-200 hover:bg-brand-50/40"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info-soft text-info">
                <ShoppingBag
                  size={18}
                />
              </div>

              <div>
                <p className="text-sm font-bold text-primary-900">
                  View Orders
                </p>

                <p className="mt-1 text-xs text-primary-400">
                  Review marketplace
                  orders.
                </p>
              </div>
            </div>

            <ArrowRight
              size={17}
              className="text-primary-300 transition group-hover:text-brand-600"
            />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MerchantDashboard;