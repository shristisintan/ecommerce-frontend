import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import {
  deleteProduct,
  getMerchantProducts,
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

import {
  useAuth,
} from "../../context/AuthContext";

import MerchantProductFormModal from "../../components/product/MerchantProductFormModal";

const PAGE_LIMIT = 3;

const MerchantProductsPage = () => {
  const {
    accessToken,
  } = useAuth();

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
    search,
    setSearch,
  ] = useState("");

  const [
    categoryId,
    setCategoryId,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    total,
    setTotal,
  ] = useState(0);

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editingProduct,
    setEditingProduct,
  ] =
    useState<Product | null>(
      null
    );

  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  const [
    deletingId,
    setDeletingId,
  ] = useState<
    string | null
  >(null);

  const [
    productToDelete,
    setProductToDelete,
  ] =
    useState<Product | null>(
      null
    );

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
        } catch {
          // Page can still load
          // without category filter.
        }
      };

    void loadCategories();
  }, []);

  /* ======================================================
     LOAD PRODUCTS
  ====================================================== */

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const timer =
      window.setTimeout(
        async () => {
          try {
            setLoading(true);

            setError("");

            const result =
              await getMerchantProducts(
                accessToken,
                {
                  page,

                  limit:
                    PAGE_LIMIT,

                  search:
                    search.trim() ||
                    undefined,

                  categoryId:
                    categoryId ||
                    undefined,
                }
              );

            setProducts(
              result.data
            );

            setTotal(
              result.pagination
                .total
            );

            setTotalPages(
              Math.max(
                result.pagination
                  .totalPages,
                1
              )
            );

            if (
              result.data.length ===
                0 &&
              page > 1 &&
              result.pagination
                .totalPages < page
            ) {
              setPage(
                page - 1
              );
            }
          } catch (
            loadError
          ) {
            setError(
              loadError instanceof
                Error
                ? loadError.message
                : "Unable to load products."
            );
          } finally {
            setLoading(false);
          }
        },
        300
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    accessToken,
    page,
    search,
    categoryId,
    refreshKey,
  ]);

  /* ======================================================
     CREATED
  ====================================================== */

  const handleCreated =
    () => {
      setPage(1);

      setRefreshKey(
        (
          value
        ) =>
          value + 1
      );
    };

  /* ======================================================
     EDITED
  ====================================================== */

  const handleEdited =
    () => {
      setRefreshKey(
        (
          value
        ) =>
          value + 1
      );
    };

  /* ======================================================
     DEACTIVATE
  ====================================================== */

  const handleDelete =
    async () => {
      if (
        !accessToken ||
        !productToDelete
      ) {
        return;
      }

      try {
        setError("");

        setDeletingId(
          productToDelete._id
        );

        await deleteProduct(
          accessToken,
          productToDelete._id
        );

        setProductToDelete(
          null
        );

        setRefreshKey(
          (
            value
          ) =>
            value + 1
        );
      } catch (
        deleteError
      ) {
        setError(
          deleteError instanceof
            Error
            ? deleteError.message
            : "Unable to deactivate product."
        );
      } finally {
        setDeletingId(
          null
        );
      }
    };

  /* ======================================================
     CATEGORY NAME
  ====================================================== */

  const categoryName = (
    product: Product
  ) => {
    if (
      typeof product.categoryId !==
      "string"
    ) {
      return product
        .categoryId.name;
    }

    return (
      categories.find(
        (
          category
        ) =>
          category._id ===
          product.categoryId
      )?.name ?? "—"
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* =================================================
            HEADER
        ================================================= */}

        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Inventory
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-primary-900 sm:text-4xl">
              Products
            </h1>

            <p className="mt-2 text-sm text-primary-500">
              Manage products,
              pricing and stock
              for your store.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingProduct(
                null
              );

              setModalOpen(
                true
              );
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Plus
              size={17}
            />

            Add Product
          </button>
        </section>

        {/* =================================================
            FILTERS
        ================================================= */}

        <section className="rounded-2xl border border-border bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            {/* Search */}

            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300"
              />

              <input
                value={
                  search
                }
                onChange={(
                  event
                ) => {
                  setSearch(
                    event.target
                      .value
                  );

                  setPage(1);
                }}
                placeholder="Search products..."
                className="h-11 w-full rounded-xl border border-border bg-primary-50/60 pl-11 pr-4 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-50"
              />
            </div>

            {/* Category */}

            <select
              value={
                categoryId
              }
              onChange={(
                event
              ) => {
                setCategoryId(
                  event.target
                    .value
                );

                setPage(1);
              }}
              className="h-11 min-w-[210px] rounded-xl border border-border bg-white px-4 text-sm font-medium text-primary-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
            >
              <option value="">
                All Categories
              </option>

              {categories.map(
                (
                  category
                ) => (
                  <option
                    key={
                      category._id
                    }
                    value={
                      category._id
                    }
                  >
                    {
                      category.name
                    }
                  </option>
                )
              )}
            </select>
          </div>
        </section>

        {/* =================================================
            PRODUCT TABLE
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-border bg-white">
          {/* Table header */}

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Package
                  size={17}
                />
              </div>

              <div>
                <p className="text-sm font-bold text-primary-900">
                  Product Inventory
                </p>

                <p className="text-xs text-primary-400">
                  {total}{" "}
                  {total === 1
                    ? "product"
                    : "products"}
                </p>
              </div>
            </div>

            {(search ||
              categoryId) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");

                  setCategoryId("");

                  setPage(1);
                }}
                className="text-xs font-semibold text-brand-700 transition hover:text-brand-800"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Error */}

          {error && (
            <div className="m-5 rounded-xl border border-danger/15 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
              {error}
            </div>
          )}

          {/* Table */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px]">
              <thead className="bg-primary-50/70">
                <tr className="text-left text-[10px] font-bold uppercase tracking-[0.12em] text-primary-400">
                  <th className="px-5 py-4">
                    Product
                  </th>

                  <th className="px-5 py-4">
                    Category
                  </th>

                  <th className="px-5 py-4">
                    Price
                  </th>

                  <th className="px-5 py-4">
                    Stock
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {/* Loading */}

                {loading ? (
                  <tr>
                    <td
                      colSpan={
                        6
                      }
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto flex w-fit items-center gap-3 text-sm text-primary-400">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />

                        Loading
                        products...
                      </div>
                    </td>
                  </tr>
                ) : products.length ===
                  0 ? (
                  /* Empty */

                  <tr>
                    <td
                      colSpan={
                        6
                      }
                      className="px-5 py-16"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-300">
                          <Package
                            size={22}
                          />
                        </div>

                        <p className="mt-4 text-sm font-bold text-primary-900">
                          No products
                          found
                        </p>

                        <p className="mt-1 text-xs leading-5 text-primary-400">
                          Try changing
                          your search
                          or category
                          filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map(
                    (
                      product
                    ) => {
                      const lowStock =
                        product.stock <=
                        5;

                      return (
                        <tr
                          key={
                            product._id
                          }
                          className="transition hover:bg-primary-50/45"
                        >
                          {/* Product */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-50">
                                {product
                                  .images?.[0] ? (
                                  <img
                                    src={
                                      product
                                        .images[0]
                                    }
                                    alt={
                                      product.name
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Package
                                    size={18}
                                    className="text-primary-300"
                                  />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[230px] truncate text-sm font-bold text-primary-900">
                                  {
                                    product.name
                                  }
                                </p>

                                <p className="mt-1 max-w-[230px] truncate text-xs text-primary-400">
                                  {
                                    product.slug
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}

                          <td className="px-5 py-4">
                            <span className="text-sm font-medium text-primary-600">
                              {categoryName(
                                product
                              )}
                            </span>
                          </td>

                          {/* Price */}

                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-primary-900">
                              NPR{" "}
                              {product.price.toLocaleString(
                                "en-NP"
                              )}
                            </span>
                          </td>

                          {/* Stock */}

                          <td className="px-5 py-4">
                            {lowStock ? (
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <AlertTriangle
                                    size={14}
                                    className="text-warning"
                                  />

                                  <span className="text-sm font-bold text-warning">
                                    {
                                      product.stock
                                    }
                                  </span>
                                </div>

                                <p className="mt-1 text-[10px] font-semibold text-warning">
                                  Low stock
                                </p>
                              </div>
                            ) : (
                              <span className="text-sm font-bold text-primary-800">
                                {
                                  product.stock
                                }
                              </span>
                            )}
                          </td>

                          {/* Status */}

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] ${
                                product.isActive
                                  ? "bg-success-soft text-success"
                                  : "bg-primary-100 text-primary-500"
                              }`}
                            >
                              {product.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          {/* Actions */}

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              {/* Edit */}

                              <button
                                type="button"
                                title="Edit product"
                                aria-label="Edit product"
                                onClick={() => {
                                  setEditingProduct(
                                    product
                                  );

                                  setModalOpen(
                                    true
                                  );
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-primary-500 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                              >
                                <Pencil
                                  size={
                                    15
                                  }
                                />
                              </button>

                              {/* Deactivate */}

                              <button
                                type="button"
                                title={
                                  product.isActive
                                    ? "Deactivate product"
                                    : "Product is inactive"
                                }
                                aria-label="Deactivate product"
                                disabled={
                                  deletingId ===
                                    product._id ||
                                  !product.isActive
                                }
                                onClick={() =>
                                  setProductToDelete(
                                    product
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-danger/15 bg-white text-danger transition hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <Trash2
                                  size={
                                    15
                                  }
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {totalPages >
            1 && (
            <div className="flex items-center justify-between border-t border-border px-5 py-4">
              <p className="text-xs font-medium text-primary-400 sm:text-sm">
                Page{" "}
                <span className="font-bold text-primary-900">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-bold text-primary-900">
                  {
                    totalPages
                  }
                </span>
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={
                    page <= 1
                  }
                  onClick={() =>
                    setPage(
                      (
                        current
                      ) =>
                        current -
                        1
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-primary-600 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft
                    size={17}
                  />
                </button>

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={
                    page >=
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      (
                        current
                      ) =>
                        current +
                        1
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-primary-600 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight
                    size={17}
                  />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* =================================================
          DEACTIVATE MODAL
      ================================================= */}

      {productToDelete && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-primary-900/40 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deactivate-product-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger-soft text-danger">
              <Trash2
                size={19}
              />
            </div>

            <div className="mt-5">
              <h2
                id="deactivate-product-title"
                className="text-xl font-black tracking-tight text-primary-900"
              >
                Deactivate
                Product?
              </h2>

              <p className="mt-2 text-sm leading-6 text-primary-500">
                Are you sure you
                want to deactivate{" "}
                <span className="font-bold text-primary-900">
                  "
                  {
                    productToDelete.name
                  }
                  "
                </span>
                ? Buyers will no
                longer see this
                product.
              </p>

              <div className="mt-4 rounded-xl bg-primary-50 px-4 py-3">
                <p className="text-xs leading-5 text-primary-500">
                  The product is
                  not permanently
                  deleted. You can
                  reactivate it
                  later by editing
                  its status.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={
                  deletingId !==
                  null
                }
                onClick={() =>
                  setProductToDelete(
                    null
                  )
                }
                className="h-10 rounded-xl border border-border px-5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  deletingId !==
                  null
                }
                onClick={() =>
                  void handleDelete()
                }
                className="inline-flex h-10 min-w-[120px] items-center justify-center rounded-xl bg-danger px-5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
              >
                {deletingId
                  ? "Deactivating..."
                  : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      <MerchantProductFormModal
        open={
          modalOpen
        }
        product={
          editingProduct
        }
        onClose={() => {
          setModalOpen(
            false
          );

          setEditingProduct(
            null
          );
        }}
        onSuccess={
          editingProduct
            ? handleEdited
            : handleCreated
        }
      />
    </>
  );
};

export default MerchantProductsPage;