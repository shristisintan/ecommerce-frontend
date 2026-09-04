import {
  Link,
} from "react-router-dom";

import Container from "../common/Container";

const Footer = () => {
  const year =
    new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:py-14">
          {/* Brand */}

          <div>
            <Link
              to="/"
              className="inline-flex text-3xl font-black tracking-[-0.06em] text-primary-900"
            >
              NOVA
              <span className="text-brand-600">
                .
              </span>
            </Link>

            <p className="mt-4 max-w-[380px] text-sm leading-6 text-primary-500">
              A multi-store
              ecommerce platform
              for discovering
              products, managing
              orders and completing
              secure purchases.
            </p>
          </div>

          {/* Marketplace */}

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-400">
              Marketplace
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm font-medium text-primary-600">
              <Link
                to="/products"
                className="transition hover:text-brand-700"
              >
                All Products
              </Link>

              <Link
                to="/products?sort=price_asc"
                className="transition hover:text-brand-700"
              >
                Best Value
              </Link>
            </div>
          </div>

          {/* Account */}

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-400">
              Account
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm font-medium text-primary-600">
              <Link
                to="/orders"
                className="transition hover:text-brand-700"
              >
                My Orders
              </Link>

              <Link
                to="/cart"
                className="transition hover:text-brand-700"
              >
                Cart
              </Link>

              <Link
                to="/login"
                className="transition hover:text-brand-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-primary-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} NOVA.
            All rights reserved.
          </p>

          <p className="font-medium text-brand-700">
            Secure payments via
            eSewa
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;