import {
  CheckCircle2,
  CircleOff,
  Shapes,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getAdminCategories,
} from "../../api/categoryApi";

import {
  useAuth,
} from "../../context/AuthContext";

interface DashboardStats {
  total: number;
  active: number;
  inactive: number;
}

const AdminDashboard = () => {
  const {
    user,
  } = useAuth();

  const [
    stats,
    setStats,
  ] =
    useState<DashboardStats>({
      total: 0,
      active: 0,
      inactive: 0,
    });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          setLoading(true);
          setError("");

          const result =
            await getAdminCategories();

          const categories =
            result.data;

          const active =
            categories.filter(
              (category) =>
                category.isActive
            ).length;

          setStats({
            total:
              categories.length,

            active,

            inactive:
              categories.length -
              active,
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
  }, []);

  const cards = [
    {
      title:
        "Total Categories",

      value:
        stats.total,

      description:
        "All marketplace categories",

      icon:
        Shapes,
    },

    {
      title:
        "Active Categories",

      value:
        stats.active,

      description:
        "Available for products",

      icon:
        CheckCircle2,
    },

    {
      title:
        "Inactive Categories",

      value:
        stats.inactive,

      description:
        "Currently disabled",

      icon:
        CircleOff,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-black/40">
          Admin Portal
        </p>

        <h1 className="mt-1 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
          Welcome,{" "}
          {user?.name}
        </h1>

        <p className="mt-2 text-sm text-black/50">
          Manage marketplace
          configuration from one place.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(
          ({
            title,
            value,
            description,
            icon: Icon,
          }) => (
            <div
              key={
                title
              }
              className="rounded-2xl border border-black/10 bg-white p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f5f5]">
                <Icon
                  size={20}
                />
              </div>

              <p className="mt-5 text-sm font-medium text-black/45">
                {title}
              </p>

              <p className="mt-1 text-3xl font-black tracking-tight">
                {loading
                  ? "—"
                  : value}
              </p>

              <p className="mt-2 text-xs text-black/40">
                {
                  description
                }
              </p>
            </div>
          )
        )}
      </div>

      {/* Quick access */}

      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-bold">
          Quick Access
        </h2>

        <p className="mt-1 text-sm text-black/45">
          Manage marketplace
          categories.
        </p>

        <Link
          to="/admin/categories"
          className="mt-5 flex items-center gap-4 rounded-xl border border-black/10 p-4 transition hover:bg-[#f7f7f7]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5]">
            <Shapes
              size={18}
            />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Manage Categories
            </p>

            <p className="mt-1 text-xs text-black/40">
              Add, edit and
              deactivate product
              categories.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;