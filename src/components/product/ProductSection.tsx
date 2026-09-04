import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  PackageOpen,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import Container from "../common/Container";
import ProductCard from "./ProductCard";

import {
  getProducts,
} from "../../api/productApi";

import type {
  Product,
} from "../../types/product";

const ProductSkeleton = () => {
  return (
    <div>
      <div className="aspect-square animate-pulse rounded-xl bg-primary-100" />

      <div className="mt-3 h-3 w-20 animate-pulse rounded bg-primary-100" />

      <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-primary-100" />

      <div className="mt-2 h-5 w-1/3 animate-pulse rounded bg-primary-100" />
    </div>
  );
};

const ProductSection = () => {
  const [
    products,
    setProducts,
  ] =
    useState<Product[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const loadProducts =
      async () => {
        try {
          setLoading(true);

          setError("");

          const result =
            await getProducts({
              page: 1,
              limit: 4,
            });

          setProducts(
            result.data
          );
        } catch (
          error
        ) {
          setError(
            error instanceof
              Error
              ? error.message
              : "Unable to load products"
          );
        } finally {
          setLoading(false);
        }
      };

    void loadProducts();
  }, []);

  return (
    <section
      id="new-arrivals"
      className="scroll-mt-28 bg-white py-12 sm:py-14"
    >
      <Container>
        {/* Heading */}

        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Latest Products
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-primary-900 sm:text-3xl">
              New Arrivals
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 text-sm font-semibold text-primary-600 transition hover:text-brand-700 sm:flex"
          >
            View all

            <ArrowRight
              size={15}
            />
          </Link>
        </div>

        {/* Content */}

        <div className="mt-7">
          {loading && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
              {Array.from({
                length: 4,
              }).map(
                (
                  _,
                  index
                ) => (
                  <ProductSkeleton
                    key={
                      index
                    }
                  />
                )
              )}
            </div>
          )}

          {!loading &&
            error && (
              <div className="rounded-xl border border-danger/15 bg-danger-soft px-6 py-10 text-center">
                <p className="font-semibold text-danger">
                  Unable to load
                  products
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  {error}
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            products.length ===
              0 && (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl bg-primary-50 text-center">
                <PackageOpen
                  size={32}
                  className="text-primary-300"
                />

                <p className="mt-3 font-semibold text-primary-900">
                  No products yet
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            products.length >
              0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
                {products.map(
                  (
                    product
                  ) => (
                    <ProductCard
                      key={
                        product._id
                      }
                      product={
                        product
                      }
                    />
                  )
                )}
              </div>
            )}
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            to="/products"
            className="flex h-11 items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-primary-800"
          >
            View all products

            <ArrowRight
              size={15}
            />
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default ProductSection;