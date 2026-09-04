import {
  lazy,
  Suspense,
} from "react";

import {
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/common/ProtectedRoute";

/* =========================================================
   PUBLIC / BUYER PAGES
========================================================= */

import HomePage from "./pages/buyer/HomePage";
import ProductsPage from "./pages/buyer/ProductsPage";
import ProductDetailsPage from "./pages/buyer/ProductDetailsPage";
import CartPage from "./pages/buyer/CartPage";
import CheckoutPage from "./pages/buyer/CheckoutPage";

/* =========================================================
   AUTH
========================================================= */

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

/* =========================================================
   PAYMENT
========================================================= */

import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailure from "./pages/payment/PaymentFailure";

/* =========================================================
   MERCHANT LAZY LOADS
========================================================= */

const MerchantLayout =
  lazy(() =>
    import(
      "./components/layout/MerchantLayout"
    )
  );

const MerchantDashboard =
  lazy(() =>
    import(
      "./pages/merchant/MerchantDashboard"
    )
  );

const MerchantProductsPage =
  lazy(() =>
    import(
      "./pages/merchant/MerchantProductsPage"
    )
  );

const MerchantOrdersPage =
  lazy(() =>
    import(
      "./pages/merchant/MerchantOrdersPage"
    )
  );

/* =========================================================
   ADMIN LAZY LOADS
========================================================= */

const AdminLayout =
  lazy(() =>
    import(
      "./components/layout/AdminLayout"
    )
  );

const AdminDashboard =
  lazy(() =>
    import(
      "./pages/admin/AdminDashboard"
    )
  );

const AdminCategoriesPage =
  lazy(() =>
    import(
      "./pages/admin/AdminCategoriesPage"
    )
  );

/* =========================================================
   BUYER LAZY LOADS
========================================================= */

const MyOrdersPage =
  lazy(() =>
    import(
      "./pages/buyer/MyOrdersPage"
    )
  );

/* =========================================================
   SHARED LOADER
========================================================= */

const PageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      Loading...
    </div>
  );
};

/* =========================================================
   APP
========================================================= */

const App = () => {
  return (
    <Routes>
      {/* =================================================
          PUBLIC STOREFRONT
      ================================================= */}

      <Route
        path="/"
        element={
          <HomePage />
        }
      />

      <Route
        path="/products"
        element={
          <ProductsPage />
        }
      />

      <Route
        path="/products/:id"
        element={
          <ProductDetailsPage />
        }
      />

      {/* =================================================
          AUTH
      ================================================= */}

      <Route
        path="/login"
        element={
          <LoginPage />
        }
      />

      <Route
        path="/register"
        element={
          <RegisterPage />
        }
      />

      {/* =================================================
          BUYER - CART
      ================================================= */}

      <Route
        path="/cart"
        element={
          <ProtectedRoute
            allowedRoles={[
              "BUYER",
            ]}
          >
            <CartPage />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          BUYER - CHECKOUT
      ================================================= */}

      <Route
        path="/checkout"
        element={
          <ProtectedRoute
            allowedRoles={[
              "BUYER",
            ]}
          >
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          BUYER - MY ORDERS
      ================================================= */}

      <Route
        path="/orders"
        element={
          <ProtectedRoute
            allowedRoles={[
              "BUYER",
            ]}
          >
            <Suspense
              fallback={
                <PageLoader />
              }
            >
              <MyOrdersPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* =================================================
          PAYMENT CALLBACK PAGES

          Keep these top-level because eSewa redirects
          the browser back to them.
      ================================================= */}

      <Route
        path="/payment/success"
        element={
          <PaymentSuccess />
        }
      />

      <Route
        path="/payment/failure"
        element={
          <PaymentFailure />
        }
      />

      {/* =================================================
          MERCHANT PORTAL
      ================================================= */}

      <Route
        path="/merchant"
        element={
          <ProtectedRoute
            allowedRoles={[
              "MERCHANT",
            ]}
          >
            <Suspense
              fallback={
                <PageLoader />
              }
            >
              <MerchantLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        {/* /merchant */}

        <Route
          index
          element={
            <Suspense
              fallback={
                <PageLoader />
              }
            >
              <MerchantDashboard />
            </Suspense>
          }
        />

        {/* /merchant/products */}

        <Route
          path="products"
          element={
            <Suspense
              fallback={
                <PageLoader />
              }
            >
              <MerchantProductsPage />
            </Suspense>
          }
        />

        {/* /merchant/orders */}

        <Route
          path="orders"
          element={
            <Suspense
              fallback={
                <PageLoader />
              }
            >
              <MerchantOrdersPage />
            </Suspense>
          }
        />
      </Route>

      {/* =================================================
          ADMIN PORTAL
      ================================================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRoles={[
              "ADMIN",
            ]}
          >
            <Suspense
              fallback={
                <PageLoader />
              }
            >
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        {/* /admin */}

        <Route
          index
          element={
            <Suspense
              fallback={
                <PageLoader />
              }
            >
              <AdminDashboard />
            </Suspense>
          }
        />

        {/* /admin/categories */}

        <Route
          path="categories"
          element={
            <Suspense
              fallback={
                <PageLoader />
              }
            >
              <AdminCategoriesPage />
            </Suspense>
          }
        />
      </Route>

      {/* =================================================
          404
          ALWAYS KEEP LAST
      ================================================= */}

      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-semibold">
                404
              </h1>

              <p className="mt-3 text-gray-500">
                Page not found
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default App;