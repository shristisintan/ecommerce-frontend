import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleOff,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Shapes,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  createCategory,
  deactivateCategory,
  getAdminCategories,
  updateCategory,
} from "../../api/categoryApi";

import type {
  Category,
} from "../../types/category";

/* =========================================================
   CONSTANTS
========================================================= */

const PAGE_SIZE = 5;

/* =========================================================
   HELPERS
========================================================= */

const slugify = (
  value: string
) =>
  value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );

/* =========================================================
   PAGE
========================================================= */

const AdminCategoriesPage = () => {
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
    page,
    setPage,
  ] = useState(1);

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editingCategory,
    setEditingCategory,
  ] =
    useState<Category | null>(
      null
    );

  const [
    name,
    setName,
  ] = useState("");

  const [
    slug,
    setSlug,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    categoryToDeactivate,
    setCategoryToDeactivate,
  ] =
    useState<Category | null>(
      null
    );

  const [
    processingId,
    setProcessingId,
  ] =
    useState<string | null>(
      null
    );

  /* ======================================================
     LOAD CATEGORIES
  ====================================================== */

  const loadCategories =
    async () => {
      try {
        setLoading(true);

        setError("");

        const result =
          await getAdminCategories();

        setCategories(
          result.data
        );
      } catch (
        loadError
      ) {
        setError(
          loadError instanceof
            Error
            ? loadError.message
            : "Unable to load categories."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    void loadCategories();
  }, []);

  /* ======================================================
     FILTERED CATEGORIES
  ====================================================== */

  const filteredCategories =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return categories;
      }

      return categories.filter(
        (
          category
        ) =>
          category.name
            .toLowerCase()
            .includes(
              query
            ) ||
          category.slug
            .toLowerCase()
            .includes(
              query
            )
      );
    }, [
      categories,
      search,
    ]);

  /* ======================================================
     PAGINATION
  ====================================================== */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredCategories.length /
          PAGE_SIZE
      )
    );

  const safePage =
    Math.min(
      page,
      totalPages
    );

  const startIndex =
    (safePage - 1) *
    PAGE_SIZE;

  const endIndex =
    Math.min(
      startIndex +
        PAGE_SIZE,
      filteredCategories.length
    );

  const paginatedCategories =
    useMemo(
      () =>
        filteredCategories.slice(
          startIndex,
          startIndex +
            PAGE_SIZE
        ),
      [
        filteredCategories,
        startIndex,
      ]
    );

  /*
   * If data changes while the
   * administrator is on the last
   * page, ensure the selected page
   * still exists.
   */
  useEffect(() => {
    if (
      page >
      totalPages
    ) {
      setPage(
        totalPages
      );
    }
  }, [
    page,
    totalPages,
  ]);

  /* ======================================================
     CATEGORY COUNTS
  ====================================================== */

  const activeCount =
    categories.filter(
      (
        category
      ) =>
        category.isActive
    ).length;

  const inactiveCount =
    categories.length -
    activeCount;

  /* ======================================================
     SEARCH
  ====================================================== */

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);

    /*
     * Always return to first
     * page for a new search.
     */
    setPage(1);
  };

  const clearSearch = () => {
    setSearch("");

    setPage(1);
  };

  /* ======================================================
     MODAL HELPERS
  ====================================================== */

  const resetModal = () => {
    setModalOpen(false);

    setEditingCategory(
      null
    );

    setName("");

    setSlug("");
  };

  const openAddModal =
    () => {
      setEditingCategory(
        null
      );

      setName("");

      setSlug("");

      setError("");

      setModalOpen(true);
    };

  const openEditModal = (
    category: Category
  ) => {
    setEditingCategory(
      category
    );

    setName(
      category.name
    );

    setSlug(
      category.slug
    );

    setError("");

    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    resetModal();

    setError("");
  };

  /* ======================================================
     NAME / SLUG
  ====================================================== */

  const handleNameChange = (
    value: string
  ) => {
    setName(value);

    /*
     * During creation the slug
     * follows the category name.
     *
     * During editing it keeps
     * following the old name only
     * if the administrator has not
     * manually customized it.
     */
    if (
      !editingCategory ||
      slug ===
        slugify(
          editingCategory.name
        )
    ) {
      setSlug(
        slugify(value)
      );
    }
  };

  /* ======================================================
     ADD / EDIT CATEGORY
  ====================================================== */

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      const cleanedName =
        name.trim();

      const cleanedSlug =
        slug
          .trim()
          .toLowerCase();

      if (
        cleanedName.length <
        2
      ) {
        setError(
          "Category name must contain at least 2 characters."
        );

        return;
      }

      if (
        cleanedSlug.length <
        2
      ) {
        setError(
          "Category slug must contain at least 2 characters."
        );

        return;
      }

      if (
        !/^[a-z0-9-]+$/.test(
          cleanedSlug
        )
      ) {
        setError(
          "Slug may contain lowercase letters, numbers and hyphens only."
        );

        return;
      }

      try {
        setSaving(true);

        setError("");

        if (
          editingCategory
        ) {
          await updateCategory(
            editingCategory._id,
            {
              name:
                cleanedName,

              slug:
                cleanedSlug,
            }
          );
        } else {
          await createCategory(
            {
              name:
                cleanedName,

              slug:
                cleanedSlug,
            }
          );

          /*
           * Newly created records
           * appear near the beginning,
           * so return to first page.
           */
          setPage(1);
        }

        resetModal();

        await loadCategories();
      } catch (
        saveError
      ) {
        setError(
          saveError instanceof
            Error
            ? saveError.message
            : "Unable to save category."
        );
      } finally {
        setSaving(false);
      }
    };

  /* ======================================================
     DEACTIVATE
  ====================================================== */

  const handleDeactivate =
    async () => {
      if (
        !categoryToDeactivate
      ) {
        return;
      }

      try {
        setProcessingId(
          categoryToDeactivate._id
        );

        setError("");

        await deactivateCategory(
          categoryToDeactivate._id
        );

        setCategoryToDeactivate(
          null
        );

        await loadCategories();
      } catch (
        deactivateError
      ) {
        setError(
          deactivateError instanceof
            Error
            ? deactivateError.message
            : "Unable to deactivate category."
        );
      } finally {
        setProcessingId(
          null
        );
      }
    };

  /* ======================================================
     REACTIVATE
  ====================================================== */

  const handleReactivate =
    async (
      category: Category
    ) => {
      try {
        setProcessingId(
          category._id
        );

        setError("");

        await updateCategory(
          category._id,
          {
            isActive: true,
          }
        );

        await loadCategories();
      } catch (
        activateError
      ) {
        setError(
          activateError instanceof
            Error
            ? activateError.message
            : "Unable to activate category."
        );
      } finally {
        setProcessingId(
          null
        );
      }
    };

  /* ======================================================
     PAGE
  ====================================================== */

  return (
    <>
      <div className="space-y-6">
        {/* =================================================
            HEADER
        ================================================= */}

        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Marketplace
              Configuration
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-primary-900 sm:text-4xl">
              Categories
            </h1>

            <p className="mt-2 max-w-[560px] text-sm leading-6 text-primary-500">
              Manage product
              categories available
              across the NOVA
              marketplace.
            </p>
          </div>

          <button
            type="button"
            onClick={
              openAddModal
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Plus
              size={17}
            />

            Add Category
          </button>
        </section>

        {/* =================================================
            OVERVIEW
        ================================================= */}

        <section className="grid gap-3 sm:grid-cols-3">
          {/* Total */}

          <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Shapes
                size={18}
              />
            </div>

            <div>
              <p className="text-xs font-medium text-primary-400">
                Total
              </p>

              <p className="mt-0.5 text-xl font-black text-primary-900">
                {loading
                  ? "—"
                  : categories.length}
              </p>
            </div>
          </div>

          {/* Active */}

          <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-soft text-success">
              <CheckCircle2
                size={18}
              />
            </div>

            <div>
              <p className="text-xs font-medium text-primary-400">
                Active
              </p>

              <p className="mt-0.5 text-xl font-black text-primary-900">
                {loading
                  ? "—"
                  : activeCount}
              </p>
            </div>
          </div>

          {/* Inactive */}

          <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-500">
              <CircleOff
                size={18}
              />
            </div>

            <div>
              <p className="text-xs font-medium text-primary-400">
                Inactive
              </p>

              <p className="mt-0.5 text-xl font-black text-primary-900">
                {loading
                  ? "—"
                  : inactiveCount}
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            PAGE ERROR
        ================================================= */}

        {error &&
          !modalOpen && (
            <div className="rounded-xl border border-danger/15 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
              {error}
            </div>
          )}

        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="rounded-2xl border border-border bg-white p-4">
          <div className="relative max-w-lg">
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
              ) =>
                handleSearchChange(
                  event.target
                    .value
                )
              }
              placeholder="Search by category name or slug..."
              className="h-11 w-full rounded-xl border border-border bg-primary-50/60 pl-11 pr-4 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-50"
            />
          </div>
        </section>

        {/* =================================================
            TABLE
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-border bg-white">
          {/* Table Header */}

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Shapes
                  size={17}
                />
              </div>

              <div>
                <p className="text-sm font-bold text-primary-900">
                  Category
                  Management
                </p>

                <p className="text-xs text-primary-400">
                  {
                    filteredCategories.length
                  }{" "}
                  {filteredCategories.length ===
                  1
                    ? "category"
                    : "categories"}
                </p>
              </div>
            </div>

            {search && (
              <button
                type="button"
                onClick={
                  clearSearch
                }
                className="text-xs font-semibold text-brand-700 transition hover:text-brand-800"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* =================================================
              TABLE CONTENT
          ================================================= */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-primary-50/70">
                <tr className="text-left text-[10px] font-bold uppercase tracking-[0.12em] text-primary-400">
                  <th className="px-5 py-4">
                    Category
                  </th>

                  <th className="px-5 py-4">
                    Slug
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
                      colSpan={4}
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto flex w-fit items-center gap-3 text-sm text-primary-400">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />

                        Loading
                        categories...
                      </div>
                    </td>
                  </tr>
                ) : filteredCategories.length ===
                  0 ? (
                  /* Empty */

                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-16"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-300">
                          <Shapes
                            size={22}
                          />
                        </div>

                        <p className="mt-4 text-sm font-bold text-primary-900">
                          No categories
                          found
                        </p>

                        <p className="mt-1 text-xs leading-5 text-primary-400">
                          Try another
                          search or
                          create a new
                          category.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map(
                    (
                      category
                    ) => (
                      <tr
                        key={
                          category._id
                        }
                        className="transition hover:bg-primary-50/45"
                      >
                        {/* Name */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                              <Shapes
                                size={
                                  15
                                }
                              />
                            </div>

                            <p className="text-sm font-bold text-primary-900">
                              {
                                category.name
                              }
                            </p>
                          </div>
                        </td>

                        {/* Slug */}

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-lg bg-primary-50 px-3 py-1.5 font-mono text-xs font-medium text-primary-500">
                            {
                              category.slug
                            }
                          </span>
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] ${
                              category.isActive
                                ? "bg-success-soft text-success"
                                : "bg-primary-100 text-primary-500"
                            }`}
                          >
                            {category.isActive
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
                              title="Edit category"
                              aria-label="Edit category"
                              onClick={() =>
                                openEditModal(
                                  category
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-primary-500 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                            >
                              <Pencil
                                size={15}
                              />
                            </button>

                            {/* Active */}

                            {category.isActive ? (
                              <button
                                type="button"
                                title="Deactivate category"
                                aria-label="Deactivate category"
                                disabled={
                                  processingId ===
                                  category._id
                                }
                                onClick={() =>
                                  setCategoryToDeactivate(
                                    category
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-danger/15 bg-white text-danger transition hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Trash2
                                  size={15}
                                />
                              </button>
                            ) : (
                              <button
                                type="button"
                                title="Reactivate category"
                                aria-label="Reactivate category"
                                disabled={
                                  processingId ===
                                  category._id
                                }
                                onClick={() =>
                                  void handleReactivate(
                                    category
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-success/15 bg-white text-success transition hover:bg-success-soft disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <RotateCcw
                                  size={15}
                                />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {!loading &&
            filteredCategories.length >
              0 && (
              <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Result Count */}

                <p className="text-xs text-primary-400">
                  Showing{" "}
                  <span className="font-semibold text-primary-700">
                    {startIndex +
                      1}
                  </span>
                  {" – "}
                  <span className="font-semibold text-primary-700">
                    {endIndex}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-primary-700">
                    {
                      filteredCategories.length
                    }
                  </span>{" "}
                  categories
                </p>

                {/* Controls */}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={
                      safePage <=
                      1
                    }
                    onClick={() =>
                      setPage(
                        (
                          current
                        ) =>
                          Math.max(
                            current -
                              1,
                            1
                          )
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-primary-500 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft
                      size={16}
                    />
                  </button>

                  <span className="min-w-[90px] text-center text-xs font-semibold text-primary-600">
                    Page{" "}
                    {safePage} of{" "}
                    {
                      totalPages
                    }
                  </span>

                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={
                      safePage >=
                      totalPages
                    }
                    onClick={() =>
                      setPage(
                        (
                          current
                        ) =>
                          Math.min(
                            current +
                              1,
                            totalPages
                          )
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-primary-500 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight
                      size={16}
                    />
                  </button>
                </div>
              </div>
            )}
        </section>
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-900/40 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Shapes
                    size={18}
                  />
                </div>

                <div>
                  <h2 className="text-xl font-black text-primary-900">
                    {editingCategory
                      ? "Edit Category"
                      : "Add Category"}
                  </h2>

                  <p className="mt-0.5 text-xs text-primary-400">
                    {editingCategory
                      ? "Update marketplace category information."
                      : "Create a new marketplace category."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close modal"
                disabled={
                  saving
                }
                onClick={
                  closeModal
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-primary-400 transition hover:bg-primary-50 hover:text-primary-900 disabled:opacity-40"
              >
                <X
                  size={17}
                />
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={
                handleSubmit
              }
              className="p-6"
            >
              {/* Name */}

              <div>
                <label
                  htmlFor="categoryName"
                  className="mb-2 block text-sm font-semibold text-primary-800"
                >
                  Category Name
                </label>

                <input
                  id="categoryName"
                  value={
                    name
                  }
                  onChange={(
                    event
                  ) =>
                    handleNameChange(
                      event.target
                        .value
                    )
                  }
                  placeholder="e.g. Sports & Outdoors"
                  className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
                />
              </div>

              {/* Slug */}

              <div className="mt-5">
                <label
                  htmlFor="categorySlug"
                  className="mb-2 block text-sm font-semibold text-primary-800"
                >
                  Slug
                </label>

                <input
                  id="categorySlug"
                  value={
                    slug
                  }
                  onChange={(
                    event
                  ) =>
                    setSlug(
                      slugify(
                        event.target
                          .value
                      )
                    )
                  }
                  placeholder="sports-outdoors"
                  className="h-11 w-full rounded-xl border border-border bg-white px-4 font-mono text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
                />

                <p className="mt-2 text-xs leading-5 text-primary-400">
                  Used for URLs,
                  filtering and
                  category
                  identification.
                </p>
              </div>

              {/* Error */}

              {error && (
                <div className="mt-5 rounded-xl border border-danger/15 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
                  {error}
                </div>
              )}

              {/* Actions */}

              <div className="mt-7 flex justify-end gap-3 border-t border-border pt-5">
                <button
                  type="button"
                  disabled={
                    saving
                  }
                  onClick={
                    closeModal
                  }
                  className="h-10 rounded-xl border border-border px-5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="h-10 min-w-[135px] rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                      ? "Save Changes"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          DEACTIVATE CONFIRMATION
      ====================================================== */}

      {categoryToDeactivate && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-primary-900/40 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger-soft text-danger">
              <Trash2
                size={19}
              />
            </div>

            <h2 className="mt-5 text-xl font-black tracking-tight text-primary-900">
              Deactivate
              Category?
            </h2>

            <p className="mt-2 text-sm leading-6 text-primary-500">
              <span className="font-bold text-primary-900">
                {
                  categoryToDeactivate.name
                }
              </span>{" "}
              will no longer be
              available as an
              active marketplace
              category.
            </p>

            <div className="mt-4 rounded-xl bg-primary-50 px-4 py-3">
              <p className="text-xs leading-5 text-primary-500">
                This does not
                permanently delete
                the category. It
                can be reactivated
                later.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={
                  Boolean(
                    processingId
                  )
                }
                onClick={() =>
                  setCategoryToDeactivate(
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
                  Boolean(
                    processingId
                  )
                }
                onClick={() =>
                  void handleDeactivate()
                }
                className="h-10 min-w-[120px] rounded-xl bg-danger px-5 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingId
                  ? "Deactivating..."
                  : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCategoriesPage;