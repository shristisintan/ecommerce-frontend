import {
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";

import {
  useSearchParams,
} from "react-router-dom";

import Header from "../../components/layout/Header";

import Footer from "../../components/layout/Footer";

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

  const [
    products,
    setProducts,
  ] =
    useState<Product[]>([]);

  const [
    categories,
    setCategories,
  ] =
    useState<Category[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    totalProducts,
    setTotalProducts,
  ] = useState(0);

  const [
    mobileFiltersOpen,
    setMobileFiltersOpen,
  ] = useState(false);

  const [
    minPriceInput,
    setMinPriceInput,
  ] = useState(
    searchParams.get(
      "minPrice"
    ) ?? ""
  );

  const [
    maxPriceInput,
    setMaxPriceInput,
  ] = useState(
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

  /* ======================================================
     LOAD CATEGORIES
  ====================================================== */

  useEffect(() => {
    const loadCategories =
      async () => {
        try {
          const result =
            await getCategories();

          setCategories(
            result.data
          );
        } catch (
          categoryError
        ) {
          console.error(
            "Category loading error:",
            categoryError
          );
        }
      };

    void loadCategories();
  }, []);

  /* ======================================================
     LOAD PRODUCTS
  ====================================================== */

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
        } catch (
          productError
        ) {
          setError(
            productError instanceof
              Error
              ? productError.message
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

  const selectedCategory =
    categories.find(
      (category) =>
        category._id ===
        categoryId
    );

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        {/* Page intro */}

        <section className="border-b border-border bg-primary-50/60">
          <Container className="py-10 sm:py-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              NOVA Marketplace
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-primary-900 sm:text-4xl">
              Shop Products
            </h1>

            <p className="mt-3 max-w-[560px] text-sm leading-6 text-primary-500">
              Browse products from
              stores across the
              marketplace.
            </p>
          </Container>
        </section>

        <Container className="py-8 sm:py-10">
          {/* Active search/category */}

          {(search ||
            selectedCategory) && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-primary-400">
                Showing:
              </span>

              {search && (
                <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
                  Search:{" "}
                  {search}
                </span>
              )}

              {selectedCategory && (
                <span className="rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700">
                  {
                    selectedCategory.name
                  }
                </span>
              )}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[245px_1fr] xl:grid-cols-[260px_1fr]">
            {/* Desktop filters */}

            <div className="hidden lg:block">
              <div className="sticky top-[110px]">
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
            </div>

            {/* Product content */}

            <div>
              {/* Toolbar */}

              <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                  <h2 className="text-lg font-bold text-primary-900 sm:text-xl">
                    {search
                      ? `Results for "${search}"`
                      : selectedCategory
                        ? selectedCategory.name
                        : "All Products"}
                  </h2>

                  <p className="mt-1 text-xs text-primary-400 sm:text-sm">
                    {totalProducts}{" "}
                    {totalProducts ===
                    1
                      ? "product"
                      : "products"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mobile filters */}

                  <button
                    type="button"
                    onClick={() =>
                      setMobileFiltersOpen(
                        true
                      )
                    }
                    className="flex h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 lg:hidden"
                  >
                    <SlidersHorizontal
                      size={16}
                    />

                    Filters
                  </button>

                  {/* Sort */}

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
                    className="h-10 rounded-full border border-border bg-white px-4 text-sm font-medium text-primary-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
                  >
                    <option value="">
                      Newest
                    </option>

                    <option value="price_asc">
                      Price: Low to
                      High
                    </option>

                    <option value="price_desc">
                      Price: High to
                      Low
                    </option>
                  </select>
                </div>
              </div>

              {/* Loading */}

              {loading && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:gap-x-5">
                  {Array.from({
                    length: 6,
                  }).map(
                    (
                      _,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                      >
                        <div className="aspect-square animate-pulse rounded-xl bg-primary-100" />

                        <div className="mt-3 h-3 w-20 animate-pulse rounded bg-primary-100" />

                        <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-primary-100" />

                        <div className="mt-2 h-5 w-1/3 animate-pulse rounded bg-primary-100" />
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Error */}

              {!loading &&
                error && (
                  <div className="rounded-xl border border-danger/15 bg-danger-soft px-6 py-12 text-center">
                    <h3 className="font-semibold text-danger">
                      Products could
                      not be loaded
                    </h3>

                    <p className="mt-2 text-sm text-text-secondary">
                      {error}
                    </p>
                  </div>
                )}

              {/* Empty */}

              {!loading &&
                !error &&
                products.length ===
                  0 && (
                  <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl bg-primary-50 px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary-400 shadow-sm">
                      <SearchX
                        size={24}
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-primary-900">
                      No products
                      found
                    </h3>

                    <p className="mt-2 max-w-[340px] text-sm leading-6 text-primary-500">
                      Try another
                      search,
                      category or
                      price range.
                    </p>

                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="mt-6 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

              {/* Products */}

              {!loading &&
                !error &&
                products.length >
                  0 && (
                  <>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:gap-x-5">
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

                    <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
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
                        className="flex h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronLeft
                          size={16}
                        />

                        <span className="hidden sm:inline">
                          Previous
                        </span>
                      </button>

                      <p className="text-xs font-medium text-primary-400 sm:text-sm">
                        Page{" "}
                        <span className="font-bold text-primary-900">
                          {page}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-primary-900">
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
                        className="flex h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <span className="hidden sm:inline">
                          Next
                        </span>

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

      <Footer />

      {/* Mobile filter drawer */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filter overlay"
            className="absolute inset-0 bg-primary-900/50"
            onClick={() =>
              setMobileFiltersOpen(
                false
              )
            }
          />

          <div className="absolute right-0 top-0 h-full w-[88%] max-w-[360px] overflow-y-auto bg-white shadow-2xl">
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