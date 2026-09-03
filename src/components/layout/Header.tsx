import {
  ChevronDown,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
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
  const navigate = useNavigate();
  const location = useLocation();

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

  /*
   * Keep search input synced with
   * ?search= value in the URL.
   */
  useEffect(() => {
    const params =
      new URLSearchParams(
        location.search
      );

    setSearchValue(
      params.get("search") ?? ""
    );
  }, [location.search]);

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value =
      searchValue.trim();

    if (!value) {
      navigate("/products");

      setMobileSearchOpen(false);
      setMobileOpen(false);

      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        value
      )}&page=1`
    );

    setMobileSearchOpen(false);
    setMobileOpen(false);
  };

  const handleLogout =
    async () => {
      await logout();

      setMobileOpen(false);

      navigate("/");
    };

  const isBuyer =
    user?.role === "BUYER";

  return (
    <>
      {/* Promotion Bar */}
      <div className="bg-black text-white">
        <Container className="relative flex min-h-9 items-center justify-center py-2">
          <p className="text-center text-xs sm:text-sm">
            Sign up and get 20% off your first order.{" "}
            <Link
              to="/register"
              className="font-medium underline underline-offset-2"
            >
              Sign Up Now
            </Link>
          </p>

          <button
            type="button"
            aria-label="Close promotion"
            className="absolute right-4 hidden text-white/70 transition hover:text-white sm:block"
          >
            <X size={16} />
          </button>
        </Container>
      </div>

      {/* Main Header */}
      <header className="border-b border-black/5 bg-white">
        <Container className="flex h-[76px] items-center gap-4 lg:gap-7">
          {/* Mobile Menu */}
          <button
            type="button"
            aria-label="Open navigation"
            className="shrink-0 lg:hidden"
            onClick={() =>
              setMobileOpen(true)
            }
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 text-2xl font-black tracking-[-0.06em] sm:text-3xl"
          >
            NOVA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden shrink-0 items-center gap-5 text-sm lg:flex xl:gap-6">
            <Link
              to="/products"
              className="flex items-center gap-1 transition-opacity hover:opacity-60"
            >
              Shop

              <ChevronDown
                size={15}
              />
            </Link>

            <Link
              to="/products?sort=price_asc"
              className="transition-opacity hover:opacity-60"
            >
              Best Value
            </Link>

            <Link
              to="/products"
              className="transition-opacity hover:opacity-60"
            >
              New Arrivals
            </Link>

            <Link
              to="/products"
              className="transition-opacity hover:opacity-60"
            >
              Products
            </Link>
          </nav>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden flex-1 md:block"
          >
            <div className="flex h-12 items-center gap-3 rounded-full bg-[#f0f0f0] px-4 transition focus-within:ring-1 focus-within:ring-black/20">
              <Search
                size={20}
                className="shrink-0 text-black/40"
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
                placeholder="Search for products..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
              />
            </div>
          </form>

          {/* Header Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-4">
            {/* Mobile Search */}
            <button
              type="button"
              aria-label="Search"
              className="md:hidden"
              onClick={() =>
                setMobileSearchOpen(
                  (current) =>
                    !current
                )
              }
            >
              <Search size={22} />
            </button>

            {/* Buyer Cart */}
            {isBuyer && (
              <Link
                to="/cart"
                aria-label={`Cart with ${itemCount} items`}
                className="relative transition-opacity hover:opacity-60"
              >
                <ShoppingCart
                  size={22}
                />

                {itemCount >
                  0 && (
                  <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold leading-none text-white">
                    {itemCount >
                    99
                      ? "99+"
                      : itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Logged In User */}
            {authLoading ? (
                <div className="h-9 w-9 animate-pulse rounded-full bg-[#f0f0f0]" />
                ) : isAuthenticated &&
                user ? (
              <div className="flex items-center gap-3">
                {/* User name */}
                <div className="hidden text-right xl:block">
                  <p className="max-w-[130px] truncate text-xs font-semibold">
                    {user.name}
                  </p>

                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-black/40">
                    {user.role}
                  </p>
                </div>

                {/* Avatar */}
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f0f0]"
                  title={
                    user.name
                  }
                >
                  <UserRound
                    size={18}
                  />
                </div>

                {/* Logout */}
                <button
                  type="button"
                  aria-label="Logout"
                  title="Logout"
                  onClick={() =>
                    void handleLogout()
                  }
                  className="text-black/45 transition hover:text-black"
                >
                  <LogOut
                    size={18}
                  />
                </button>
              </div>
            ) : (
              /* Logged Out */
              <Link
                to="/login"
                aria-label="Account"
                className="transition-opacity hover:opacity-60"
              >
                <UserRound
                  size={22}
                />
              </Link>
            )}
          </div>
        </Container>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <Container className="pb-4 md:hidden">
            <form
              onSubmit={
                handleSearch
              }
              className="flex h-11 items-center gap-3 rounded-full bg-[#f0f0f0] px-4"
            >
              <Search
                size={18}
                className="shrink-0 text-black/40"
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
                placeholder="Search for products..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
              />
            </form>
          </Container>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setMobileOpen(false)
            }
          />

          {/* Drawer */}
          <div className="relative flex h-full w-[82%] max-w-[330px] flex-col bg-white p-6 shadow-xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between">
              <Link
                to="/"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className="text-2xl font-black tracking-[-0.06em]"
              >
                NOVA
              </Link>

              <button
                type="button"
                aria-label="Close navigation"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
              >
                <X size={22} />
              </button>
            </div>

            {/* Logged-in mobile account */}
            {isAuthenticated &&
              user && (
                <div className="mt-7 flex items-center gap-3 rounded-2xl bg-[#f5f5f5] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                    <UserRound
                      size={19}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-black/40">
                      {user.role}
                    </p>
                  </div>
                </div>
              )}

            {/* Navigation */}
            <nav className="mt-8 flex flex-col gap-5 text-base">
              <Link
                to="/products"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
              >
                Shop
              </Link>

              <Link
                to="/products?sort=price_asc"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
              >
                Best Value
              </Link>

              <Link
                to="/products"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
              >
                New Arrivals
              </Link>

              <Link
                to="/products"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
              >
                Products
              </Link>

              {isBuyer && (
                <Link
                  to="/cart"
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                  className="flex items-center justify-between"
                >
                  <span>
                    Cart
                  </span>

                  {itemCount >
                    0 && (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-2 text-xs font-semibold text-white">
                      {
                        itemCount
                      }
                    </span>
                  )}
                </Link>
              )}

              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
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
                  >
                    Create Account
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Logout */}
            {isAuthenticated && (
              <div className="mt-auto border-t border-black/10 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    void handleLogout()
                  }
                  className="flex w-full items-center gap-3 text-sm font-medium text-black/60 transition hover:text-black"
                >
                  <LogOut
                    size={18}
                  />

                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;