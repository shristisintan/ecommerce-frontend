import Header from "../../components/layout/Header";
import HeroSection from "../../components/layout/HeroSection";
import BrandStrip from "../../components/layout/BrandStrip";
import ProductSection from "../../components/product/ProductSection";


const HomePage = () => {
  return (
    <>
      <Header />

      <main>
        <HeroSection />

        <BrandStrip />

        <ProductSection />
      </main>
    </>
  );
};

export default HomePage;