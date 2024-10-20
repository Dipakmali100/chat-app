import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { motion } from "framer-motion";
import { ImagePlus, MessageCircleMore } from "lucide-react";
import { LogOut } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Button } from "../ui/button";
import { people } from "../../constants/HERO_PEOPLE";
import { useState } from "react";
import { changeAvatar } from "../../services/operations/AuthenticationAPI";



function Header() {
    const { user }: any = useAuth();
    const authContext = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [carouselSelectedIndex, setCarouselSelectedIndex] = useState(-1);

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
        const newAvatar = people[carouselSelectedIndex].image;
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
                        <img src={user?.imgUrl} alt="Profile" className="h-10 w-10 rounded-full hover:brightness-50 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-auto">
                        <div className="flex justify-center font-bold text-lg font-username pt-1">{user?.username}</div>
                        <DropdownMenuSeparator />

                        <DialogTrigger asChild onClick={() => setCarouselSelectedIndex(-1)}>
                            <DropdownMenuItem className="cursor-pointer">
                                <ImagePlus />
                                <span>Change avatar</span>
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuItem className="cursor-pointer">
                            <LogOut />
                            <span onClick={handleLogout}>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                                {people.map((value, index) => (
                                    <CarouselItem key={index} className="basis-1/3">
                                        <div className='flex flex-col items-center justify-center gap-1'>
                                            <img src={value.image} alt="" className={`w-16 rounded-full cursor-pointer hover:brightness-75 ${carouselSelectedIndex === index ? 'border-4 border-black' : ''}`} onClick={() => setCarouselSelectedIndex(index)} />
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
            </Dialog>
        </div>
    )
}

export default Header;
