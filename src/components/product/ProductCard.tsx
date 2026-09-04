import {
  Package,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import type {
  Product,
  ProductTenant,
} from "../../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({
  product,
}: ProductCardProps) => {
  const merchant =
    typeof product.tenantId ===
    "object"
      ? (
          product.tenantId as ProductTenant
        ).name
      : null;

  const image =
    product.images?.[0];

  const outOfStock =
    product.stock <= 0;

  const lowStock =
    product.stock > 0 &&
    product.stock <= 5;

  return (
    <article className="group">
      <Link
        to={`/products/${product._id}`}
        className="block"
      >
        {/* Product image */}

        <div className="relative aspect-square overflow-hidden rounded-xl bg-primary-50">
          {image ? (
            <img
              src={image}
              alt={
                product.name
              }
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-primary-300">
              <Package
                size={40}
              />
            </div>
          )}

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/75">
              <span className="rounded-full bg-primary-900 px-4 py-2 text-xs font-semibold text-white">
                Out of stock
              </span>
            </div>
          )}

          {lowStock && (
            <span className="absolute left-3 top-3 rounded-full bg-warning-soft px-3 py-1.5 text-[10px] font-bold text-warning shadow-sm">
              Only{" "}
              {
                product.stock
              }{" "}
              left
            </span>
          )}
        </div>

        {/* Product information */}

        <div className="pt-3">
          {merchant && (
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-700">
              {merchant}
            </p>
          )}

          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-primary-900 sm:text-base">
            {
              product.name
            }
          </h3>

          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-base font-black tracking-tight text-primary-900 sm:text-lg">
              NPR{" "}
              {product.price.toLocaleString(
                "en-NP"
              )}
            </p>

            {!outOfStock && (
              <span className="text-[10px] font-semibold text-primary-400">
                In stock
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;