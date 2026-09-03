import {
  Package,
  ShoppingBag,
} from "lucide-react";

import { Link } from "react-router-dom";

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

  return (
    <article className="group">
      <Link
        to={`/products/${product._id}`}
        className="block"
      >
        {/* Image */}
        <div className="relative aspect-[1/1] overflow-hidden rounded-[18px] bg-[#f0f0f0]">
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-black/25">
              <Package size={42} />
            </div>
          )}

          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
              <span className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white">
                Out of stock
              </span>
            </div>
          )}

          {product.stock > 0 &&
            product.stock <= 5 && (
              <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm">
                Only {product.stock} left
              </span>
            )}
        </div>

        {/* Details */}
        <div className="pt-4">
          {merchant && (
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.08em] text-black/40">
              {merchant}
            </p>
          )}

          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-black sm:text-lg">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-lg font-bold tracking-tight sm:text-xl">
              NPR{" "}
              {product.price.toLocaleString(
                "en-NP"
              )}
            </p>

            {product.stock > 0 && (
              <span className="flex items-center gap-1 text-xs text-black/45">
                <ShoppingBag
                  size={14}
                />
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