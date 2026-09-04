import {
  ArrowLeft,
  Check,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Store,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Container from "../../components/common/Container";

import {
  getProductById,
} from "../../api/productApi";

import {
  useCart,
} from "../../context/CartContext";

import type {
  Product,
  ProductCategory,
  ProductTenant,
} from "../../types/product";

const ProductDetailsPage = () => {
  const { id } =
    useParams();

  const [
    product,
    setProduct,
  ] =
    useState<Product | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(0);

  const [
    addingToCart,
    setAddingToCart,
  ] = useState(false);

  const [
    cartMessage,
    setCartMessage,
  ] = useState("");

  const [
    cartMessageType,
    setCartMessageType,
  ] =
    useState<
      "success" | "error" | ""
    >("");

  const {
    addItem,
  } = useCart();

  /* ======================================================
     LOAD PRODUCT
  ====================================================== */

  useEffect(() => {
    const loadProduct =
      async () => {
        if (!id) {
          setError(
            "Product ID is missing."
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);

          setError("");

          const result =
            await getProductById(
              id
            );

          setProduct(
            result.data
          );

          setQuantity(1);

          setSelectedImage(
            0
          );

          setCartMessage("");

          setCartMessageType(
            ""
          );
        } catch (
          productError
        ) {
          setError(
            productError instanceof
              Error
              ? productError.message
              : "Unable to load product"
          );
        } finally {
          setLoading(false);
        }
      };

    void loadProduct();
  }, [id]);

  /* ======================================================
     QUANTITY
  ====================================================== */

  const decreaseQuantity =
    () => {
      setQuantity(
        (
          current
        ) =>
          Math.max(
            1,
            current - 1
          )
      );
    };

  const increaseQuantity =
    () => {
      if (!product) {
        return;
      }

      setQuantity(
        (
          current
        ) =>
          Math.min(
            product.stock,
            current + 1
          )
      );
    };

  /* ======================================================
     ADD TO CART
  ====================================================== */

  const handleAddToCart =
    async () => {
      if (!product) {
        return;
      }

      try {
        setAddingToCart(
          true
        );

        setCartMessage("");

        setCartMessageType(
          ""
        );

        await addItem(
          product._id,
          quantity
        );

        setCartMessage(
          "Product added to your cart."
        );

        setCartMessageType(
          "success"
        );
      } catch (
        cartError
      ) {
        setCartMessage(
          cartError instanceof
            Error
            ? cartError.message
            : "Unable to add product to cart."
        );

        setCartMessageType(
          "error"
        );
      } finally {
        setAddingToCart(
          false
        );
      }
    };

  /* ======================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <>
        <Header />

        <main className="bg-white">
          <Container className="py-8 sm:py-10 lg:py-12">
            <div className="mb-7 h-4 w-28 animate-pulse rounded bg-primary-100" />

            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div className="aspect-square animate-pulse rounded-2xl bg-primary-100" />

              <div className="py-4">
                <div className="h-3 w-24 animate-pulse rounded bg-primary-100" />

                <div className="mt-5 h-12 w-4/5 animate-pulse rounded bg-primary-100" />

                <div className="mt-5 h-5 w-40 animate-pulse rounded bg-primary-100" />

                <div className="mt-7 h-9 w-32 animate-pulse rounded bg-primary-100" />

                <div className="mt-8 h-24 animate-pulse rounded bg-primary-100" />

                <div className="mt-8 h-14 animate-pulse rounded-xl bg-primary-100" />
              </div>
            </div>
          </Container>
        </main>

        <Footer />
      </>
    );
  }

  /* ======================================================
     ERROR
  ====================================================== */

  if (
    error ||
    !product
  ) {
    return (
      <>
        <Header />

        <main className="bg-white">
          <Container className="py-16 sm:py-20">
            <div className="rounded-2xl border border-border bg-primary-50 px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary-400 shadow-sm">
                <Package
                  size={26}
                />
              </div>

              <h1 className="mt-5 text-2xl font-black tracking-tight text-primary-900">
                Product unavailable
              </h1>

              <p className="mx-auto mt-2 max-w-[420px] text-sm leading-6 text-primary-500">
                {error ||
                  "This product could not be found."}
              </p>

              <Link
                to="/products"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold !text-white transition hover:bg-brand-700"
              >
                <ArrowLeft
                  size={16}
                />

                Back to Shop
              </Link>
            </div>
          </Container>
        </main>

        <Footer />
      </>
    );
  }

  /* ======================================================
     PRODUCT DATA
  ====================================================== */

  const merchant =
    typeof product.tenantId ===
    "object"
      ? (
          product.tenantId as ProductTenant
        ).name
      : null;

  const category =
    typeof product.categoryId ===
    "object"
      ? (
          product.categoryId as ProductCategory
        ).name
      : null;

  const images =
    product.images?.length >
    0
      ? product.images
      : [];

  const currentImage =
    images[selectedImage];

  const isLowStock =
    product.stock > 0 &&
    product.stock <= 5;

  const isOutOfStock =
    product.stock <= 0;

  /* ======================================================
     PAGE
  ====================================================== */

  return (
    <>
      <Header />

      <main className="bg-white">
        <Container className="py-7 sm:py-9 lg:py-11">
          {/* Breadcrumb */}

          <Link
            to="/products"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-500 transition hover:text-brand-700"
          >
            <ArrowLeft
              size={16}
            />

            Back to Shop
          </Link>

          <div className="grid gap-9 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14">
            {/* =================================================
                PRODUCT IMAGES
            ================================================= */}

            <div>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-primary-50">
                {currentImage ? (
                  <img
                    src={
                      currentImage
                    }
                    alt={
                      product.name
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-primary-300">
                    <Package
                      size={64}
                    />
                  </div>
                )}

                {isLowStock && (
                  <span className="absolute left-4 top-4 rounded-full bg-warning-soft px-3 py-1.5 text-xs font-bold text-warning shadow-sm">
                    Only{" "}
                    {
                      product.stock
                    }{" "}
                    left
                  </span>
                )}

                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
                    <span className="rounded-full bg-primary-900 px-5 py-2.5 text-sm font-semibold text-white">
                      Out of stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}

              {images.length >
                1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {images.map(
                    (
                      image,
                      index
                    ) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        aria-label={`View product image ${
                          index +
                          1
                        }`}
                        onClick={() =>
                          setSelectedImage(
                            index
                          )
                        }
                        className={`aspect-square overflow-hidden rounded-xl border-2 bg-primary-50 transition ${
                          selectedImage ===
                          index
                            ? "border-brand-600"
                            : "border-transparent hover:border-primary-200"
                        }`}
                      >
                        <img
                          src={
                            image
                          }
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <div className="lg:py-3">
              {/* Category */}

              {category && (
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
                  {category}
                </p>
              )}

              {/* Name */}

              <h1 className="mt-3 max-w-[620px] text-3xl font-black leading-tight tracking-[-0.045em] text-primary-900 sm:text-4xl lg:text-[46px]">
                {
                  product.name
                }
              </h1>

              {/* Merchant */}

              {merchant && (
                <div className="mt-4 flex items-center gap-2 text-sm text-primary-500">
                  <Store
                    size={16}
                    className="text-brand-600"
                  />

                  <span>
                    Sold by
                  </span>

                  <span className="font-semibold text-primary-900">
                    {merchant}
                  </span>
                </div>
              )}

              {/* Price */}

              <p className="mt-7 text-3xl font-black tracking-[-0.03em] text-primary-900">
                NPR{" "}
                {product.price.toLocaleString(
                  "en-NP"
                )}
              </p>

              {/* Stock */}

              <div className="mt-4">
                {!isOutOfStock ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-2 text-xs font-semibold text-success">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white">
                      <Check
                        size={12}
                      />
                    </span>

                    In stock

                    <span className="font-medium text-primary-400">
                      ·{" "}
                      {
                        product.stock
                      }{" "}
                      available
                    </span>
                  </div>
                ) : (
                  <span className="inline-flex rounded-full bg-danger-soft px-4 py-2 text-xs font-semibold text-danger">
                    Currently unavailable
                  </span>
                )}
              </div>

              {/* Divider */}

              <div className="my-7 h-px bg-border" />

              {/* Description */}

              <div>
                <h2 className="text-sm font-bold text-primary-900">
                  Product Details
                </h2>

                <p className="mt-3 max-w-[620px] whitespace-pre-line text-sm leading-7 text-primary-500 sm:text-base">
                  {
                    product.description
                  }
                </p>
              </div>

              <div className="my-7 h-px bg-border" />

              {/* Purchase area */}

              {!isOutOfStock && (
                <>
                  <p className="mb-3 text-sm font-semibold text-primary-900">
                    Quantity
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {/* Quantity */}

                    <div className="flex h-[52px] w-full items-center justify-between rounded-full bg-primary-50 px-5 sm:w-[160px]">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={
                          quantity <=
                          1
                        }
                        onClick={
                          decreaseQuantity
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full text-primary-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Minus
                          size={17}
                        />
                      </button>

                      <span className="text-sm font-bold text-primary-900">
                        {
                          quantity
                        }
                      </span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={
                          quantity >=
                          product.stock
                        }
                        onClick={
                          increaseQuantity
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full text-primary-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Plus
                          size={17}
                        />
                      </button>
                    </div>

                    {/* Add to cart */}

                    <button
                      type="button"
                      disabled={
                        addingToCart
                      }
                      onClick={
                        handleAddToCart
                      }
                      className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 px-8 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ShoppingBag
                        size={18}
                      />

                      {addingToCart
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>
                  </div>

                  {/* Cart message */}

                  {cartMessage && (
                    <div
                      className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                        cartMessageType ===
                        "success"
                          ? "bg-success-soft text-success"
                          : "bg-danger-soft text-danger"
                      }`}
                    >
                      {
                        cartMessage
                      }
                    </div>
                  )}
                </>
              )}

              {/* Trust note */}

              <div className="mt-7 flex items-start gap-3 rounded-xl border border-border bg-primary-50 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <ShieldCheck
                    size={18}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-primary-900">
                    Secure marketplace
                    purchase
                  </p>

                  <p className="mt-1 text-xs leading-5 text-primary-500">
                    Payment is verified
                    before your order is
                    marked as paid and
                    stock is deducted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetailsPage;