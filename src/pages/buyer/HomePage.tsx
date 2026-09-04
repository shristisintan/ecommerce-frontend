import Header from "../../components/layout/Header";

import HeroSection from "../../components/layout/HeroSection";

import ShopByCategory from "../../components/layout/ShopByCategory";

import ProductSection from "../../components/product/ProductSection";

import BrandStrip from "../../components/layout/BrandStrip";

import Footer from "../../components/layout/Footer";

const HomePage = () => {
  return (
    <>
      <Header />

      <main className="bg-white">
        <HeroSection />

        <ShopByCategory />

        <ProductSection />

        <BrandStrip />
      </main>

      <Footer />
    </>
  );
};

export default HomePage;