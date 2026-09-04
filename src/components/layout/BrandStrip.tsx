import {
  BadgeCheck,
  Boxes,
  CreditCard,
  Store,
} from "lucide-react";

import Container from "../common/Container";

const benefits = [
  {
    icon: Store,
    title:
      "Multi-Store Shopping",
    description:
      "Browse products from multiple merchants in one place.",
  },
  {
    icon: CreditCard,
    title:
      "Secure Payments",
    description:
      "Payments are verified before orders are confirmed.",
  },
  {
    icon: Boxes,
    title:
      "Live Stock",
    description:
      "Availability is validated before successful checkout.",
  },
  {
    icon: BadgeCheck,
    title:
      "Protected Orders",
    description:
      "Transactions help keep order and stock updates consistent.",
  },
];

const BrandStrip = () => {
  return (
    <section className="bg-primary-50 py-12">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(
            (
              benefit
            ) => {
              const Icon =
                benefit.icon;

              return (
                <div
                  key={
                    benefit.title
                  }
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon
                      size={19}
                    />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-primary-900">
                    {
                      benefit.title
                    }
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-text-secondary">
                    {
                      benefit.description
                    }
                  </p>
                </div>
              );
            }
          )}
        </div>
      </Container>
    </section>
  );
};

export default BrandStrip;