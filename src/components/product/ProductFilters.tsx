import { X } from "lucide-react";

import type {
  Category,
} from "../../types/category";

interface ProductFiltersProps {
  categories: Category[];

  selectedCategory: string;

  minPrice: string;
  maxPrice: string;

  onCategoryChange: (
    categoryId: string
  ) => void;

  onMinPriceChange: (
    value: string
  ) => void;

  onMaxPriceChange: (
    value: string
  ) => void;

  onApplyPrice: () => void;

  onClear: () => void;

  mobile?: boolean;

  onClose?: () => void;
}

const ProductFilters = ({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onApplyPrice,
  onClear,
  mobile = false,
  onClose,
}: ProductFiltersProps) => {
  return (
    <aside
      className={
        mobile
          ? "h-full bg-white p-6"
          : "rounded-[20px] border border-black/10 p-6"
      }
    >
      <div className="flex items-center justify-between border-b border-black/10 pb-5">
        <h2 className="text-xl font-bold">
          Filters
        </h2>

        {mobile && (
          <button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-black/10 py-6">
        <h3 className="mb-4 font-semibold">
          Categories
        </h3>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() =>
              onCategoryChange("")
            }
            className={`block w-full text-left text-sm transition ${
              selectedCategory === ""
                ? "font-semibold text-black"
                : "text-black/55 hover:text-black"
            }`}
          >
            All products
          </button>

          {categories.map(
            (category) => (
              <button
                key={category._id}
                type="button"
                onClick={() =>
                  onCategoryChange(
                    category._id
                  )
                }
                className={`block w-full text-left text-sm transition ${
                  selectedCategory ===
                  category._id
                    ? "font-semibold text-black"
                    : "text-black/55 hover:text-black"
                }`}
              >
                {category.name}
              </button>
            )
          )}
        </div>
      </div>

      {/* Price */}
      <div className="border-b border-black/10 py-6">
        <h3 className="mb-4 font-semibold">
          Price
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-xs text-black/45">
              Minimum
            </label>

            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) =>
                onMinPriceChange(
                  event.target.value
                )
              }
              placeholder="NPR 0"
              className="h-11 w-full rounded-xl border border-black/10 px-3 text-sm outline-none transition focus:border-black/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-black/45">
              Maximum
            </label>

            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) =>
                onMaxPriceChange(
                  event.target.value
                )
              }
              placeholder="NPR 10000"
              className="h-11 w-full rounded-xl border border-black/10 px-3 text-sm outline-none transition focus:border-black/30"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onApplyPrice}
          className="mt-4 h-11 w-full rounded-full bg-black text-sm font-medium text-white transition hover:bg-black/80"
        >
          Apply Price
        </button>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="mt-6 h-11 w-full rounded-full border border-black/15 text-sm font-medium transition hover:bg-black hover:text-white"
      >
        Clear Filters
      </button>
    </aside>
  );
};

export default ProductFilters;