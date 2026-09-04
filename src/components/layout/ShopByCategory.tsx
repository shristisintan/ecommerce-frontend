import {
  ArrowRight,
  House,
  Package,
  Shirt,
  Smartphone,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getCategories,
} from "../../api/categoryApi";

import type {
  Category,
} from "../../types/category";

import Container from "../common/Container";

const getCategoryIcon = (
  slug: string
) => {
  const value =
    slug.toLowerCase();

  if (
    value.includes(
      "electronic"
    )
  ) {
    return Smartphone;
  }

  if (
    value.includes(
      "fashion"
    )
  ) {
    return Shirt;
  }

  if (
    value.includes(
      "home"
    )
  ) {
    return House;
  }

  return Package;
};

const ShopByCategory = () => {
  const [
    categories,
    setCategories,
  ] =
    useState<Category[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const load =
      async () => {
        try {
          const response =
            await getCategories();

          setCategories(
            response.data
          );
        } catch (
          error
        ) {
          console.error(
            "Unable to load categories:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    void load();
  }, []);

  return (
    <section
      id="categories"
      className="scroll-mt-28 bg-white py-12 sm:py-14"
    >
      <Container>
        {/* Heading */}

        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Browse
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-primary-900 sm:text-3xl">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 text-sm font-semibold text-primary-600 transition hover:text-brand-700 sm:flex"
          >
            All products

            <ArrowRight
              size={15}
            />
          </Link>
        </div>

        {/* Categories */}

        <div className="mt-7">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({
                length: 4,
              }).map(
                (
                  _,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="h-[112px] animate-pulse rounded-xl bg-primary-50"
                  />
                )
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {categories.map(
                (
                  category
                ) => {
                  const Icon =
                    getCategoryIcon(
                      category.slug
                    );

                  return (
                    <Link
                      key={
                        category._id
                      }
                      to={`/products?categoryId=${category._id}&page=1`}
                      className="group flex min-h-[112px] items-center gap-4 rounded-xl border border-border bg-white px-4 py-5 transition hover:border-brand-300 hover:bg-brand-50/50"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition group-hover:bg-brand-100">
                        <Icon
                          size={19}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold leading-5 text-primary-900 sm:text-base">
                          {
                            category.name
                          }
                        </p>

                        <p className="mt-1 text-xs text-primary-400">
                          Shop now
                        </p>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default ShopByCategory;