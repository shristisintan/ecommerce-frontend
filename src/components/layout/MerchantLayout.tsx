import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Store,
  ShoppingBag,
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

const MerchantLayout = () => {
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
      label:
        "Dashboard",
      path:
        "/merchant",
      icon:
        LayoutDashboard,
      end: true,
    },
    {
      label:
        "Products",
      path:
        "/merchant/products",
      icon:
        Package,
      end: false,
    },
    {
  label: "Orders",
  path: "/merchant/orders",
  icon: ShoppingBag,
  end: false,
},
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Mobile Header */}

      <header className="flex h-16 items-center justify-between border-b border-black/10 bg-white px-5 lg:hidden">
        <div className="flex items-center gap-2">
          <Store
            size={20}
          />

          <span className="text-lg font-black tracking-tight">
            NOVA
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            setSidebarOpen(
              true
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5]"
        >
          <Menu
            size={20}
          />
        </button>
      </header>

      {/* Sidebar Overlay */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            setSidebarOpen(
              false
            )
          }
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[270px]
          flex-col border-r border-black/10 bg-white
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

        <div className="flex h-20 items-center justify-between border-b border-black/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
              <Store
                size={19}
              />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight">
                NOVA
              </h1>

              <p className="text-xs text-black/40">
                Merchant Portal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(
                false
              )
            }
            className="lg:hidden"
          >
            <X
              size={20}
            />
          </button>
        </div>

        {/* Merchant */}

        <div className="mx-4 mt-5 rounded-2xl bg-[#f7f7f7] p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-black/40">
            Signed in as
          </p>

          <p className="mt-1 truncate text-sm font-semibold">
            {user?.name}
          </p>

          <p className="mt-1 text-xs font-medium text-black/40">
            MERCHANT
          </p>
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
                key={
                  path
                }
                to={
                  path
                }
                end={
                  end
                }
                onClick={() =>
                  setSidebarOpen(
                    false
                  )
                }
                className={({
                  isActive,
                }) =>
                  [
                    "relative flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "border-black/5 bg-[#f2f2f2] text-black"
                      : "border-transparent text-black/60 hover:bg-[#f7f7f7] hover:text-black",
                  ].join(
                    " "
                  )
                }
              >
                {({
                  isActive,
                }) => (
                  <>
                    {/* Active Indicator */}

                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-black" />
                    )}

                    <Icon
                      size={18}
                      strokeWidth={
                        isActive
                          ? 2.2
                          : 1.8
                      }
                      className={
                        isActive
                          ? "text-black"
                          : "text-black/50"
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

        <div className="border-t border-black/10 p-4">
          <button
            type="button"
            onClick={() =>
              void handleLogout()
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-black/60 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut
              size={18}
            />

            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}

      <main className="lg:ml-[270px]">
        <div className="mx-auto max-w-[1500px] p-5 sm:p-7 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MerchantLayout;