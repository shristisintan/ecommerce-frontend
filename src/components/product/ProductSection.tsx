import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  PackageOpen,
} from "lucide-react";

import { Link } from "react-router-dom";

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
    <div className="animate-pulse">
      <div className="aspect-square rounded-[18px] bg-black/5" />

      <div className="mt-4 h-3 w-20 rounded bg-black/5" />

      <div className="mt-3 h-5 w-4/5 rounded bg-black/10" />

      <div className="mt-3 h-5 w-1/3 rounded bg-black/10" />
    </div>
  );
};

const ProductSection = () => {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

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
        } catch (error) {
          setError(
            error instanceof Error
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
    <section className="bg-white py-16 sm:py-20">
      <Container>
        {/* Heading */}
        <div className="mb-9 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
              Fresh picks
            </p>

            <h2 className="text-3xl font-black uppercase tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              New Arrivals
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 text-sm font-medium transition-opacity hover:opacity-60 sm:flex"
          >
            View all
            <ArrowRight
              size={17}
            />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <ProductSkeleton
                key={index}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading &&
          error && (
            <div className="rounded-2xl border border-black/10 bg-[#fafafa] px-6 py-10 text-center">
              <p className="font-medium">
                We couldn't load the
                latest products.
              </p>

              <p className="mt-1 text-sm text-black/50">
                {error}
              </p>
            </div>
          )}

        {/* Empty */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl bg-[#f7f7f7] text-center">
              <PackageOpen
                size={36}
                className="text-black/30"
              />

              <h3 className="mt-4 font-semibold">
                No products yet
              </h3>

              <p className="mt-1 text-sm text-black/50">
                New products will appear
                here when merchants add
                them.
              </p>
            </div>
          )}

        {/* Products */}
        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
              {products.map(
                (product) => (
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

        {/* Mobile View All */}
        <div className="mt-10 sm:hidden">
          <Link
            to="/products"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-black/15 text-sm font-medium"
          >
            View all products
            <ArrowRight
              size={16}
            />
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default ProductSection;