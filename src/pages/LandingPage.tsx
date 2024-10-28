import { ChevronUp } from "lucide-react";
// import { motion, useAnimationControls } from "framer-motion";
import { Element } from 'react-scroll';
import HeroSection from "../components/LandingPage/HeroSection";
import FeatureSection from "../components/LandingPage/FeatureSection";
import TestimonialSection from "../components/LandingPage/TestimonialSection";
import Footer from "../components/LandingPage/Footer";
import Header from "../components/LandingPage/Header";
import { useEffect, useState } from "react";
import { updateTraffic } from "../services/operations/TrafficAPI";

export default function LandingPage() {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    console.log("Updating traffic");
    updateTraffic();
    document.title = "ChatNow"
  },[]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">

      <Header variant="landingPage" />
      <main className="flex-1">
        <Element name="heroSection">
          <HeroSection />
        </Element>
        {/* Wrap sections with Element and assign the IDs */}
        <Element name="features">
          <FeatureSection />
        </Element>
        <Element name="testimonials">
          <TestimonialSection />
        </Element>
      </main>

      <Footer scrollToTop={scrollToTop} />

      {/* <motion.div
        className="fixed bottom-4 right-4 p-2 bg-primary text-white rounded-full shadow-lg z-50"
        onClick={scrollToTop}
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        // whileHover={{ scale: 1.1 }}
        // whileTap={{ scale: 0.9 }}
      >
        <ChevronUp className="h-6 w-6 " />
      </motion.div> */}
      {showButton && (
        <div className="fixed bottom-4 right-4 p-2 bg-primary text-white rounded-full shadow-lg z-50" onClick={scrollToTop}>
          <ChevronUp className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}
