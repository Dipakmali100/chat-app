
import { motion } from "framer-motion";

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

export default Footer
