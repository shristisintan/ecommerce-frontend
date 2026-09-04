import {
  ArrowRight,
  CheckCircle2,
  CircleOff,
  Shapes,
  ShieldCheck,
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

  /* ======================================================
     LOAD DASHBOARD
  ====================================================== */

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
              (
                category
              ) =>
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
        "All marketplace product categories.",

      icon:
        Shapes,

      iconClass:
        "bg-brand-50 text-brand-700",
    },

    {
      title:
        "Active Categories",

      value:
        stats.active,

      description:
        "Categories currently available for products.",

      icon:
        CheckCircle2,

      iconClass:
        "bg-success-soft text-success",
    },

    {
      title:
        "Inactive Categories",

      value:
        stats.inactive,

      description:
        "Categories currently hidden from use.",

      icon:
        CircleOff,

      iconClass:
        "bg-primary-100 text-primary-500",
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
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-primary-900 sm:text-4xl">
              Welcome back,{" "}
              {user?.name}
            </h1>

            <p className="mt-2 max-w-[620px] text-sm leading-6 text-primary-500">
              Manage marketplace
              category
              configuration from
              the NOVA admin
              portal.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-primary-50 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <ShieldCheck
                size={18}
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-primary-900">
                Admin Account
              </p>

              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-700">
                Authorized
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(
          ({
            title,
            value,
            description,
            icon: Icon,
            iconClass,
          }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-white p-5"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
              >
                <Icon
                  size={20}
                />
              </div>

              <p className="mt-6 text-xs font-semibold text-primary-400">
                {title}
              </p>

              <p className="mt-1 text-4xl font-black tracking-[-0.05em] text-primary-900">
                {loading
                  ? "—"
                  : value}
              </p>

              <p className="mt-3 text-xs leading-5 text-primary-400">
                {
                  description
                }
              </p>
            </div>
          )
        )}
      </section>

      {/* =================================================
          CATEGORY OVERVIEW
      ================================================= */}

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Overview */}

        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                Marketplace
              </p>

              <h2 className="mt-2 text-xl font-black text-primary-900">
                Category Overview
              </h2>

              <p className="mt-1 text-sm text-primary-500">
                Current category
                availability across
                the marketplace.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Shapes
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
                  Active
                  Categories
                </span>
              </div>

              <span className="text-xl font-black text-primary-900">
                {loading
                  ? "—"
                  : stats.active}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <CircleOff
                  size={18}
                  className="text-primary-400"
                />

                <span className="text-sm font-semibold text-primary-700">
                  Inactive
                  Categories
                </span>
              </div>

              <span className="text-xl font-black text-primary-900">
                {loading
                  ? "—"
                  : stats.inactive}
              </span>
            </div>
          </div>

          <Link
            to="/admin/categories"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
          >
            Manage Categories

            <ArrowRight
              size={15}
            />
          </Link>
        </div>

        {/* Quick Action */}

        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
            Quick Access
          </p>

          <h2 className="mt-2 text-xl font-black text-primary-900">
            Marketplace
            Categories
          </h2>

          <p className="mt-2 text-sm leading-6 text-primary-500">
            Create, edit,
            deactivate and
            reactivate product
            categories used by
            merchants.
          </p>

          <Link
            to="/admin/categories"
            className="group mt-6 flex items-center justify-between rounded-xl border border-border p-4 transition hover:border-brand-200 hover:bg-brand-50/40"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Shapes
                  size={18}
                />
              </div>

              <div>
                <p className="text-sm font-bold text-primary-900">
                  Manage
                  Categories
                </p>

                <p className="mt-1 text-xs text-primary-400">
                  Open category
                  management.
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

export default AdminDashboard;