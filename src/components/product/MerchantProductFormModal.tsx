import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
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
  ] = useState<Category[]>([]);

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
    useState<FieldErrors>({});

  const isEditMode =
    Boolean(product);

  useEffect(() => {
    if (!open) return;

    const loadCategories =
      async () => {
        try {
          const result =
            await getCategories();

          setCategories(
            result.data.filter(
              (category) =>
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

  useEffect(() => {
    if (!open) return;

    setError("");
    setFieldErrors({});

    if (product) {
      setName(product.name);
      setSlug(product.slug);

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
        String(product.price)
      );

      setStock(
        String(product.stock)
      );

      setImageUrl(
        product.images?.[0] ?? ""
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

  const clearFieldError = (
    field: keyof FieldErrors
  ) => {
    setFieldErrors(
      (current) => ({
        ...current,
        [field]: undefined,
      })
    );
  };

  const validate = () => {
    const errors:
      FieldErrors = {};

    if (!name.trim()) {
      errors.name =
        "Product name is required.";
    } else if (
      name.trim().length < 2
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
      Number.isNaN(Number(price))
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
      description.trim().length <
      5
    ) {
      errors.description =
        "Description must be at least 5 characters.";
    }

    if (imageUrl.trim()) {
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
    `w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
      hasError
        ? "border-red-400 focus:border-red-500"
        : "border-black/10 focus:border-black/40"
    }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-black">
              {isEditMode
                ? "Edit Product"
                : "Add Product"}
            </h2>

            <p className="mt-1 text-sm text-black/45">
              {isEditMode
                ? "Update product details and stock."
                : "Create a new product for your store."}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
          >
            <X
              size={19}
            />
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          noValidate
          className="space-y-5 p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
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
                <p className="mt-1 text-xs text-red-500">
                  {
                    fieldErrors.name
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
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
              />

              {fieldErrors.slug && (
                <p className="mt-1 text-xs text-red-500">
                  {
                    fieldErrors.slug
                  }
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
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
                  event.target.value
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

            {fieldErrors.categoryId && (
              <p className="mt-1 text-xs text-red-500">
                {
                  fieldErrors.categoryId
                }
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Price (NPR)
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
                    event.target.value
                  );

                  clearFieldError(
                    "price"
                  );
                }}
                className={inputClass(
                  fieldErrors.price
                )}
              />

              {fieldErrors.price && (
                <p className="mt-1 text-xs text-red-500">
                  {
                    fieldErrors.price
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
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
                    event.target.value
                  );

                  clearFieldError(
                    "stock"
                  );
                }}
                className={inputClass(
                  fieldErrors.stock
                )}
              />

              {fieldErrors.stock && (
                <p className="mt-1 text-xs text-red-500">
                  {
                    fieldErrors.stock
                  }
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Image URL
              <span className="ml-1 font-normal text-black/40">
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
                  event.target.value
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
              <p className="mt-1 text-xs text-red-500">
                {
                  fieldErrors.imageUrl
                }
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
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
                  event.target.value
                );

                clearFieldError(
                  "description"
                );
              }}
              className={inputClass(
                fieldErrors.description
              )}
              placeholder="Product description..."
            />

            {fieldErrors.description && (
              <p className="mt-1 text-xs text-red-500">
                {
                  fieldErrors.description
                }
              </p>
            )}
          </div>

          {isEditMode && (
            <div className="flex items-center justify-between rounded-xl border border-black/10 p-4">
              <div>
                <p className="text-sm font-semibold">
                  Product Status
                </p>

                <p className="text-xs text-black/45">
                  Inactive products are hidden from buyers.
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
                className="rounded-lg border border-black/10 px-3 py-2 text-sm"
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

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-black/10 pt-5">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                submitting
              }
              className="rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting
              }
              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
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