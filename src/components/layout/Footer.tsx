import {
  Link,
} from "react-router-dom";

import Container from "../common/Container";

const Footer = () => {
  const year =
    new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:py-14">
          <div>
            <Link
              to="/"
              className="text-3xl font-black tracking-[-0.06em]"
            >
              NOVA
              <span className="text-brand-400">
                .
              </span>
            </Link>

            <p className="mt-4 max-w-[380px] text-sm leading-6 text-white/55">
              A multi-store
              ecommerce platform
              for discovering
              products, managing
              orders and completing
              secure purchases.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
              Marketplace
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm text-white/65">
              <Link
                to="/products"
                className="transition hover:text-brand-300"
              >
                All Products
              </Link>

              <Link
                to="/products?sort=price_asc"
                className="transition hover:text-brand-300"
              >
                Best Value
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
              Account
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm text-white/65">
              <Link
                to="/orders"
                className="transition hover:text-brand-300"
              >
                My Orders
              </Link>

              <Link
                to="/cart"
                className="transition hover:text-brand-300"
              >
                Cart
              </Link>

              <Link
                to="/login"
                className="transition hover:text-brand-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} NOVA.
            All rights reserved.
          </p>

          <p>
            Secure payments via
            eSewa
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;