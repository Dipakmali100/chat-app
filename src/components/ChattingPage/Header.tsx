import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { motion } from "framer-motion";
import { BadgeCheck, ImagePlus, MessageCircleMore } from "lucide-react";
import { LogOut } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Button } from "../ui/button";
import { profileImages } from "../../constants/PROFILE_IMAGES";
import { useState } from "react";
import { changeAvatar } from "../../services/operations/AuthenticationAPI";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import VerifiedTick from "../../assets/VerifiedTick.png";
import { Label } from "../ui/label";
import razorpayPaymentHandler from "../../utils/razorpayPaymentHandler";

function Header() {
    const { user }: any = useAuth();
    const authContext = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [carouselSelectedIndex, setCarouselSelectedIndex] = useState(-1);
    const [dialogType, setDialogType] = useState("changeAvatar");

    const handleLogout = () => {
        authContext?.logout();
        navigate("/auth", { state: { isLogin: true } });
        toast({
            title: "You are logged out"
        })
    };

    const handleChangeAvatar = async () => {
        if (carouselSelectedIndex === -1) {
            return;
        }
        const newAvatar = profileImages[carouselSelectedIndex];
        const response: any = await changeAvatar(newAvatar);
        if (response.success) {
            user.imgUrl = newAvatar;
            toast({
                title: response.message
            })
        } else {
            toast({
                variant: 'destructive',
                title: response.message
            })
        }
    }

    const handlePayment = async () => {
        await razorpayPaymentHandler(user);
    }

    return (
        <div className="flex justify-between px-1 pb-3">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                    <MessageCircleMore className="h-6 w-6 text-primary" color="white" />
                </motion.div>
                <div
                    className="ml-2 text-2xl font-bold"
                >
                    ChatNow
                </div>
            </div>
            <Dialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-10 w-10 hover:brightness-50 bg-gray-200 cursor-pointer">
                            <AvatarImage src={user?.imgUrl} />
                            <AvatarFallback>{user?.username[0]}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-auto bg-black border-gray-700">
                        <div className="flex justify-center gap-1 font-bold text-lg font-username py-1 text-white border-b-2 border-gray-700">
                            {user?.username}
                            {user?.verified && (
                                <img src={VerifiedTick} alt="Verified" className='w-5 h-5 mt-[2px]' />
                            )}
                        </div>
                        {/* <DropdownMenuSeparator className="text-black"/> */}

                        <DialogTrigger asChild onClick={() => { setCarouselSelectedIndex(-1); setDialogType("changeAvatar") }}>
                            <DropdownMenuItem className="cursor-pointer text-white mt-1">
                                <ImagePlus />
                                <span>Change avatar</span>
                            </DropdownMenuItem>
                        </DialogTrigger>
                        {!user?.verified && (
                            <DialogTrigger asChild onClick={() => { setDialogType("getVerified") }}>
                                <DropdownMenuItem className="cursor-pointer text-white" >
                                    <BadgeCheck />
                                    <span>Get verified</span>
                                </DropdownMenuItem>
                            </DialogTrigger>
                        )}
                        <DropdownMenuItem className="cursor-pointer text-white" onClick={handleLogout}>
                            <LogOut />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {dialogType === "changeAvatar" ? (
                    <DialogContent className="w-11/12 rounded-sm sm:max-w-[500px]">
                        <div className='flex flex-col items-center gap-1'>
                            <div>
                                <DialogTitle>Change Profile</DialogTitle>
                            </div>
                            <div>
                                <DialogDescription>
                                    Select a profile picture
                                </DialogDescription>
                            </div>
                        </div>
                        <div className='flex flex-col items-center justify-center'>
                            <Carousel
                                opts={{
                                    align: "start",
                                }}
                                className="w-56 sm:w-full max-w-sm"
                            >
                                <CarouselContent>
                                    {profileImages.map((value, index) => (
                                        <CarouselItem key={index} className="basis-1/3">
                                            <div className='flex flex-col items-center justify-center gap-1'>
                                                <img src={value} alt="" className={`w-16 bg-gray-200 rounded-full cursor-pointer hover:brightness-75 ${carouselSelectedIndex === index ? 'border-4 border-black' : ''}`} onClick={() => setCarouselSelectedIndex(index)} />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                        <DialogClose>
                            <Button type="submit" className={`${carouselSelectedIndex === -1 ? 'brightness-50 cursor-not-allowed' : ''}`} onClick={handleChangeAvatar}>Save changes</Button>
                        </DialogClose>
                    </DialogContent>
                ) : (
                    <DialogContent className="w-11/12 rounded-sm sm:max-w-[500px]">
                        <div className='flex flex-col items-center gap-1'>
                            <div>
                                <Label className="text-lg">Get Verified</Label>
                            </div>
                            <div>
                                <DialogDescription className="font-semibold">
                                    Pay &#8377;10 and get verified for lifetime
                                </DialogDescription>
                                <div className="flex justify-center gap-1 pt-3 mr-1">
                                    <Avatar className="h-10 w-10 hover:brightness-50 bg-gray-200 cursor-pointer">
                                        <AvatarImage src={user?.imgUrl} />
                                        <AvatarFallback>{user?.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-lg font-semibold mt-2 ml-1 font-username">{user?.username}</p>
                                    </div>
                                    <div className="mt-2">
                                        <img src={VerifiedTick} alt="Verified" className='w-4 h-4 mt-1' />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogClose>
                            <Button type="submit" className="w-full" onClick={() => {handlePayment()}}>Pay &#8377;10</Button>
                        </DialogClose>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    )
}

export default Header;
