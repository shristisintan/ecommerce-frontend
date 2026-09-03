import Container from "../common/Container";

const highlights = [
  "MULTI-STORE",
  "SECURE PAYMENTS",
  "LIVE STOCK",
  "FAST CHECKOUT",
];

const BrandStrip = () => {
  return (
    <section className="bg-black py-6 sm:py-7">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:justify-between lg:gap-x-14">
          {highlights.map((item) => (
            <span
              key={item}
              className="whitespace-nowrap text-sm font-semibold tracking-[0.08em] text-white sm:text-base lg:text-lg"
            >
              {item}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BrandStrip;