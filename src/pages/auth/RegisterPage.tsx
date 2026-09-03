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

import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const navigate =
    useNavigate();

  const { registerBuyer } =
    useAuth();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (
        password.length < 8
      ) {
        setError(
          "Password must be at least 8 characters."
        );

        return;
      }

      try {
        setLoading(true);
        setError("");

        await registerBuyer({
          name:
            name.trim(),

          email:
            email
              .trim()
              .toLowerCase(),

          password,
        });

        navigate("/");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to create account."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <main className="min-h-screen bg-[#f5f5f5] p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-[1200px] overflow-hidden rounded-[28px] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] lg:grid-cols-2">
        <section className="hidden bg-black p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <Link
            to="/"
            className="text-3xl font-black tracking-[-0.06em]"
          >
            NOVA
          </Link>

          <div className="max-w-md">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Join NOVA
            </p>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.045em]">
              A simpler way to shop
              across multiple stores.
            </h1>

            <p className="mt-6 leading-7 text-white/55">
              One account gives you
              access to products from
              different merchants,
              secure checkout, and your
              complete order history.
            </p>
          </div>

          <p className="text-xs text-white/35">
            Create your buyer account.
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-[420px]">
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-2 text-sm text-black/50 lg:hidden"
            >
              <ArrowLeft size={16} />
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
              Create account
            </h1>

            <p className="mt-3 text-sm leading-6 text-black/50">
              Create your buyer account
              and start shopping.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8"
            >
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full name
                </label>

                <input
                  required
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target
                        .value
                    )
                  }
                  placeholder="Your full name"
                  className="h-13 w-full rounded-2xl border border-black/10 px-4 outline-none transition focus:border-black/40"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target
                        .value
                    )
                  }
                  placeholder="you@example.com"
                  className="h-13 w-full rounded-2xl border border-black/10 px-4 outline-none transition focus:border-black/40"
                />
              </div>

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
                    minLength={8}
                    autoComplete="new-password"
                    value={
                      password
                    }
                    onChange={(
                      event
                    ) =>
                      setPassword(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Minimum 8 characters"
                    className="h-13 w-full rounded-2xl border border-black/10 px-4 pr-12 outline-none transition focus:border-black/40"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) =>
                          !value
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

              {error && (
                <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-7 h-13 w-full rounded-full bg-black text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50"
              >
                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-black/50">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-black"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;