import { Button } from "../components/ui/button";
import { MessageCircle, Zap, Lock, Globe, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useInView, useAnimationControls } from "framer-motion";
import { useRef, useEffect } from "react";
import { Link as ScrollLink, Element } from 'react-scroll';
import { SparklesCore } from "../components/ui/sparkles";
import { AnimatedTooltip } from "../components/ui/animated-tooltip";
import { people } from "../constants/HERO_PEOPLE";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] } }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const controls = useAnimationControls();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        controls.start({ opacity: 1, y: 0 });
      } else {
        controls.start({ opacity: 0, y: 20 });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-white z-50"
        style={{ scaleX }}
      />
      <div className="w-full fixed inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={150}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <motion.header
        className="fixed z-10 top-0 left-0 right-0 px-4 lg:px-6 h-14 flex items-center justify-between border-b border-gray-800 bg-black"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        <ScrollLink className="flex items-center justify-center" to="heroSection"
          smooth={true}
          duration={800}
          offset={-80}>
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
            <MessageCircle className="h-6 w-6 text-primary" color="white" />
          </motion.div>
          <motion.span
            className="ml-2 text-2xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            ChatNow
          </motion.span>
        </ScrollLink>
        <nav className="flex gap-4 sm:gap-6">
          {[
            { label: "Features", to: "features" },
            { label: "Testimonials", to: "testimonials" },
            { label: "Register/Login", to: "#" }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              {item.to !== "#" ? (
                <ScrollLink
                  className="text-sm font-medium hover:text-slate-200 transition-colors"
                  to={item.to}
                  smooth={true}
                  duration={800}
                  offset={-80}
                >
                  <div className="pt-2">
                    {item.label}
                  </div>
                </ScrollLink>
              ) : (
                <Link className="text-sm font-medium hover:text-slate-200 transition-colors" to="#">
                  <Button variant="outline" className="text-primary border-primary hover:bg-slate-100">
                    Register/Login
                  </Button>
                </Link>
              )}
            </motion.div>
          ))}
        </nav>
      </motion.header>

      <main className="flex-1">
        <Element name="heroSection">
          <HeroSection />
        </Element>
        {/* Wrap sections with Element and assign the IDs */}
        <Element name="features">
          <FeaturesSection />
        </Element>
        <Element name="testimonials">
          <TestimonialSection />
        </Element>
      </main>

      <Footer scrollToTop={scrollToTop} />
      <motion.button
        className="fixed bottom-4 right-4 p-2 bg-primary text-white rounded-full shadow-lg"
        onClick={scrollToTop}
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronUp className="h-6 w-6" />
      </motion.button>
    </div>
  );
}

function HeroSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
      <div className="flex flex-row items-center justify-center mb-10 w-full">
        <AnimatedTooltip items={people} />
      </div>
      <motion.div
        className="container mx-auto text-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="space-y-4"
          variants={staggerChildren}
          initial="initial"
          animate={isInView ? "animate" : ""}
        >
          <motion.h1
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            variants={fadeInUp}
          >
            Connect in Real-Time with ChatNow
          </motion.h1>
          <motion.p
            className="mx-auto max-w-[700px] text-gray-400 text-xl md:text-2xl"
            variants={fadeInUp}
          >
            Experience seamless, instant messaging with our cutting-edge chat platform. Stay connected like never before.
          </motion.p>
        </motion.div>
        <motion.div
          className="mt-8 flex justify-center space-x-4"
          variants={staggerChildren}
          initial="initial"
          animate={isInView ? "animate" : ""}
        >
          <motion.div variants={fadeInUp}>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Get Started
            </Button>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Button variant="outline" className="text-primary border-primary hover:bg-slate-100">
              Login Now
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    { icon: Zap, title: "Lightning Fast", description: "Experience real-time messaging with zero lag. Our platform ensures your messages are delivered instantly." },
    { icon: Lock, title: "Secure & Private", description: "Your conversations are protected with advanced security measures, and your privacy is our top priority." },
    { icon: Globe, title: "Cross-Platform", description: "Chat seamlessly across all your devices. Our app works on desktop, mobile, and web browsers." }
  ]

  return (
    // <section ref={ref} className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 bg-gradient-to-b from-gray-900 to-black">
    <section ref={ref} className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Key Features
        </motion.h2>
        <motion.div
          className="grid gap-10 sm:grid-cols-2 md:grid-cols-3"
          variants={staggerChildren}
          initial="initial"
          animate={isInView ? "animate" : ""}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-gray-800 transition-all hover:scale-105 hover:bg-gray-700"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 * index, type: "spring", stiffness: 260, damping: 20 }}
              >
                <feature.icon className="h-12 w-12 text-primary" color="#3e9392" />
              </motion.div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-400 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TestimonialSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const testimonials = [
    { name: "Alex Johnson", role: "Software Developer", quote: "ChatNow has revolutionized our team communication. It's fast, reliable, and secure." },
    { name: "Sarah Lee", role: "Marketing Manager", quote: "The cross-platform support is a game-changer. I can seamlessly switch between devices without missing a beat." },
    { name: "Michael Chen", role: "Startup Founder", quote: "The encryption features give us peace of mind when discussing sensitive business matters." }
  ]

  return (
    <section ref={ref} className="w-full py-12 mb-5 md:py-24 lg:py-32 px-4 bg-gradient-to-b from-black to-[#]">
      <motion.div
        className="container mx-auto text-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-3xl font-bold tracking-tighter sm:text-5xl mb-12"
          variants={fadeInUp}
        >
          What Our Users Say
        </motion.h2>
        <motion.div
          className="grid gap-8 md:grid-cols-3"
          variants={staggerChildren}
          initial="initial"
          animate={isInView ? "animate" : ""}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
              variants={fadeInUp}
            >
              <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-gray-400">{testimonial.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

function Footer({ scrollToTop }: { scrollToTop: () => void }) {
  return (
    <motion.footer
      className="py-6 px-4 border-t border-gray-800 bg-black"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.p
          className="text-sm text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          © 2024 ChatNow. All rights reserved.
        </motion.p>
        <motion.button
          className="text-sm text-gray-400 hover:text-primary transition-colors"
          onClick={scrollToTop}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Back to Top
        </motion.button>
      </div>
    </motion.footer>
  )
}