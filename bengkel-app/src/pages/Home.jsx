import HeroSection from "../components/home1/Hero";
import WhyChooseUs from "../components/home1/whychoose";
import FAQ from "../components/home1/faq";
import BengkelBanner from "../components/home1/bengkelbanner";
import Counter from "../components/home1/counter";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <WhyChooseUs />
      <Counter />
      <FAQ />
      <BengkelBanner />
    </div>
  );
};

export default Home;
