import {
  AlertTriangle,
  CheckCircle2,
  Package,
  ShoppingBag,
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

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const loadDashboard =
      async () => {
        try {
          setLoading(true);
          setError("");

          /*
           * Get first product page.
           *
           * Limit 50 is currently
           * enough for the project,
           * but we also fetch extra
           * pages if they exist.
           */
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

          /*
           * Fetch remaining product
           * pages if merchant has
           * more than 50 products.
           */
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
                (_, index) =>
                  index + 2
              );

            const remainingResults =
              await Promise.all(
                remainingPages.map(
                  (page) =>
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
                (result) =>
                  result.data
              ),
            ];
          }

          /*
           * We only need one order
           * row because pagination
           * already gives us the
           * merchant's total orders.
           */
          const ordersResult =
            await getMerchantOrders({
              page: 1,
              limit: 1,
            });

          const activeProducts =
            allProducts.filter(
              (product) =>
                product.isActive
            ).length;

          /*
           * Low stock threshold:
           * 5 or fewer active items.
           */
          const lowStockProducts =
            allProducts.filter(
              (product) =>
                product.isActive &&
                product.stock <= 5
            ).length;

          setStats({
            totalProducts:
              firstProductResult
                .pagination.total,

            activeProducts,

            lowStockProducts,

            totalOrders:
              ordersResult
                .pagination.total,
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

  const cards = [
    {
      title:
        "Total Products",

      value:
        stats.totalProducts,

      description:
        "All products in your store",

      icon:
        Package,

      to:
        "/merchant/products",
    },

    {
      title:
        "Active Products",

      value:
        stats.activeProducts,

      description:
        "Currently visible to buyers",

      icon:
        CheckCircle2,

      to:
        "/merchant/products",
    },

    {
      title:
        "Low Stock",

      value:
        stats.lowStockProducts,

      description:
        "Products with 5 or fewer items",

      icon:
        AlertTriangle,

      to:
        "/merchant/products",
    },

    {
      title:
        "Total Orders",

      value:
        stats.totalOrders,

      description:
        "Orders containing your products",

      icon:
        ShoppingBag,

      to:
        "/merchant/orders",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-black/40">
          Merchant Portal
        </p>

        <h1 className="mt-1 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
          Welcome,{" "}
          {user?.name}
        </h1>

        <p className="mt-2 text-sm text-black/50">
          Monitor your store,
          inventory and orders
          from one place.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          ({
            title,
            value,
            description,
            icon: Icon,
            to,
          }) => (
            <Link
              key={
                title
              }
              to={
                to
              }
              className="group rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f5f5] transition group-hover:bg-black group-hover:text-white">
                  <Icon
                    size={20}
                  />
                </div>
              </div>

              <p className="mt-5 text-sm font-medium text-black/45">
                {title}
              </p>

              <p className="mt-1 text-3xl font-black tracking-tight">
                {loading
                  ? "—"
                  : value}
              </p>

              <p className="mt-2 text-xs leading-5 text-black/40">
                {
                  description
                }
              </p>
            </Link>
          )
        )}
      </div>

      {/* Quick Navigation */}

      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <div>
          <h2 className="text-lg font-bold">
            Quick Access
          </h2>

          <p className="mt-1 text-sm text-black/45">
            Manage the main areas
            of your store.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            to="/merchant/products"
            className="flex items-center gap-4 rounded-xl border border-black/10 p-4 transition hover:bg-[#f7f7f7]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5]">
              <Package
                size={18}
              />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Manage Products
              </p>

              <p className="mt-1 text-xs text-black/40">
                Add, edit and
                manage inventory.
              </p>
            </div>
          </Link>

          <Link
            to="/merchant/orders"
            className="flex items-center gap-4 rounded-xl border border-black/10 p-4 transition hover:bg-[#f7f7f7]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5]">
              <ShoppingBag
                size={18}
              />
            </div>

            <div>
              <p className="text-sm font-semibold">
                View Orders
              </p>

              <p className="mt-1 text-xs text-black/40">
                Review orders
                containing your
                products.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;