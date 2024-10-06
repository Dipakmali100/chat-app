
import { Zap, Lock, Globe } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
function FeatureSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    const features = [
        { icon: Zap, title: "Lightning Fast", description: "Experience real-time messaging with zero lag. Our platform ensures your messages are delivered instantly." },
        { icon: Lock, title: "Secure & Private", description: "Your conversations are protected with advanced security measures, and your privacy is our top priority." },
        { icon: Globe, title: "Cross-Platform", description: "Chat seamlessly across all your devices. Our app works on desktop, mobile, and web browsers." }
    ]

    return (
        <section ref={ref} className="w-full pt-20 md:py-24 lg:py-32">
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
                                <feature.icon className="h-12 w-12 text-primary" color="#11fffb" />
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

export default FeatureSection
