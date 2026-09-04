import {
  ArrowLeft,
  Eye,
  EyeOff,
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

  const handleSubmit =
    async (
      event: React.FormEvent<HTMLFormElement>
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
    <main className="min-h-screen bg-[#f5f5f5] p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-[1200px] overflow-hidden rounded-[28px] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] lg:grid-cols-2">
        {/* Brand Panel */}

        <section className="hidden bg-black p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <Link
            to="/"
            className="text-3xl font-black tracking-[-0.06em]"
          >
            NOVA
          </Link>

          <div className="max-w-md">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Your marketplace
            </p>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.045em]">
              Everything you need,
              from stores you trust.
            </h1>

            <p className="mt-6 leading-7 text-white/55">
              Discover products from
              multiple merchants with
              secure payments and
              real-time stock
              availability.
            </p>
          </div>

          <p className="text-xs text-white/35">
            Secure shopping with NOVA.
          </p>
        </section>

        {/* Login Form */}

        <section className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-[420px]">
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-2 text-sm text-black/50 transition hover:text-black lg:hidden"
            >
              <ArrowLeft
                size={16}
              />

              Back to store
            </Link>

            <div className="lg:hidden">
              <Link
                to="/"
                className="text-3xl font-black tracking-[-0.06em]"
              >
                NOVA
              </Link>
            </div>

            <h1 className="mt-8 text-4xl font-black tracking-[-0.04em] lg:mt-0">
              Welcome back
            </h1>

            <p className="mt-3 text-sm leading-6 text-black/50">
              Sign in to continue shopping
              or manage your account.
            </p>

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-9"
            >
              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={
                    email
                  }
                  onChange={(
                    event
                  ) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  className="h-13 w-full rounded-2xl border border-black/10 px-4 outline-none transition focus:border-black/40"
                />
              </div>

              {/* Password */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <div className="relative">
                  <input
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
                    ) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                    className="h-13 w-full rounded-2xl border border-black/10 px-4 pr-12 outline-none transition focus:border-black/40"
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={19}
                      />
                    ) : (
                      <Eye
                        size={19}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}

              {error && (
                <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={
                  loading
                }
                className="mt-7 h-13 w-full rounded-full bg-black text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-black/50">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-black"
              >
                Create account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;