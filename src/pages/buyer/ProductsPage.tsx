import {
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

import {
  useSearchParams,
} from "react-router-dom";

import Header from "../../components/layout/Header";
import Container from "../../components/common/Container";
import ProductCard from "../../components/product/ProductCard";
import ProductFilters from "../../components/product/ProductFilters";

import {
  getProducts,
} from "../../api/productApi";

import {
  getCategories,
} from "../../api/categoryApi";

import type {
  Product,
} from "../../types/product";

import type {
  Category,
} from "../../types/category";

const PRODUCTS_PER_PAGE = 8;

const ProductsPage = () => {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalProducts, setTotalProducts] =
    useState(0);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [minPriceInput, setMinPriceInput] =
    useState(
      searchParams.get(
        "minPrice"
      ) ?? ""
    );

  const [maxPriceInput, setMaxPriceInput] =
    useState(
      searchParams.get(
        "maxPrice"
      ) ?? ""
    );

  const page = Math.max(
    1,
    Number(
      searchParams.get(
        "page"
      ) ?? "1"
    )
  );

  const search =
    searchParams.get(
      "search"
    ) ?? "";

  const categoryId =
    searchParams.get(
      "categoryId"
    ) ?? "";

  const sort =
    searchParams.get(
      "sort"
    ) ?? "";

  const minPrice =
    searchParams.get(
      "minPrice"
    ) ?? "";

  const maxPrice =
    searchParams.get(
      "maxPrice"
    ) ?? "";

  const updateParams = (
    updates: Record<
      string,
      string
    >
  ) => {
    const next =
      new URLSearchParams(
        searchParams
      );

    Object.entries(
      updates
    ).forEach(
      ([key, value]) => {
        if (value) {
          next.set(
            key,
            value
          );
        } else {
          next.delete(key);
        }
      }
    );

    setSearchParams(next);
  };

  /*
   * Categories only need to
   * load once.
   */
  useEffect(() => {
    const loadCategories =
      async () => {
        try {
          const result =
            await getCategories();

          setCategories(
            result.data
          );
        } catch (error) {
          console.error(
            "Category loading error:",
            error
          );
        }
      };

    void loadCategories();
  }, []);

  /*
   * Reload products whenever
   * URL filters change.
   */
  useEffect(() => {
    const loadProducts =
      async () => {
        try {
          setLoading(true);
          setError("");

          const result =
            await getProducts({
              page,
              limit:
                PRODUCTS_PER_PAGE,

              search:
                search ||
                undefined,

              categoryId:
                categoryId ||
                undefined,

              minPrice:
                minPrice
                  ? Number(
                      minPrice
                    )
                  : undefined,

              maxPrice:
                maxPrice
                  ? Number(
                      maxPrice
                    )
                  : undefined,

              sort:
                sort ||
                undefined,
            });

          setProducts(
            result.data
          );

          setTotalPages(
            result.pagination
              .totalPages
          );

          setTotalProducts(
            result.pagination
              .total
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
  }, [
    page,
    search,
    categoryId,
    minPrice,
    maxPrice,
    sort,
  ]);

  const handleCategoryChange = (
    value: string
  ) => {
    updateParams({
      categoryId: value,
      page: "1",
    });

    setMobileFiltersOpen(
      false
    );
  };

  const applyPrice = () => {
    updateParams({
      minPrice:
        minPriceInput,
      maxPrice:
        maxPriceInput,
      page: "1",
    });

    setMobileFiltersOpen(
      false
    );
  };

  const clearFilters = () => {
    setMinPriceInput("");
    setMaxPriceInput("");

    const next =
      new URLSearchParams();

    if (search) {
      next.set(
        "search",
        search
      );
    }

    setSearchParams(next);

    setMobileFiltersOpen(
      false
    );
  };

  return (
    <>
      <Header />

      <main className="bg-white">
        <Container className="py-10 lg:py-14">
          {/* Page header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40">
              Marketplace
            </p>

            <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.04em] sm:text-5xl">
              Shop
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
            {/* Desktop filters */}
            <div className="hidden lg:block">
              <ProductFilters
                categories={
                  categories
                }
                selectedCategory={
                  categoryId
                }
                minPrice={
                  minPriceInput
                }
                maxPrice={
                  maxPriceInput
                }
                onCategoryChange={
                  handleCategoryChange
                }
                onMinPriceChange={
                  setMinPriceInput
                }
                onMaxPriceChange={
                  setMaxPriceInput
                }
                onApplyPrice={
                  applyPrice
                }
                onClear={
                  clearFilters
                }
              />
            </div>

            {/* Products */}
            <div>
              {/* Toolbar */}
              <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    {search
                      ? `Results for "${search}"`
                      : "All Products"}
                  </h2>

                  <p className="mt-1 text-sm text-black/45">
                    {totalProducts}{" "}
                    {totalProducts ===
                    1
                      ? "product"
                      : "products"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile filters */}
                  <button
                    type="button"
                    onClick={() =>
                      setMobileFiltersOpen(
                        true
                      )
                    }
                    className="flex h-11 items-center gap-2 rounded-full bg-[#f0f0f0] px-4 text-sm font-medium lg:hidden"
                  >
                    <SlidersHorizontal
                      size={17}
                    />
                    Filters
                  </button>

                  <select
                    value={sort}
                    onChange={(
                      event
                    ) =>
                      updateParams({
                        sort:
                          event
                            .target
                            .value,
                        page: "1",
                      })
                    }
                    className="h-11 rounded-full border border-black/10 bg-white px-4 text-sm outline-none"
                  >
                    <option value="">
                      Newest
                    </option>

                    <option value="price_asc">
                      Price: Low to High
                    </option>

                    <option value="price_desc">
                      Price: High to Low
                    </option>
                  </select>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="grid grid-cols-2 gap-5 xl:grid-cols-3">
                  {Array.from({
                    length: 6,
                  }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="animate-pulse"
                      >
                        <div className="aspect-square rounded-[18px] bg-black/5" />

                        <div className="mt-4 h-5 w-3/4 rounded bg-black/10" />

                        <div className="mt-3 h-5 w-1/3 rounded bg-black/10" />
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Error */}
              {!loading &&
                error && (
                  <div className="rounded-2xl border border-black/10 p-10 text-center">
                    <h3 className="font-semibold">
                      Products could
                      not be loaded
                    </h3>

                    <p className="mt-2 text-sm text-black/50">
                      {error}
                    </p>
                  </div>
                )}

              {/* Empty */}
              {!loading &&
                !error &&
                products.length ===
                  0 && (
                  <div className="rounded-[20px] bg-[#f7f7f7] px-6 py-20 text-center">
                    <h3 className="text-xl font-semibold">
                      No products
                      found
                    </h3>

                    <p className="mt-2 text-sm text-black/50">
                      Try changing
                      your search or
                      filters.
                    </p>

                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
                    >
                      Clear filters
                    </button>
                  </div>
                )}

              {/* Grid */}
              {!loading &&
                !error &&
                products.length >
                  0 && (
                  <>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-9 xl:grid-cols-3 xl:gap-x-5">
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

                    {/* Pagination */}
                    <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-6">
                      <button
                        type="button"
                        disabled={
                          page <= 1
                        }
                        onClick={() =>
                          updateParams({
                            page:
                              String(
                                page -
                                  1
                              ),
                          })
                        }
                        className="flex h-10 items-center gap-2 rounded-lg border border-black/10 px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronLeft
                          size={16}
                        />
                        Previous
                      </button>

                      <p className="text-sm text-black/55">
                        Page{" "}
                        <span className="font-semibold text-black">
                          {page}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-black">
                          {Math.max(
                            totalPages,
                            1
                          )}
                        </span>
                      </p>

                      <button
                        type="button"
                        disabled={
                          page >=
                          totalPages
                        }
                        onClick={() =>
                          updateParams({
                            page:
                              String(
                                page +
                                  1
                              ),
                          })
                        }
                        className="flex h-10 items-center gap-2 rounded-lg border border-black/10 px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        Next
                        <ChevronRight
                          size={16}
                        />
                      </button>
                    </div>
                  </>
                )}
            </div>
          </div>
        </Container>
      </main>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filter overlay"
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setMobileFiltersOpen(
                false
              )
            }
          />

          <div className="absolute right-0 top-0 h-full w-[88%] max-w-[360px] overflow-y-auto bg-white">
            <ProductFilters
              mobile
              categories={
                categories
              }
              selectedCategory={
                categoryId
              }
              minPrice={
                minPriceInput
              }
              maxPrice={
                maxPriceInput
              }
              onCategoryChange={
                handleCategoryChange
              }
              onMinPriceChange={
                setMinPriceInput
              }
              onMaxPriceChange={
                setMaxPriceInput
              }
              onApplyPrice={
                applyPrice
              }
              onClear={
                clearFilters
              }
              onClose={() =>
                setMobileFiltersOpen(
                  false
                )
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsPage;