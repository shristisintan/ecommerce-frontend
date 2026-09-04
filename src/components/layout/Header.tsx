import {
  LogOut,
  Menu,
  PackageCheck,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Container from "../common/Container";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useCart,
} from "../../context/CartContext";

const Header = () => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    user,
    isAuthenticated,
    loading: authLoading,
    logout,
  } = useAuth();

  const {
    itemCount,
  } = useCart();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    mobileSearchOpen,
    setMobileSearchOpen,
  ] = useState(false);

  const [
    searchValue,
    setSearchValue,
  ] = useState("");

  /* ======================================================
     SEARCH SYNC
  ====================================================== */

  useEffect(() => {
    const params =
      new URLSearchParams(
        location.search
      );

    setSearchValue(
      params.get("search") ??
        ""
    );
  }, [location.search]);

  /* ======================================================
     SCROLL TO HASH SECTION
  ====================================================== */

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const sectionId =
      location.hash.replace(
        "#",
        ""
      );

    const timer =
      window.setTimeout(
        () => {
          const section =
            document.getElementById(
              sectionId
            );

          section?.scrollIntoView({
            behavior:
              "smooth",
            block: "start",
          });
        },
        100
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    location.pathname,
    location.hash,
  ]);

  /* ======================================================
     SEARCH
  ====================================================== */

  const handleSearch = (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value =
      searchValue.trim();

    if (!value) {
      navigate(
        "/products"
      );
    } else {
      navigate(
        `/products?search=${encodeURIComponent(
          value
        )}&page=1`
      );
    }

    setMobileSearchOpen(
      false
    );

    setMobileOpen(
      false
    );
  };

  /* ======================================================
     LOGOUT
  ====================================================== */

  const handleLogout =
    async () => {
      await logout();

      setMobileOpen(
        false
      );

      navigate("/");
    };

  const isBuyer =
    user?.role === "BUYER";

  return (
    <>
      {/* Top bar */}

      <div className="bg-brand-700">
        <Container className="flex min-h-8 items-center justify-center">
          <p className="py-1.5 text-center text-[11px] font-medium tracking-wide text-white/90 sm:text-xs">
            Multiple stores.
            Secure checkout.
            Verified payments.
          </p>
        </Container>
      </div>

      {/* Main header */}

      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-md">
        <Container className="flex h-[72px] items-center gap-5">
          {/* Mobile menu */}

          <button
            type="button"
            aria-label="Open menu"
            className="rounded-lg p-1 text-primary-900 lg:hidden"
            onClick={() =>
              setMobileOpen(
                true
              )
            }
          >
            <Menu
              size={23}
            />
          </button>

          {/* Logo */}

          <Link
            to="/"
            className="shrink-0 text-[27px] font-black tracking-[-0.07em] text-primary-900"
          >
            NOVA
            <span className="text-brand-600">
              .
            </span>
          </Link>

          {/* Desktop navigation */}

          <nav className="hidden items-center gap-6 text-sm font-semibold text-primary-700 lg:flex">
            <Link
              to="/products"
              className="transition hover:text-brand-700"
            >
              Shop
            </Link>

            <Link
              to="/#new-arrivals"
              className="transition hover:text-brand-700"
            >
              New Arrivals
            </Link>

            <Link
              to="/products?sort=price_asc"
              className="transition hover:text-brand-700"
            >
              Best Value
            </Link>
          </nav>

          {/* Search */}

          <form
            onSubmit={
              handleSearch
            }
            className="hidden flex-1 md:block"
          >
            <div className="mx-auto flex h-11 max-w-[680px] items-center gap-3 rounded-full border border-border bg-primary-50 px-4 transition focus-within:border-brand-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-50">
              <Search
                size={18}
                className="text-text-muted"
              />

              <input
                type="search"
                value={
                  searchValue
                }
                onChange={(
                  event
                ) =>
                  setSearchValue(
                    event.target
                      .value
                  )
                }
                placeholder="Search products..."
                className="w-full bg-transparent text-sm text-primary-900 outline-none placeholder:text-text-muted"
              />
            </div>
          </form>

          {/* Actions */}

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Mobile search */}

            <button
              type="button"
              aria-label="Search"
              onClick={() =>
                setMobileSearchOpen(
                  (
                    current
                  ) =>
                    !current
                )
              }
              className="rounded-full p-2.5 text-primary-700 transition hover:bg-primary-50 md:hidden"
            >
              <Search
                size={20}
              />
            </button>

            {/* Buyer Orders */}

            {isBuyer && (
              <Link
                to="/orders"
                title="My Orders"
                aria-label="My Orders"
                className="rounded-full p-2.5 text-primary-700 transition hover:bg-brand-50 hover:text-brand-700"
              >
                <PackageCheck
                  size={20}
                />
              </Link>
            )}

            {/* Cart */}

            {isBuyer && (
              <Link
                to="/cart"
                title="Cart"
                aria-label="Cart"
                className="relative rounded-full p-2.5 text-primary-700 transition hover:bg-brand-50 hover:text-brand-700"
              >
                <ShoppingBag
                  size={20}
                />

                {itemCount >
                  0 && (
                  <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">
                    {itemCount >
                    99
                      ? "99+"
                      : itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* User */}

            {authLoading ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-primary-100" />
            ) : isAuthenticated &&
              user ? (
              <div className="ml-1 flex items-center gap-2">
                <div className="hidden text-right xl:block">
                  <p className="max-w-[120px] truncate text-xs font-semibold text-primary-900">
                    {
                      user.name
                    }
                  </p>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                    {
                      user.role
                    }
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <UserRound
                    size={18}
                  />
                </div>

                <button
                  type="button"
                  aria-label="Logout"
                  title="Logout"
                  onClick={() =>
                    void handleLogout()
                  }
                  className="hidden rounded-full p-2 text-text-muted transition hover:bg-danger-soft hover:text-danger sm:block"
                >
                  <LogOut
                    size={17}
                  />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-1 rounded-full bg-primary-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </Container>

        {/* Mobile search */}

        {mobileSearchOpen && (
          <Container className="pb-4 md:hidden">
            <form
              onSubmit={
                handleSearch
              }
              className="flex h-11 items-center gap-3 rounded-full border border-border bg-primary-50 px-4"
            >
              <Search
                size={17}
                className="text-text-muted"
              />

              <input
                autoFocus
                type="search"
                value={
                  searchValue
                }
                onChange={(
                  event
                ) =>
                  setSearchValue(
                    event.target
                      .value
                  )
                }
                placeholder="Search products..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </form>
          </Container>
        )}
      </header>

      {/* Mobile drawer */}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}

          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-primary-900/45"
            onClick={() =>
              setMobileOpen(
                false
              )
            }
          />

          {/* Drawer */}

          <div className="relative flex h-full w-[84%] max-w-[330px] flex-col bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className="text-2xl font-black tracking-[-0.07em] text-primary-900"
              >
                NOVA
                <span className="text-brand-600">
                  .
                </span>
              </Link>

              <button
                type="button"
                aria-label="Close menu"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className="rounded-full p-2 hover:bg-primary-50"
              >
                <X
                  size={20}
                />
              </button>
            </div>

            {/* User */}

            {isAuthenticated &&
              user && (
                <div className="mt-7 flex items-center gap-3 rounded-xl bg-primary-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <UserRound
                      size={18}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-primary-900">
                      {
                        user.name
                      }
                    </p>

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                      {
                        user.role
                      }
                    </p>
                  </div>
                </div>
              )}

            {/* Navigation */}

            <nav className="mt-7 flex flex-col">
              <Link
                to="/products"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className="border-b border-border py-4 text-sm font-semibold text-primary-800"
              >
                Shop
              </Link>

              <Link
                to="/#new-arrivals"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className="border-b border-border py-4 text-sm font-semibold text-primary-800"
              >
                New Arrivals
              </Link>

              <Link
                to="/products?sort=price_asc"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className="border-b border-border py-4 text-sm font-semibold text-primary-800"
              >
                Best Value
              </Link>

              {isBuyer && (
                <>
                  <Link
                    to="/orders"
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                    className="flex items-center gap-3 border-b border-border py-4 text-sm font-semibold text-primary-800"
                  >
                    <PackageCheck
                      size={18}
                    />

                    My Orders
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                    className="flex items-center justify-between border-b border-border py-4 text-sm font-semibold text-primary-800"
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingBag
                        size={18}
                      />

                      Cart
                    </span>

                    {itemCount >
                      0 && (
                      <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs text-white">
                        {
                          itemCount
                        }
                      </span>
                    )}
                  </Link>
                </>
              )}
            </nav>

            {/* Logged out */}

            {!isAuthenticated && (
              <div className="mt-7 grid gap-3">
                <Link
                  to="/login"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-brand-600 px-6 text-sm font-semibold !text-white transition hover:bg-brand-700"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                  className="rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold !text-white"
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Logout */}

            {isAuthenticated && (
              <button
                type="button"
                onClick={() =>
                  void handleLogout()
                }
                className="mt-auto flex items-center gap-3 border-t border-border pt-5 text-sm font-semibold text-text-secondary"
              >
                <LogOut
                  size={18}
                />

                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;