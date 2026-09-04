import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Image,
  Package,
  X,
} from "lucide-react";

import {
  createProduct,
  updateProduct,
} from "../../api/productApi";

import {
  getCategories,
} from "../../api/categoryApi";

import type {
  Category,
} from "../../types/category";

import type {
  Product,
} from "../../types/product";

import {
  useAuth,
} from "../../context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;

  product?: Product | null;
}

interface FieldErrors {
  name?: string;
  slug?: string;
  categoryId?: string;
  price?: string;
  stock?: string;
  imageUrl?: string;
  description?: string;
}

const createSlug = (
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

const MerchantProductFormModal = ({
  open,
  onClose,
  onSuccess,
  product = null,
}: Props) => {
  const {
    accessToken,
  } = useAuth();

  const [
    categories,
    setCategories,
  ] =
    useState<Category[]>([]);

  const [
    name,
    setName,
  ] = useState("");

  const [
    slug,
    setSlug,
  ] = useState("");

  const [
    categoryId,
    setCategoryId,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    price,
    setPrice,
  ] = useState("");

  const [
    stock,
    setStock,
  ] = useState("");

  const [
    imageUrl,
    setImageUrl,
  ] = useState("");

  const [
    isActive,
    setIsActive,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    fieldErrors,
    setFieldErrors,
  ] =
    useState<FieldErrors>(
      {}
    );

  const isEditMode =
    Boolean(product);

  /* ======================================================
     CATEGORIES
  ====================================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadCategories =
      async () => {
        try {
          const result =
            await getCategories();

          setCategories(
            result.data.filter(
              (
                category
              ) =>
                category.isActive
            )
          );
        } catch {
          setError(
            "Unable to load categories."
          );
        }
      };

    void loadCategories();
  }, [open]);

  /* ======================================================
     FORM INITIALIZATION
  ====================================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    setError("");

    setFieldErrors({});

    if (product) {
      setName(
        product.name
      );

      setSlug(
        product.slug
      );

      setCategoryId(
        typeof product.categoryId ===
          "string"
          ? product.categoryId
          : product.categoryId._id
      );

      setDescription(
        product.description
      );

      setPrice(
        String(
          product.price
        )
      );

      setStock(
        String(
          product.stock
        )
      );

      setImageUrl(
        product.images?.[0] ??
          ""
      );

      setIsActive(
        product.isActive
      );
    } else {
      setName("");

      setSlug("");

      setCategoryId("");

      setDescription("");

      setPrice("");

      setStock("");

      setImageUrl("");

      setIsActive(true);
    }
  }, [open, product]);

  if (!open) {
    return null;
  }

  /* ======================================================
     ERROR HELPERS
  ====================================================== */

  const clearFieldError = (
    field:
      keyof FieldErrors
  ) => {
    setFieldErrors(
      (
        current
      ) => ({
        ...current,

        [field]:
          undefined,
      })
    );
  };

  /* ======================================================
     VALIDATION
  ====================================================== */

  const validate = () => {
    const errors:
      FieldErrors = {};

    if (!name.trim()) {
      errors.name =
        "Product name is required.";
    } else if (
      name.trim().length <
      2
    ) {
      errors.name =
        "Product name must be at least 2 characters.";
    }

    if (!slug.trim()) {
      errors.slug =
        "Slug is required.";
    } else if (
      !/^[a-z0-9-]+$/.test(
        slug
      )
    ) {
      errors.slug =
        "Use lowercase letters, numbers and hyphens only.";
    }

    if (!categoryId) {
      errors.categoryId =
        "Category is required.";
    }

    if (price === "") {
      errors.price =
        "Price is required.";
    } else if (
      Number(price) < 0 ||
      Number.isNaN(
        Number(price)
      )
    ) {
      errors.price =
        "Enter a valid price.";
    }

    if (stock === "") {
      errors.stock =
        "Stock is required.";
    } else if (
      Number(stock) < 0 ||
      !Number.isInteger(
        Number(stock)
      )
    ) {
      errors.stock =
        "Stock must be a whole number.";
    }

    if (
      description.trim()
        .length < 5
    ) {
      errors.description =
        "Description must be at least 5 characters.";
    }

    if (
      imageUrl.trim()
    ) {
      try {
        new URL(
          imageUrl.trim()
        );
      } catch {
        errors.imageUrl =
          "Enter a valid image URL.";
      }
    }

    setFieldErrors(
      errors
    );

    return (
      Object.keys(errors)
        .length === 0
    );
  };

  /* ======================================================
     NAME / SLUG
  ====================================================== */

  const handleNameChange = (
    value: string
  ) => {
    setName(value);

    setSlug(
      createSlug(value)
    );

    clearFieldError(
      "name"
    );

    clearFieldError(
      "slug"
    );
  };

  /* ======================================================
     SUBMIT
  ====================================================== */

  const handleSubmit =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      setError("");

      if (!validate()) {
        return;
      }

      if (!accessToken) {
        setError(
          "Please sign in again."
        );

        return;
      }

      setSubmitting(true);

      try {
        const data = {
          name:
            name.trim(),

          slug:
            slug.trim(),

          categoryId,

          description:
            description.trim(),

          price:
            Number(price),

          stock:
            Number(stock),

          images:
            imageUrl.trim()
              ? [
                  imageUrl.trim(),
                ]
              : [],
        };

        if (
          isEditMode &&
          product
        ) {
          await updateProduct(
            accessToken,
            product._id,
            {
              ...data,

              isActive,
            }
          );
        } else {
          await createProduct(
            accessToken,
            data
          );
        }

        onSuccess();

        onClose();
      } catch (
        submitError
      ) {
        setError(
          submitError instanceof
            Error
            ? submitError.message
            : "Something went wrong."
        );
      } finally {
        setSubmitting(false);
      }
    };

  const inputClass = (
    hasError?: string
  ) =>
    `h-11 w-full rounded-xl border bg-white px-4 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 ${
      hasError
        ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/10"
        : "border-border focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
    }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-900/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-white shadow-2xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Package
                size={18}
              />
            </div>

            <div>
              <h2 className="text-xl font-black text-primary-900">
                {isEditMode
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <p className="mt-0.5 text-xs text-primary-400 sm:text-sm">
                {isEditMode
                  ? "Update product details and inventory."
                  : "Create a new product for your store."}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close modal"
            onClick={
              onClose
            }
            className="flex h-9 w-9 items-center justify-center rounded-full text-primary-400 transition hover:bg-primary-50 hover:text-primary-900"
          >
            <X
              size={18}
            />
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={
            handleSubmit
          }
          noValidate
          className="space-y-5 p-6"
        >
          {/* Name / Slug */}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-primary-800">
                Product Name
              </label>

              <input
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
                className={inputClass(
                  fieldErrors.name
                )}
                placeholder="Casual Sneakers"
              />

              {fieldErrors.name && (
                <p className="mt-1.5 text-xs font-medium text-danger">
                  {
                    fieldErrors.name
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-primary-800">
                Slug
              </label>

              <input
                value={
                  slug
                }
                onChange={(
                  event
                ) => {
                  setSlug(
                    event.target
                      .value
                  );

                  clearFieldError(
                    "slug"
                  );
                }}
                className={inputClass(
                  fieldErrors.slug
                )}
                placeholder="casual-sneakers"
              />

              {fieldErrors.slug && (
                <p className="mt-1.5 text-xs font-medium text-danger">
                  {
                    fieldErrors.slug
                  }
                </p>
              )}
            </div>
          </div>

          {/* Category */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-primary-800">
              Category
            </label>

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

                clearFieldError(
                  "categoryId"
                );
              }}
              className={inputClass(
                fieldErrors.categoryId
              )}
            >
              <option value="">
                Select category
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

            {fieldErrors.categoryId && (
              <p className="mt-1.5 text-xs font-medium text-danger">
                {
                  fieldErrors.categoryId
                }
              </p>
            )}
          </div>

          {/* Price / Stock */}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-primary-800">
                Price
                <span className="ml-1 font-normal text-primary-400">
                  (NPR)
                </span>
              </label>

              <input
                type="number"
                min="0"
                value={
                  price
                }
                onChange={(
                  event
                ) => {
                  setPrice(
                    event.target
                      .value
                  );

                  clearFieldError(
                    "price"
                  );
                }}
                className={inputClass(
                  fieldErrors.price
                )}
                placeholder="2500"
              />

              {fieldErrors.price && (
                <p className="mt-1.5 text-xs font-medium text-danger">
                  {
                    fieldErrors.price
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-primary-800">
                Stock
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={
                  stock
                }
                onChange={(
                  event
                ) => {
                  setStock(
                    event.target
                      .value
                  );

                  clearFieldError(
                    "stock"
                  );
                }}
                className={inputClass(
                  fieldErrors.stock
                )}
                placeholder="10"
              />

              {fieldErrors.stock && (
                <p className="mt-1.5 text-xs font-medium text-danger">
                  {
                    fieldErrors.stock
                  }
                </p>
              )}
            </div>
          </div>

          {/* Image URL */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary-800">
              <Image
                size={15}
                className="text-brand-600"
              />

              Image URL

              <span className="font-normal text-primary-400">
                (optional)
              </span>
            </label>

            <input
              value={
                imageUrl
              }
              onChange={(
                event
              ) => {
                setImageUrl(
                  event.target
                    .value
                );

                clearFieldError(
                  "imageUrl"
                );
              }}
              className={inputClass(
                fieldErrors.imageUrl
              )}
              placeholder="https://example.com/product.jpg"
            />

            {fieldErrors.imageUrl && (
              <p className="mt-1.5 text-xs font-medium text-danger">
                {
                  fieldErrors.imageUrl
                }
              </p>
            )}

            {imageUrl &&
              !fieldErrors.imageUrl && (
                <div className="mt-3 h-20 w-20 overflow-hidden rounded-xl border border-border bg-primary-50">
                  <img
                    src={
                      imageUrl
                    }
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-primary-800">
              Description
            </label>

            <textarea
              rows={4}
              value={
                description
              }
              onChange={(
                event
              ) => {
                setDescription(
                  event.target
                    .value
                );

                clearFieldError(
                  "description"
                );
              }}
              className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 ${
                fieldErrors.description
                  ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/10"
                  : "border-border focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
              }`}
              placeholder="Describe this product..."
            />

            {fieldErrors.description && (
              <p className="mt-1.5 text-xs font-medium text-danger">
                {
                  fieldErrors.description
                }
              </p>
            )}
          </div>

          {/* Status */}

          {isEditMode && (
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-primary-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-primary-900">
                  Product Status
                </p>

                <p className="mt-1 text-xs text-primary-400">
                  Inactive
                  products are
                  hidden from
                  buyers.
                </p>
              </div>

              <select
                value={
                  isActive
                    ? "active"
                    : "inactive"
                }
                onChange={(
                  event
                ) =>
                  setIsActive(
                    event.target
                      .value ===
                      "active"
                  )
                }
                className="h-10 rounded-lg border border-border bg-white px-3 text-sm font-semibold text-primary-700 outline-none focus:border-brand-400"
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>
          )}

          {/* Global Error */}

          {error && (
            <div className="rounded-xl border border-danger/15 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
              {error}
            </div>
          )}

          {/* Actions */}

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                submitting
              }
              className="h-10 rounded-xl border border-border px-5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting
              }
              className="h-10 min-w-[125px] rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MerchantProductFormModal;