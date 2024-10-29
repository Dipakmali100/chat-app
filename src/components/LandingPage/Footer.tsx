
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from "../ui/dialog";
import { TERMS_AND_CONDITION } from "../../constants/TERMS_AND_CONDITION";
import { PRIVACY_POLICY } from "../../constants/PRIVACY_POLICY";

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
          className="text-sm text-gray-400 flex gap-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="max-md:hidden">© 2024 ChatNow. All rights reserved.</p>
          <Dialog>
            <DialogTrigger>
              <u className="cursor-pointer">Terms and Conditions</u>
            </DialogTrigger>
            <DialogContent className="max-h-screen">
              <h1 className="text-xl font-semibold">Terms and Conditions</h1>
              <DialogDescription
                className="flex flex-col gap-2 overflow-auto pr-2"
                style={{ maxHeight: '80vh', overflowY: 'scroll', scrollbarWidth: 'none' }} // Ensuring scroll appears when content is long
              >
                {TERMS_AND_CONDITION.map((term, index) => (
                  <div key={index}>
                    <h2 className="text-md text-black font-semibold">{term.title}</h2>
                    <DialogDescription
                      dangerouslySetInnerHTML={{ __html: term.description }}
                      className="text-justify"
                    />
                  </div>
                ))}
              </DialogDescription>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>
              <u className="cursor-pointer">Privacy policy</u>
            </DialogTrigger>
            <DialogContent className="max-h-screen">
              <h1 className="text-xl font-semibold">Privacy Policy</h1>
              <DialogDescription
                className="flex flex-col gap-2 overflow-auto pr-2"
                style={{ maxHeight: '80vh', overflowY: 'scroll', scrollbarWidth: 'none' }} // Ensuring scroll appears when content is long
              >
                {PRIVACY_POLICY.map((term, index) => (
                  <div key={index}>
                    <h2 className="text-md text-black font-semibold">{term.title}</h2>
                    <DialogDescription
                      dangerouslySetInnerHTML={{ __html: term.description }}
                      className="text-justify"
                    />
                  </div>
                ))}
              </DialogDescription>
            </DialogContent>

          </Dialog>

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
