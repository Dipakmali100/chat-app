
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { profileImages } from "../../constants/PROFILE_IMAGES";
import { useEffect, useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";
import { loginApi, registerApi, uniqueUsernameCheck } from "../../services/operations/AuthenticationAPI";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import Loader from "../../assets/Loader.svg";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPicIndex, setConfirmPicIndex] = useState(0);
    const [carouselSelectedIndex, setCarouselSelectedIndex] = useState(confirmPicIndex);
    const [loading, setLoading] = useState(true);
    const [isUniqueUsername, setIsUniqueUsername] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const debouncingSearchValue = useDebouncedValue(username, 500);
    const { toast } = useToast();
    const navigate = useNavigate();
    const authContext = useAuth(); // Get the context

    // Ensure authContext is defined
    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { login } = authContext;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        const response = await registerApi(username, password, profileImages[confirmPicIndex]);
        if (response.success) {
            const response: any = await loginApi(username, password);
            if (response.success) {
                login({ userId: response.data.userId, username: username, imgUrl: response.data.imgUrl, token: response.data.token, verified: response.data.verified });
                navigate("/chat");
                toast({
                    title: response.message,
                    duration: 1000,
                })
            } else {
                toast({
                    variant: 'destructive',
                    title: response.message,
                    duration: 2000,
                })
            }
        } else {
            toast({
                variant: 'destructive',
                title: response.message,
                duration: 2000,
            })
        }
        setSubmitLoading(false);
    }

    useEffect(() => {
        if (!debouncingSearchValue) {
            return;
        }

        const fetchData = async () => {
            const response = await uniqueUsernameCheck(debouncingSearchValue);
            console.log("debouncingSearchValue: ", debouncingSearchValue);
            setIsUniqueUsername(response.success);
            setLoading(false);
        };

        fetchData();
    }, [debouncingSearchValue]);

    useEffect(() => {
        setLoading(true);
    }, [username]);
    return (
        <div>
            <Card>
                <CardContent className="space-y-2 pt-4">

                    <div className='flex flex-col items-center justify-center gap-1'>
                        <Dialog>
                            <DialogTrigger asChild>
                                <img src={profileImages[confirmPicIndex]} alt="Default Profile" className='w-16 rounded-full bg-gray-200 cursor-pointer hover:brightness-75' onClick={() => setCarouselSelectedIndex(confirmPicIndex)} />
                            </DialogTrigger>
                            <DialogTrigger asChild>
                                <Label htmlFor="text" className="cursor-pointer" onClick={() => setCarouselSelectedIndex(confirmPicIndex)}>Change Profile</Label>
                            </DialogTrigger>
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
                                                        <img src={value} alt="" className={`w-16 rounded-full bg-gray-200 cursor-pointer hover:brightness-75 ${carouselSelectedIndex === index ? 'border-4 border-black' : ''}`} onClick={() => setCarouselSelectedIndex(index)} />
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </Carousel>
                                </div>
                                <DialogClose>
                                    <Button type="submit" onClick={() => setConfirmPicIndex(carouselSelectedIndex)}>Save changes</Button>
                                </DialogClose>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="username">Set Username</Label>
                        <Input type='text' placeholder="Enter Username" value={username} onChange={(e) => setUsername((e.target as HTMLInputElement).value.toLowerCase().trim().slice(0, 24))} />
                        {username && (
                            loading ? (
                                <div className='flex'>
                                    <img src={Loader} alt="loader" className="h-4 w-4 pt-1" />
                                    <p className="font-semibold text-sm">Checking availability...</p>
                                </div>
                            ) : (
                                !isUniqueUsername ? (
                                    <div className='text-red-500 font-semibold text-sm flex gap-1'><p>&#10008;</p><p>Username already taken</p></div>
                                ) : (
                                    <div className='text-green-500 font-semibold text-sm flex gap-1'><p>&#10003;</p><p>Username is available</p></div>
                                )
                            )
                        )}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Set Password</Label>
                        <Input type='password' placeholder="Enter Password" value={password} onChange={(e) => setPassword((e.target as HTMLInputElement).value.trim())} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Confirm Password</Label>
                        <Input type='password' placeholder="Enter Password" value={confirmPassword} onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value.trim())} 
                        onKeyDown={(e) => e.key === 'Enter' && isUniqueUsername && username && password && confirmPassword && password === confirmPassword && handleSubmit(e)}/>
                    </div>
                    <div className='pt-2'>
                        <Button className={`${!submitLoading && isUniqueUsername && username && password && confirmPassword && password === confirmPassword ? "" : "brightness-50 cursor-not-allowed"}`} onClick={!submitLoading &&isUniqueUsername && username && password && confirmPassword && password === confirmPassword ? handleSubmit : () => { }}>Register Now</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Register
