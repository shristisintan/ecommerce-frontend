import {
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";

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
          : "rounded-2xl border border-border bg-white p-5"
      }
    >
      {/* Header */}

      <div className="flex items-center justify-between border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={18}
            className="text-brand-700"
          />

          <h2 className="text-base font-bold text-primary-900">
            Filters
          </h2>
        </div>

        {mobile && (
          <button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-primary-500 transition hover:bg-primary-50 hover:text-primary-900"
          >
            <X size={19} />
          </button>
        )}
      </div>

      {/* Categories */}

      <div className="border-b border-border py-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-primary-400">
          Categories
        </h3>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() =>
              onCategoryChange("")
            }
            className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
              selectedCategory === ""
                ? "bg-brand-50 text-brand-700"
                : "text-primary-600 hover:bg-primary-50 hover:text-primary-900"
            }`}
          >
            All Products
          </button>

          {categories.map(
            (category) => (
              <button
                key={
                  category._id
                }
                type="button"
                onClick={() =>
                  onCategoryChange(
                    category._id
                  )
                }
                className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  selectedCategory ===
                  category._id
                    ? "bg-brand-50 text-brand-700"
                    : "text-primary-600 hover:bg-primary-50 hover:text-primary-900"
                }`}
              >
                {
                  category.name
                }
              </button>
            )
          )}
        </div>
      </div>

      {/* Price */}

      <div className="border-b border-border py-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-primary-400">
          Price Range
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-xs font-medium text-primary-500">
              Minimum
            </label>

            <input
              type="number"
              min="0"
              value={
                minPrice
              }
              onChange={(
                event
              ) =>
                onMinPriceChange(
                  event.target
                    .value
                )
              }
              placeholder="0"
              className="h-11 w-full rounded-lg border border-border bg-primary-50 px-3 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-primary-500">
              Maximum
            </label>

            <input
              type="number"
              min="0"
              value={
                maxPrice
              }
              onChange={(
                event
              ) =>
                onMaxPriceChange(
                  event.target
                    .value
                )
              }
              placeholder="10000"
              className="h-11 w-full rounded-lg border border-border bg-primary-50 px-3 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-50"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={
            onApplyPrice
          }
          className="mt-4 h-11 w-full rounded-lg bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Apply Price
        </button>
      </div>

      {/* Clear */}

      <button
        type="button"
        onClick={
          onClear
        }
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-white text-sm font-semibold text-primary-600 transition hover:bg-primary-50 hover:text-primary-900"
      >
        <RotateCcw
          size={15}
        />

        Clear Filters
      </button>
    </aside>
  );
};

export default ProductFilters;