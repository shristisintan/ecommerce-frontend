import {
  ArrowLeft,
  Check,
  Minus,
  Package,
  Plus,
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
  const { id } = useParams();

  const [product, setProduct] =
    useState<Product | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

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

  const {
  addItem,
} = useCart();

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
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load product"
          );
        } finally {
          setLoading(false);
        }
      };

    void loadProduct();
  }, [id]);

  const decreaseQuantity = () => {
    setQuantity(
      (current) =>
        Math.max(
          1,
          current - 1
        )
    );
  };

  const increaseQuantity = () => {
    if (!product) {
      return;
    }

    setQuantity(
      (current) =>
        Math.min(
          product.stock,
          current + 1
        )
    );
  };

  const handleAddToCart =
    async () => {
      if (!product) {
        return;
      }

      try {
        setAddingToCart(true);
        setCartMessage("");

       await addItem(
        product._id,
        quantity
        );

         setCartMessage(
          "Added to cart successfully."
        );
      } catch (error) {
        setCartMessage(
          error instanceof Error
            ? error.message
            : "Unable to add product to cart."
        );
      } finally {
        setAddingToCart(false);
      }
    };

  if (loading) {
    return (
      <>
        <Header />

        <Container className="py-10 lg:py-14">
          <div className="grid animate-pulse gap-10 lg:grid-cols-2">
            <div className="aspect-square rounded-[24px] bg-black/5" />

            <div className="py-6">
              <div className="h-4 w-28 rounded bg-black/5" />

              <div className="mt-5 h-12 w-4/5 rounded bg-black/10" />

              <div className="mt-5 h-8 w-32 rounded bg-black/10" />

              <div className="mt-8 h-24 rounded bg-black/5" />
            </div>
          </div>
        </Container>
      </>
    );
  }

  if (
    error ||
    !product
  ) {
    return (
      <>
        <Header />

        <Container className="py-20">
          <div className="rounded-[24px] bg-[#f7f7f7] px-6 py-20 text-center">
            <Package
              size={40}
              className="mx-auto text-black/30"
            />

            <h1 className="mt-5 text-2xl font-bold">
              Product unavailable
            </h1>

            <p className="mt-2 text-sm text-black/50">
              {error ||
                "This product could not be found."}
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium !text-white"
            >
              Back to Shop
            </Link>
          </div>
        </Container>
      </>
    );
  }

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
    product.images.length > 0
      ? product.images
      : [];

  const currentImage =
    images[selectedImage];

  return (
    <>
      <Header />

      <main>
        <Container className="py-8 lg:py-12">
          {/* Breadcrumb */}
          <Link
            to="/products"
            className="mb-8 inline-flex items-center gap-2 text-sm text-black/50 transition hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to Shop
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            {/* Images */}
            <div>
              <div className="aspect-square overflow-hidden rounded-[24px] bg-[#f0f0f0]">
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
                  <div className="flex h-full items-center justify-center text-black/25">
                    <Package
                      size={64}
                    />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {images.map(
                    (
                      image,
                      index
                    ) => (
                      <button
                        key={
                          image
                        }
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            index
                          )
                        }
                        className={`aspect-square overflow-hidden rounded-[14px] border-2 bg-[#f0f0f0] ${
                          selectedImage ===
                          index
                            ? "border-black"
                            : "border-transparent"
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

            {/* Details */}
            <div className="lg:py-4">
              {category && (
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40">
                  {category}
                </p>
              )}

              <h1 className="mt-3 max-w-xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                {product.name}
              </h1>

              {merchant && (
                <div className="mt-4 flex items-center gap-2 text-sm text-black/50">
                  <Store
                    size={16}
                  />

                  Sold by{" "}
                  <span className="font-medium text-black">
                    {merchant}
                  </span>
                </div>
              )}

              <p className="mt-6 text-3xl font-bold tracking-tight">
                NPR{" "}
                {product.price.toLocaleString(
                  "en-NP"
                )}
              </p>

              {/* Stock */}
              <div className="mt-5">
                {product.stock >
                0 ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                      <Check
                        size={14}
                      />
                    </span>

                    <span>
                      In stock
                    </span>

                    <span className="text-black/45">
                      (
                      {
                        product.stock
                      }{" "}
                      available)
                    </span>
                  </div>
                ) : (
                  <span className="rounded-full bg-black px-4 py-2 text-sm text-white">
                    Out of stock
                  </span>
                )}
              </div>

              <div className="my-7 h-px bg-black/10" />

              {/* Description */}
              <div>
                <h2 className="font-semibold">
                  Product Details
                </h2>

                <p className="mt-3 max-w-xl leading-7 text-black/60">
                  {
                    product.description
                  }
                </p>
              </div>

              <div className="my-7 h-px bg-black/10" />

              {/* Quantity / Cart */}
              {product.stock >
                0 && (
                <>
                  <p className="mb-3 text-sm font-medium">
                    Quantity
                  </p>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex h-[54px] w-full items-center justify-between rounded-full bg-[#f0f0f0] px-5 sm:w-[170px]">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={
                          decreaseQuantity
                        }
                        disabled={
                          quantity <=
                          1
                        }
                        className="disabled:opacity-30"
                      >
                        <Minus
                          size={18}
                        />
                      </button>

                      <span className="font-medium">
                        {
                          quantity
                        }
                      </span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={
                          increaseQuantity
                        }
                        disabled={
                          quantity >=
                          product.stock
                        }
                        className="disabled:opacity-30"
                      >
                        <Plus
                          size={18}
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={
                        addingToCart
                      }
                      onClick={
                        handleAddToCart
                      }
                      className="flex h-[54px] flex-1 items-center justify-center gap-2 rounded-full bg-black px-8 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ShoppingBag
                        size={18}
                      />

                      {addingToCart
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>
                  </div>

                  {cartMessage && (
                    <p className="mt-4 text-sm text-black/60">
                      {
                        cartMessage
                      }
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
};

export default ProductDetailsPage;