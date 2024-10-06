import { Button } from "../../components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimatedTooltip } from "../../components/ui/animated-tooltip";
import { people } from "../../constants/HERO_PEOPLE";
import { useNavigate } from "react-router-dom";

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

function HeroSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const navigate = useNavigate();

    return (
        <section ref={ref} className="w-full pt-32 md:py-24 lg:py-32 xl:py-48 px-4">
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
                        <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => navigate("/register")}>
                            Get Started
                        </Button>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <Button variant="outline" className="text-primary border-primary hover:bg-slate-100" onClick={() => navigate("/login")}>
                            Login Now
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default HeroSection
