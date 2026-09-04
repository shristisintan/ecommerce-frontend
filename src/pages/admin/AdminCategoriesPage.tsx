import {
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
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

const AdminCategoriesPage =
  () => {
    const [
      categories,
      setCategories,
    ] =
      useState<Category[]>([]);

    const [
      loading,
      setLoading,
    ] =
      useState(true);

    const [
      error,
      setError,
    ] = useState("");

    const [
      search,
      setSearch,
    ] = useState("");

    const [
      modalOpen,
      setModalOpen,
    ] = useState(false);

    const [
      editingCategory,
      setEditingCategory,
    ] =
      useState<
        Category | null
      >(null);

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
      useState<
        Category | null
      >(null);

    const [
      processingId,
      setProcessingId,
    ] =
      useState<
        string | null
      >(null);

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
          (category) =>
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

    const openEditModal =
      (
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

    const closeModal =
      () => {
        if (saving) {
          return;
        }

        setModalOpen(false);
        setEditingCategory(
          null
        );
        setName("");
        setSlug("");
      };

    const handleNameChange =
      (
        value: string
      ) => {
        setName(value);

        /*
         * Keep slug convenient.
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

    const handleSubmit =
      async (
        event:
          React.FormEvent<HTMLFormElement>
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
          }

          closeModal();

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
              isActive:
                true,
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

    return (
      <div className="space-y-6">
        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-black/40">
              Admin Portal
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Categories
            </h1>

            <p className="mt-2 text-sm text-black/50">
              Manage product
              categories used
              across the
              marketplace.
            </p>
          </div>

          <button
            type="button"
            onClick={
              openAddModal
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            <Plus
              size={17}
            />

            Add Category
          </button>
        </div>

        {/* Error */}

        {error &&
          !modalOpen && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

        {/* Search */}

        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="relative max-w-md">
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
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
              placeholder="Search categories..."
              className="h-11 w-full rounded-xl border border-black/10 bg-[#fafafa] pl-11 pr-4 text-sm outline-none transition focus:border-black/30"
            />
          </div>
        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <p className="text-sm font-semibold">
              {
                filteredCategories.length
              }{" "}
              {filteredCategories.length ===
              1
                ? "Category"
                : "Categories"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-[#fafafa]">
                <tr className="text-left text-xs uppercase tracking-wider text-black/40">
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

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={
                        4
                      }
                      className="px-5 py-12 text-center text-sm text-black/40"
                    >
                      Loading
                      categories...
                    </td>
                  </tr>
                ) : filteredCategories.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={
                        4
                      }
                      className="px-5 py-12 text-center text-sm text-black/40"
                    >
                      No
                      categories
                      found.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map(
                    (
                      category
                    ) => (
                      <tr
                        key={
                          category._id
                        }
                        className="border-t border-black/5"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold">
                            {
                              category.name
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-[#f5f5f5] px-3 py-1.5 text-xs font-medium text-black/60">
                            {
                              category.slug
                            }
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              category.isActive
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {category.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              title="Edit"
                              onClick={() =>
                                openEditModal(
                                  category
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 transition hover:bg-[#f5f5f5]"
                            >
                              <Pencil
                                size={
                                  15
                                }
                              />
                            </button>

                            {category.isActive ? (
                              <button
                                type="button"
                                title="Deactivate"
                                onClick={() =>
                                  setCategoryToDeactivate(
                                    category
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                              >
                                <Trash2
                                  size={
                                    15
                                  }
                                />
                              </button>
                            ) : (
                              <button
                                type="button"
                                title="Reactivate"
                                disabled={
                                  processingId ===
                                  category._id
                                }
                                onClick={() =>
                                  void handleReactivate(
                                    category
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-green-100 text-green-600 transition hover:bg-green-50 disabled:opacity-40"
                              >
                                <RotateCcw
                                  size={
                                    15
                                  }
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
        </div>

        {/* Add/Edit Modal */}

        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-[24px] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingCategory
                      ? "Edit Category"
                      : "Add Category"}
                  </h2>

                  <p className="mt-1 text-xs text-black/40">
                    {editingCategory
                      ? "Update category information."
                      : "Create a new marketplace category."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f5]"
                >
                  <X
                    size={
                      17
                    }
                  />
                </button>
              </div>

              <form
                onSubmit={
                  handleSubmit
                }
                className="p-6"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category
                    Name
                  </label>

                  <input
                    value={
                      name
                    }
                    onChange={(
                      event
                    ) =>
                      handleNameChange(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="e.g. Sports & Outdoors"
                    className="h-11 w-full rounded-xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/40"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium">
                    Slug
                  </label>

                  <input
                    value={
                      slug
                    }
                    onChange={(
                      event
                    ) =>
                      setSlug(
                        slugify(
                          event
                            .target
                            .value
                        )
                      )
                    }
                    placeholder="sports-outdoors"
                    className="h-11 w-full rounded-xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/40"
                  />

                  <p className="mt-2 text-xs text-black/40">
                    Used in
                    URLs and
                    filtering.
                  </p>
                </div>

                {error && (
                  <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {
                      error
                    }
                  </div>
                )}

                <div className="mt-7 flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={
                      saving
                    }
                    onClick={
                      closeModal
                    }
                    className="h-11 rounded-xl border border-black/10 px-5 text-sm font-semibold transition hover:bg-[#f5f5f5]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving
                    }
                    className="h-11 rounded-xl bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50"
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

        {/* Deactivate confirmation */}

        {categoryToDeactivate && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-[24px] bg-white p-7 shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2
                  size={
                    20
                  }
                />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                Deactivate
                category?
              </h2>

              <p className="mt-2 text-sm leading-6 text-black/50">
                <span className="font-semibold text-black">
                  {
                    categoryToDeactivate.name
                  }
                </span>{" "}
                will no
                longer be
                available
                as an active
                category.
              </p>

              <div className="mt-7 flex justify-end gap-3">
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
                  className="h-11 rounded-xl border border-black/10 px-5 text-sm font-semibold"
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
                  className="h-11 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {processingId
                    ? "Deactivating..."
                    : "Deactivate"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

export default AdminCategoriesPage;