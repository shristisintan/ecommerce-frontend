import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/buyer/HomePage";

import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailure from "./pages/payment/PaymentFailure";
import ProductsPage from "./pages/buyer/ProductsPage";
import ProductDetailsPage from "./pages/buyer/ProductDetailsPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import CartPage from "./pages/buyer/CartPage";
import CheckoutPage from "./pages/buyer/CheckoutPage";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route
      path="/products"
      element={<ProductsPage />}
    />

    <Route
    path="/products/:id"
    element={<ProductDetailsPage />}
  />
  <Route
  path="/login"
  element={<LoginPage />}
/>

<Route
  path="/register"
  element={<RegisterPage />}
/>

<Route
  path="/cart"
  element={<CartPage />}
/>
<Route
  path="/checkout"
  element={<CheckoutPage />}
/>
    

      <Route
        path="/payment/success"
        element={<PaymentSuccess />}
      />

      <Route
        path="/payment/failure"
        element={<PaymentFailure />}
      />

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