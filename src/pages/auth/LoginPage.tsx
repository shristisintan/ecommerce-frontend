import {
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  ShoppingBag,
  Store,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

const LoginPage = () => {
  const navigate =
    useNavigate();

  const {
    login,
  } = useAuth();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  /* ======================================================
     LOGIN
  ====================================================== */

  const handleSubmit =
    async (
      event:
        React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      try {
        setLoading(true);

        setError("");

        const loggedInUser =
          await login({
            email:
              email
                .trim()
                .toLowerCase(),

            password,
          });

        switch (
          loggedInUser.role
        ) {
          case "ADMIN":
            navigate(
              "/admin",
              {
                replace: true,
              }
            );
            break;

          case "MERCHANT":
            navigate(
              "/merchant",
              {
                replace: true,
              }
            );
            break;

          case "BUYER":
          default:
            navigate(
              "/",
              {
                replace: true,
              }
            );
            break;
        }
      } catch (
        loginError
      ) {
        setError(
          loginError instanceof
            Error
            ? loginError.message
            : "Unable to sign in."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-[1180px] overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[0.92fr_1.08fr]">
        {/* =================================================
            BRAND SIDE
        ================================================= */}

        <section className="relative hidden overflow-hidden bg-[#e9f3f1] p-10 lg:flex lg:flex-col lg:justify-between xl:p-12">
          {/* Decoration */}

          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-brand-600/10" />

          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/35" />

          {/* Logo */}

          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center text-3xl font-black tracking-[-0.07em] text-primary-900"
            >
              NOVA
              <span className="text-brand-600">
                .
              </span>
            </Link>

            <p className="mt-2 text-xs font-semibold text-primary-500">
              Multi-store Marketplace
            </p>
          </div>

          {/* Main Content */}

          <div className="relative z-10 max-w-[440px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              One Marketplace
            </p>

            <h1 className="mt-4 text-[46px] font-black leading-[0.98] tracking-[-0.055em] text-primary-900 xl:text-[52px]">
              Shop, sell and manage
              with NOVA.
            </h1>

            <p className="mt-5 max-w-[390px] text-sm leading-7 text-primary-600">
              A secure multi-store
              marketplace connecting
              buyers and merchants
              through one simple
              platform.
            </p>

            {/* Role Information */}

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <ShoppingBag
                    size={17}
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-primary-900">
                    Buyers
                  </p>

                  <p className="mt-0.5 text-xs text-primary-500">
                    Shop products and
                    manage orders.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Store
                    size={17}
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-primary-900">
                    Merchants
                  </p>

                  <p className="mt-0.5 text-xs text-primary-500">
                    Manage products,
                    stock and orders.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <ShieldCheck
                    size={17}
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-primary-900">
                    Administrators
                  </p>

                  <p className="mt-0.5 text-xs text-primary-500">
                    Control marketplace
                    configuration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}

          <div className="relative z-10 flex items-center gap-2 text-xs font-medium text-primary-500">
            <ShieldCheck
              size={14}
              className="text-brand-700"
            />

            Secure access to your NOVA
            account
          </div>
        </section>

        {/* =================================================
            LOGIN SIDE
        ================================================= */}

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-16">
          <div className="w-full max-w-[430px]">
            {/* Mobile Navigation */}

            <div className="mb-10 flex items-center justify-between lg:hidden">
              <Link
                to="/"
                className="text-3xl font-black tracking-[-0.07em] text-primary-900"
              >
                NOVA
                <span className="text-brand-600">
                  .
                </span>
              </Link>

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition hover:text-brand-700"
              >
                <ArrowLeft
                  size={15}
                />

                Store
              </Link>
            </div>

            {/* Heading */}

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
                Account Access
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] text-primary-900 sm:text-4xl">
                Welcome back
              </h1>

              <p className="mt-3 text-sm leading-6 text-primary-500">
                Sign in with your NOVA
                account to continue.
              </p>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-8"
            >
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-primary-800"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={
                    email
                  }
                  onChange={(
                    event
                  ) => {
                    setEmail(
                      event.target
                        .value
                    );

                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
                />
              </div>

              {/* Password */}

              <div className="mt-5">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-primary-800"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    autoComplete="current-password"
                    value={
                      password
                    }
                    onChange={(
                      event
                    ) => {
                      setPassword(
                        event.target
                          .value
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-border bg-white px-4 pr-12 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(
                        (
                          current
                        ) =>
                          !current
                      )
                    }
                    className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-primary-400 transition hover:text-brand-700"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}

              {error && (
                <div className="mt-5 rounded-xl border border-danger/15 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
                  {error}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={
                  loading
                }
                className="mt-7 flex h-12 w-full items-center justify-center rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>
            </form>

            {/* Register */}

            <div className="mt-7 border-t border-border pt-6 text-center">
              <p className="text-sm text-primary-500">
                Don't have a buyer or
                merchant account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-brand-700 transition hover:text-brand-800"
                >
                  Create account
                </Link>
              </p>
            </div>

            {/* Back desktop */}

            <div className="mt-8 hidden justify-center lg:flex">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary-400 transition hover:text-brand-700"
              >
                <ArrowLeft
                  size={14}
                />

                Back to NOVA marketplace
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;