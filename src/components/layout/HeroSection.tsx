import { Link } from "react-router-dom";
import Container from "../common/Container";

const stats = [
  {
    value: "Multi-Store",
    label: "Shop across different merchants",
  },
  {
    value: "Secure",
    label: "Verified eSewa payments",
  },
  {
    value: "Live Stock",
    label: "Availability checked at checkout",
  },
];

const HeroSection = () => {
  return (
    <section className="overflow-hidden bg-[#f2f0f1]">
      <Container>
        <div className="grid min-h-[600px] items-center lg:grid-cols-2">
          {/* Left content */}
          <div className="py-12 lg:py-16">
            <h1 className="max-w-[590px] text-[42px] font-black uppercase leading-[0.95] tracking-[-0.045em] text-black sm:text-5xl lg:text-[64px]">
              Discover products from stores you trust
            </h1>

            <p className="mt-6 max-w-[560px] text-sm leading-6 text-black/60 sm:text-base">
              Explore products from multiple verified stores, compare your
              options, and enjoy a simple and secure shopping experience.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex h-[52px] min-w-[210px] items-center justify-center rounded-full bg-black px-8 text-sm font-medium !text-white transition-colors hover:bg-black/80"
            >
              Shop Now
            </Link>

            {/* Highlights */}
            <div className="mt-12 flex flex-wrap gap-y-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.value}
                  className={`pr-7 ${
                    index !== stats.length - 1
                      ? "mr-7 border-r border-black/10"
                      : ""
                  }`}
                >
                  <p className="text-xl font-bold tracking-tight sm:text-2xl">
                    {stat.value}
                  </p>

                  <p className="mt-1 max-w-[150px] text-xs leading-5 text-black/60 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right image */}
          <div className="relative min-h-[420px] self-stretch lg:min-h-[600px]">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=85"
              alt="Shopping collection"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />

            <div
              aria-hidden="true"
              className="absolute right-[7%] top-[14%] text-5xl text-black"
            >
              ✦
            </div>

            <div
              aria-hidden="true"
              className="absolute left-[7%] top-[45%] text-3xl text-black"
            >
              ✦
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;