import {
  ArrowLeft,
  Check,
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

type RegistrationType =
  | "BUYER"
  | "MERCHANT";

/* =========================================================
   SLUG
========================================================= */

const createSlug = (
  value: string
) =>
  value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );

/* =========================================================
   REGISTER PAGE
========================================================= */

const RegisterPage = () => {
  const navigate =
    useNavigate();

  const {
    registerBuyer,
    registerMerchant,
  } = useAuth();

  const [
    registrationType,
    setRegistrationType,
  ] =
    useState<RegistrationType>(
      "BUYER"
    );

  const [
    name,
    setName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    storeName,
    setStoreName,
  ] = useState("");

  const [
    storeSlug,
    setStoreSlug,
  ] = useState("");

  const [
    storeSlugEdited,
    setStoreSlugEdited,
  ] = useState(false);

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

  const isMerchant =
    registrationType ===
    "MERCHANT";

  /* ======================================================
     ERROR
  ====================================================== */

  const clearError = () => {
    if (error) {
      setError("");
    }
  };

  /* ======================================================
     ACCOUNT TYPE
  ====================================================== */

  const handleAccountType = (
    type: RegistrationType
  ) => {
    setRegistrationType(
      type
    );

    setError("");
  };

  /* ======================================================
     STORE NAME
  ====================================================== */

  const handleStoreNameChange = (
    value: string
  ) => {
    setStoreName(
      value
    );

    if (
      !storeSlugEdited
    ) {
      setStoreSlug(
        createSlug(value)
      );
    }

    clearError();
  };

  /* ======================================================
     STORE SLUG
  ====================================================== */

  const handleStoreSlugChange = (
    value: string
  ) => {
    setStoreSlug(
      createSlug(value)
    );

    setStoreSlugEdited(
      true
    );

    clearError();
  };

  /* ======================================================
     SUBMIT
  ====================================================== */

  const handleSubmit =
    async (
      event:
        React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      const cleanedName =
        name.trim();

      const cleanedEmail =
        email
          .trim()
          .toLowerCase();

      const cleanedStoreName =
        storeName.trim();

      const cleanedStoreSlug =
        storeSlug
          .trim()
          .toLowerCase();

      /* Name */

      if (
        cleanedName.length <
        2
      ) {
        setError(
          "Name must contain at least 2 characters."
        );

        return;
      }

      /* Password */

      if (
        password.length < 8
      ) {
        setError(
          "Password must be at least 8 characters."
        );

        return;
      }

      /* Merchant fields */

      if (isMerchant) {
        if (
          cleanedStoreName.length <
          2
        ) {
          setError(
            "Store name must contain at least 2 characters."
          );

          return;
        }

        if (
          cleanedStoreSlug.length <
          2
        ) {
          setError(
            "Store slug must contain at least 2 characters."
          );

          return;
        }

        if (
          !/^[a-z0-9-]+$/.test(
            cleanedStoreSlug
          )
        ) {
          setError(
            "Store slug may contain lowercase letters, numbers and hyphens only."
          );

          return;
        }
      }

      try {
        setLoading(true);

        setError("");

        /* ===============================================
           MERCHANT
        =============================================== */

        if (isMerchant) {
          await registerMerchant({
            name:
              cleanedName,

            email:
              cleanedEmail,

            password,

            storeName:
              cleanedStoreName,

            storeSlug:
              cleanedStoreSlug,
          });

          navigate(
            "/merchant",
            {
              replace: true,
            }
          );

          return;
        }

        /* ===============================================
           BUYER
        =============================================== */

        await registerBuyer({
          name:
            cleanedName,

          email:
            cleanedEmail,

          password,
        });

        navigate(
          "/",
          {
            replace: true,
          }
        );
      } catch (
        registerError
      ) {
        setError(
          registerError instanceof
            Error
            ? registerError.message
            : "Unable to create account."
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================================================
     PAGE
  ====================================================== */

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-[1180px] overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[0.92fr_1.08fr]">
        {/* =================================================
            LEFT BRAND PANEL
        ================================================= */}

        <section className="relative hidden overflow-hidden bg-[#e9f3f1] p-10 lg:flex lg:flex-col lg:justify-between xl:p-12">
          {/* Decorative shapes */}

          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-brand-600/10" />

          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/35" />

          {/* Brand */}

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

          {/* Main */}

          <div className="relative z-10 max-w-[440px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Join NOVA
            </p>

            <h1 className="mt-4 text-[46px] font-black leading-[0.98] tracking-[-0.055em] text-primary-900 xl:text-[52px]">
              Shop or sell.
              One marketplace.
            </h1>

            <p className="mt-5 max-w-[390px] text-sm leading-7 text-primary-600">
              Create the account
              that fits you and
              become part of the
              NOVA marketplace.
            </p>

            {/* Buyer */}

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <ShoppingBag
                    size={17}
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-primary-900">
                    Buyer Account
                  </p>

                  <p className="mt-0.5 text-xs text-primary-500">
                    Discover products,
                    checkout and manage
                    your orders.
                  </p>
                </div>
              </div>

              {/* Merchant */}

              <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Store
                    size={17}
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-primary-900">
                    Merchant Account
                  </p>

                  <p className="mt-0.5 text-xs text-primary-500">
                    Create your store
                    and manage products,
                    stock and orders.
                  </p>
                </div>
              </div>

              {/* Security */}

              <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <ShieldCheck
                    size={17}
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-primary-900">
                    Secure Accounts
                  </p>

                  <p className="mt-0.5 text-xs text-primary-500">
                    Role-based access
                    keeps marketplace
                    areas separated.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}

          <div className="relative z-10 flex items-center gap-2 text-xs font-medium text-primary-500">
            <Check
              size={14}
              className="text-brand-700"
            />

            Buyer and merchant
            registration
          </div>
        </section>

        {/* =================================================
            FORM PANEL
        ================================================= */}

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-[450px]">
            {/* Mobile Header */}

            <div className="mb-9 flex items-center justify-between lg:hidden">
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
                Create Account
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] text-primary-900 sm:text-4xl">
                Join NOVA
              </h1>

              <p className="mt-3 text-sm leading-6 text-primary-500">
                Choose how you want
                to use the
                marketplace.
              </p>
            </div>

            {/* =================================================
                ACCOUNT TYPE
            ================================================= */}

            <div className="mt-7 grid grid-cols-2 gap-3">
              {/* Buyer */}

              <button
                type="button"
                onClick={() =>
                  handleAccountType(
                    "BUYER"
                  )
                }
                className={`rounded-xl border p-4 text-left transition ${
                  registrationType ===
                  "BUYER"
                    ? "border-brand-400 bg-brand-50 ring-2 ring-brand-50"
                    : "border-border bg-white hover:border-brand-200"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    registrationType ===
                    "BUYER"
                      ? "bg-brand-600 text-white"
                      : "bg-primary-50 text-primary-500"
                  }`}
                >
                  <ShoppingBag
                    size={17}
                  />
                </div>

                <p className="mt-3 text-sm font-bold text-primary-900">
                  Buyer
                </p>

                <p className="mt-1 text-xs leading-5 text-primary-400">
                  I want to shop
                  products.
                </p>
              </button>

              {/* Merchant */}

              <button
                type="button"
                onClick={() =>
                  handleAccountType(
                    "MERCHANT"
                  )
                }
                className={`rounded-xl border p-4 text-left transition ${
                  registrationType ===
                  "MERCHANT"
                    ? "border-brand-400 bg-brand-50 ring-2 ring-brand-50"
                    : "border-border bg-white hover:border-brand-200"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    registrationType ===
                    "MERCHANT"
                      ? "bg-brand-600 text-white"
                      : "bg-primary-50 text-primary-500"
                  }`}
                >
                  <Store
                    size={17}
                  />
                </div>

                <p className="mt-3 text-sm font-bold text-primary-900">
                  Merchant
                </p>

                <p className="mt-1 text-xs leading-5 text-primary-400">
                  I want to sell
                  products.
                </p>
              </button>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-7"
            >
              {/* Name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-primary-800"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  required
                  minLength={2}
                  autoComplete="name"
                  value={
                    name
                  }
                  onChange={(
                    event
                  ) => {
                    setName(
                      event.target
                        .value
                    );

                    clearError();
                  }}
                  placeholder="Your full name"
                  className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
                />
              </div>

              {/* Email */}

              <div className="mt-5">
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

                    clearError();
                  }}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
                />
              </div>

              {/* =================================================
                  MERCHANT STORE FIELDS
              ================================================= */}

              {isMerchant && (
                <>
                  {/* Store Name */}

                  <div className="mt-5">
                    <label
                      htmlFor="storeName"
                      className="mb-2 block text-sm font-semibold text-primary-800"
                    >
                      Store Name
                    </label>

                    <input
                      id="storeName"
                      type="text"
                      required
                      minLength={2}
                      value={
                        storeName
                      }
                      onChange={(
                        event
                      ) =>
                        handleStoreNameChange(
                          event.target
                            .value
                        )
                      }
                      placeholder="e.g. Himalayan Fashion"
                      className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
                    />
                  </div>

                  {/* Store Slug */}

                  <div className="mt-5">
                    <label
                      htmlFor="storeSlug"
                      className="mb-2 block text-sm font-semibold text-primary-800"
                    >
                      Store Slug
                    </label>

                    <input
                      id="storeSlug"
                      type="text"
                      required
                      minLength={2}
                      value={
                        storeSlug
                      }
                      onChange={(
                        event
                      ) =>
                        handleStoreSlugChange(
                          event.target
                            .value
                        )
                      }
                      placeholder="himalayan-fashion"
                      className="h-12 w-full rounded-xl border border-border bg-white px-4 font-mono text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
                    />

                    <p className="mt-2 text-xs leading-5 text-primary-400">
                      Generated from
                      your store name.
                      Use lowercase
                      letters, numbers
                      and hyphens only.
                    </p>
                  </div>
                </>
              )}

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
                    minLength={8}
                    autoComplete="new-password"
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

                      clearError();
                    }}
                    placeholder="Minimum 8 characters"
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

                <p className="mt-2 text-xs text-primary-400">
                  Use at least 8
                  characters.
                </p>
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
                  ? isMerchant
                    ? "Creating store..."
                    : "Creating account..."
                  : isMerchant
                    ? "Create Merchant Account"
                    : "Create Buyer Account"}
              </button>
            </form>

            {/* Login */}

            <div className="mt-7 border-t border-border pt-6 text-center">
              <p className="text-sm text-primary-500">
                Already have an
                account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-brand-700 transition hover:text-brand-800"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Admin Note */}

            <div className="mt-5 rounded-xl bg-primary-50 px-4 py-3 text-center">
              <p className="text-xs leading-5 text-primary-500">
                Administrator
                accounts are
                created securely
                by the system and
                cannot be registered
                publicly.
              </p>
            </div>

            {/* Desktop Back */}

            <div className="mt-7 hidden justify-center lg:flex">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary-400 transition hover:text-brand-700"
              >
                <ArrowLeft
                  size={14}
                />

                Back to NOVA
                marketplace
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;