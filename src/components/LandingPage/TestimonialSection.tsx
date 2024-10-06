
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
function TestimonialSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    const testimonials = [
        { name: "Rohan Mahajan", role: "IT Engineer", quote: "ChatNow transformed how I connect with friends! The real-time chatting and active status make it so easy to stay in touch." },
        { name: "Jatin Khalane", role: "Pharmacist", quote: "Finally, a messaging app that’s fast and reliable! I love how I can instantly see who’s online and start chatting right away." },
        { name: "Chaitanya Shelar", role: "Software Developer", quote: "ChatNow is my go-to for chatting with friends! The user-friendly interface and real-time updates keep our conversations flowing smoothly." }
    ]

    return (
        <section ref={ref} className="w-full pt-20 pb-4 mb-5 md:py-24 lg:pb-32 lg:pt-28 px-4 bg-gradient-to-b from-black to-[#]">
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
                            <p className="text-gray-200 mb-4">"{testimonial.quote}"</p>
                            <p className="font-semibold text-[#11fffb]">{testimonial.name}</p>
                            <p className="text-sm text-white">{testimonial.role}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    )
}

export default TestimonialSection
