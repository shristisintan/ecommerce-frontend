import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import Container from "../common/Container";

const HeroSection = () => {
  return (
    <section className="bg-white">
      <Container className="py-6 sm:py-8">
        <div className="relative overflow-hidden rounded-[22px] bg-[#e9f3f1]">
          <div className="grid min-h-[500px] lg:grid-cols-[0.95fr_1.05fr]">
            {/* Content */}

            <div className="relative z-10 flex flex-col justify-center px-7 py-12 sm:px-10 lg:px-14 lg:py-16">
              <div className="inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
                <ShieldCheck
                  size={15}
                />

                NOVA Marketplace
              </div>

              <h1 className="mt-5 max-w-[580px] text-[43px] font-black leading-[0.98] tracking-[-0.055em] text-primary-900 sm:text-5xl lg:text-[64px]">
                Find your next
                favorite product.
              </h1>

              <p className="mt-6 max-w-[500px] text-sm leading-7 text-primary-600 sm:text-base">
                Shop products from
                multiple stores through
                one simple and secure
                marketplace.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary-900 px-7 text-sm font-semibold !text-white transition hover:bg-brand-700"
                >
                  Shop Now

                  <ArrowRight
                    size={16}
                  />
                </Link>

                <a
                  href="#categories"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-primary-300 bg-white/70 px-7 text-sm font-semibold text-primary-800 transition hover:bg-white"
                >
                  Browse Categories
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-2 text-xs font-medium text-primary-500">
                <span>
                  Multi-store
                </span>

                <span>
                  Live inventory
                </span>

                <span>
                  eSewa payments
                </span>
              </div>
            </div>

            {/* Image */}

            <div className="relative min-h-[390px] lg:min-h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85"
                alt="Modern retail store"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#e9f3f1] via-transparent to-transparent lg:w-1/3" />

              <div className="absolute bottom-6 right-6 rounded-2xl bg-white/90 px-5 py-4 shadow-lg backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                  Shop confidently
                </p>

                <p className="mt-1 text-sm font-semibold text-primary-900">
                  Secure checkout &
                  verified payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;