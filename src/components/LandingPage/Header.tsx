import { Button } from "../../components/ui/button";
import { House, Menu, MessageCircleMore, MessageSquareText, Telescope } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import { Link as ScrollLink } from 'react-scroll';
import { SparklesCore } from "../../components/ui/sparkles";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetTrigger,
} from "../../components/ui/sheet";
import { useAuth } from "../../context/AuthContext";
import { toast } from "../../hooks/use-toast";

export default function Header({ variant }: { variant: string }) {
    const { scrollYProgress } = useScroll();
    const navigate = useNavigate();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const controls = useAnimationControls();
    const authContext = useAuth();
    const { user }: any = useAuth();
    const userId = user?.userId;

    const handleLogout = () => {
        authContext?.logout();
        navigate("/");
        toast({
          title: "You are logged out",
          duration: 2000,
        })
      };

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

    return (
        <div className="">
            {variant === "landingPage" && <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-white z-50"
                style={{ scaleX }}
            />}
            <div className="w-full fixed inset-0 h-screen">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>
            <motion.header
                className="fixed z-40 top-0 left-0 right-0 px-4 lg:px-6 h-14 flex items-center justify-between border-b border-gray-800 bg-black"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >

                <ScrollLink className="flex items-center justify-center" to="heroSection"
                    smooth={true}
                    duration={800}
                    offset={-80} onClick={() => navigate("/")}>
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                        <MessageCircleMore className="h-6 w-6 text-primary" color="white" />
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
                {variant === "landingPage" && <div>
                    <nav className="flex gap-4 sm:gap-6 max-sm:hidden">
                        {[
                            { label: "Home", to: "heroSection" },
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
                                        <Button variant="outline" className="text-primary border-primary hover:bg-slate-100" onClick={() => { userId ? handleLogout() : navigate("/auth") }}>
                                            {userId ? "Logout" : "Register/Login"}
                                        </Button>
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </nav>
                    <div className="sm:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Menu />
                            </SheetTrigger>
                            <SheetContent className="bg-black border-l-2 border-gray-950">
                                <div className="mt-8 mb-5 flex flex-col gap-5">
                                    <SheetClose asChild>
                                        <ScrollLink to="heroSection">
                                            <div className="flex gap-5">
                                                <House className="h-6 w-6 text-primary" color="white" />
                                                <span className="text-lg text-white font-medium hover:text-slate-200 transition-colors">Home</span>
                                            </div>
                                        </ScrollLink>
                                    </SheetClose>

                                    <SheetClose asChild>
                                        <ScrollLink to="features">
                                            <div className="flex gap-5">
                                                <Telescope className="h-6 w-6 text-primary" color="white" />
                                                <span className="text-lg text-white font-medium hover:text-slate-200 transition-colors">Features</span>
                                            </div>
                                        </ScrollLink>
                                    </SheetClose>

                                    <SheetClose asChild>
                                        <ScrollLink to="testimonials">
                                            <div className="flex gap-5">
                                                <MessageSquareText className="h-6 w-6 text-primary" color="white" />
                                                <span className="text-lg text-white font-medium hover:text-slate-200 transition-colors">Testimonials</span>
                                            </div>
                                        </ScrollLink>
                                    </SheetClose>
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button type="submit" onClick={() => { userId ? navigate("/chat") : navigate("/auth") }}>{userId ? "Logout" : "Register/Login"}</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>}
            </motion.header>
        </div>
    );
}