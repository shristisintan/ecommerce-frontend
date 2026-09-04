import {
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
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

const MerchantProductsPage =
  () => {
    const {
      accessToken,
    } = useAuth();

    const [
      products,
      setProducts,
    ] = useState<Product[]>(
      []
    );

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

    /*
     * Product selected for
     * deactivation confirmation.
     */
    const [
      productToDelete,
      setProductToDelete,
    ] =
      useState<Product | null>(
        null
      );

    /* =====================================================
       LOAD CATEGORIES
    ===================================================== */

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
            /*
             * Product page can
             * continue even if
             * category filter fails.
             */
          }
        };

      void loadCategories();
    }, []);

    /* =====================================================
       LOAD MERCHANT PRODUCTS
    ===================================================== */

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

              /*
               * If deleting the only
               * product on the final
               * page makes the current
               * page invalid, move
               * backwards one page.
               */
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

    /* =====================================================
       PRODUCT CREATED
    ===================================================== */

    const handleCreated =
      () => {
        setPage(1);

        setRefreshKey(
          (value) =>
            value + 1
        );
      };

    /* =====================================================
       PRODUCT UPDATED
    ===================================================== */

    const handleEdited =
      () => {
        setRefreshKey(
          (value) =>
            value + 1
        );
      };

    /* =====================================================
       DEACTIVATE PRODUCT
    ===================================================== */

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

          /*
           * Close confirmation modal.
           */
          setProductToDelete(
            null
          );

          /*
           * Reload table.
           */
          setRefreshKey(
            (value) =>
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

    /* =====================================================
       CATEGORY DISPLAY
    ===================================================== */

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
          (category) =>
            category._id ===
            product.categoryId
        )?.name ?? "—"
      );
    };

    return (
      <>
        <div className="space-y-6">
          {/* =========================
              HEADER
          ========================= */}

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Products
              </h1>

              <p className="mt-1 text-sm text-black/45">
                Manage your store
                products and inventory.
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
            >
              <Plus
                size={18}
              />

              Add Product
            </button>
          </div>

          {/* =========================
              FILTERS
          ========================= */}

          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
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
                  className="w-full rounded-xl border border-black/10 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black/30"
                />
              </div>

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
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
              >
                <option value="">
                  All Categories
                </option>

                {categories.map(
                  (category) => (
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
          </div>

          {/* =========================
              PRODUCTS TABLE
          ========================= */}

          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <p className="text-sm font-semibold">
                {total}{" "}
                {total === 1
                  ? "Product"
                  : "Products"}
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="m-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="bg-[#fafafa]">
                  <tr className="text-left text-xs uppercase tracking-wider text-black/40">
                    <th className="px-5 py-4 font-semibold">
                      Product
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Category
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Price
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Stock
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* LOADING */}

                  {loading ? (
                    <tr>
                      <td
                        colSpan={
                          6
                        }
                        className="px-5 py-12 text-center text-sm text-black/40"
                      >
                        Loading
                        products...
                      </td>
                    </tr>
                  ) : products.length ===
                    0 ? (
                    /* EMPTY */

                    <tr>
                      <td
                        colSpan={
                          6
                        }
                        className="px-5 py-12 text-center text-sm text-black/40"
                      >
                        No products
                        found.
                      </td>
                    </tr>
                  ) : (
                    /* PRODUCTS */

                    products.map(
                      (
                        product
                      ) => (
                        <tr
                          key={
                            product._id
                          }
                          className="border-t border-black/5 transition hover:bg-black/[0.015]"
                        >
                          {/* PRODUCT */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f4f4f4]">
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
                                  <span className="text-xs font-bold text-black/30">
                                    NOVA
                                  </span>
                                )}
                              </div>

                              <div>
                                <p className="font-semibold">
                                  {
                                    product.name
                                  }
                                </p>

                                <p className="mt-1 text-xs text-black/40">
                                  {
                                    product.slug
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* CATEGORY */}

                          <td className="px-5 py-4 text-sm text-black/60">
                            {categoryName(
                              product
                            )}
                          </td>

                          {/* PRICE */}

                          <td className="px-5 py-4 text-sm font-semibold">
                            NPR{" "}
                            {product.price.toLocaleString()}
                          </td>

                          {/* STOCK */}

                          <td
                            className={`px-5 py-4 text-sm font-semibold ${
                              product.stock <=
                              5
                                ? "text-red-600"
                                : "text-black"
                            }`}
                          >
                            {
                              product.stock
                            }
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                product.isActive
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {product.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              {/* EDIT */}

                              <button
                                type="button"
                                title="Edit product"
                                onClick={() => {
                                  setEditingProduct(
                                    product
                                  );

                                  setModalOpen(
                                    true
                                  );
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-black/60 transition hover:bg-black hover:text-white"
                              >
                                <Pencil
                                  size={
                                    15
                                  }
                                />
                              </button>

                              {/* DEACTIVATE */}

                              <button
                                type="button"
                                title={
                                  product.isActive
                                    ? "Deactivate product"
                                    : "Product is inactive"
                                }
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
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
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
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-black/10 px-5 py-4">
                <p className="text-sm text-black/45">
                  Page {page} of{" "}
                  {totalPages}
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
                        (current) =>
                          current - 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
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
                        (current) =>
                          current + 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight
                      size={17}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            CUSTOM DEACTIVATE CONFIRMATION MODAL
        ================================================= */}

        {productToDelete && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="deactivate-product-title"
          >
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              {/* ICON */}

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2
                  size={21}
                />
              </div>

              {/* CONTENT */}

              <div className="mt-5">
                <h2
                  id="deactivate-product-title"
                  className="text-xl font-black tracking-tight"
                >
                  Deactivate
                  product?
                </h2>

                <p className="mt-2 text-sm leading-6 text-black/55">
                  Are you sure you
                  want to deactivate{" "}
                  <span className="font-semibold text-black">
                    "
                    {
                      productToDelete.name
                    }
                    "
                  </span>
                  ? It will no
                  longer be visible
                  to buyers.
                </p>

                <div className="mt-4 rounded-xl bg-[#f7f7f7] px-4 py-3">
                  <p className="text-xs leading-5 text-black/45">
                    This does not
                    permanently delete
                    the product. Its
                    existing data will
                    remain stored.
                  </p>
                </div>
              </div>

              {/* ACTIONS */}

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
                  className="rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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
            ADD / EDIT PRODUCT MODAL
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