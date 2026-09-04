import {
  LayoutDashboard,
  LogOut,
  Menu,
  Shapes,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

const AdminLayout = () => {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const {
    user,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const handleLogout =
    async () => {
      await logout();

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Categories",
      path:
        "/admin/categories",
      icon: Shapes,
      end: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <header className="flex h-16 items-center justify-between border-b border-border bg-white px-5 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <ShieldCheck
              size={18}
            />
          </div>

          <div>
            <p className="text-lg font-black tracking-[-0.05em] text-primary-900">
              NOVA
              <span className="text-brand-600">
                .
              </span>
            </p>

            <p className="text-[10px] font-semibold text-primary-400">
              Admin Portal
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() =>
            setSidebarOpen(
              true
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-primary-700"
        >
          <Menu
            size={20}
          />
        </button>
      </header>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() =>
            setSidebarOpen(
              false
            )
          }
          className="fixed inset-0 z-40 bg-primary-900/35 lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[250px]
          flex-col border-r border-border bg-white
          transition-transform duration-200
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}

        <div className="flex h-20 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <ShieldCheck
                size={19}
              />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-[-0.05em] text-primary-900">
                NOVA
                <span className="text-brand-600">
                  .
                </span>
              </h1>

              <p className="text-[11px] font-medium text-primary-400">
                Admin Portal
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() =>
              setSidebarOpen(
                false
              )
            }
            className="rounded-lg p-2 text-primary-400 hover:bg-primary-50 lg:hidden"
          >
            <X
              size={19}
            />
          </button>
        </div>

        {/* Admin Profile */}

        <div className="px-4 pt-5">
          <div className="rounded-xl bg-primary-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary-400">
              Administrator
            </p>

            <p className="mt-2 truncate text-sm font-bold text-primary-900">
              {user?.name}
            </p>

            <div className="mt-2 inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-brand-700">
              Admin
            </div>
          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-1 px-4 py-6">
          {menuItems.map(
            ({
              label,
              path,
              icon: Icon,
              end,
            }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                onClick={() =>
                  setSidebarOpen(
                    false
                  )
                }
                className={({
                  isActive,
                }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-primary-500 hover:bg-primary-50 hover:text-primary-900",
                  ].join(
                    " "
                  )
                }
              >
                {({
                  isActive,
                }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={
                        isActive
                          ? 2.2
                          : 1.8
                      }
                    />

                    <span>
                      {
                        label
                      }
                    </span>
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>

        {/* Logout */}

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={() =>
              void handleLogout()
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-primary-500 transition hover:bg-danger-soft hover:text-danger"
          >
            <LogOut
              size={18}
            />

            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="lg:ml-[250px]">
        <div className="mx-auto max-w-[1440px] p-5 sm:p-7 lg:p-9">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;