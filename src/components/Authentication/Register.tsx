
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
import { people } from '../../constants/HERO_PEOPLE';
import { useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";
import { registerApi } from "../../services/operations/AuthenticationAPI";
import { useToast } from "../../hooks/use-toast";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPicIndex, setConfirmPicIndex] = useState(0);
    const [carouselSelectedIndex, setCarouselSelectedIndex] = useState(confirmPicIndex);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await registerApi(username, password, people[confirmPicIndex].image);

        if (response.success) {
            toast({
                title: response.message,
                duration: 3000,
            })
        }else{
            toast({
                variant: 'destructive',
                title: response.message,
                duration: 3000,
            })
        }
    }
    return (
        <div>
            <Card>
                <CardContent className="space-y-2 pt-4">

                    <div className='flex flex-col items-center justify-center gap-1'>
                        <Dialog>
                            <DialogTrigger asChild>
                                <img src={people[confirmPicIndex].image} alt="Default Profile" className='w-16 rounded-full cursor-pointer hover:brightness-75' onClick={() => setCarouselSelectedIndex(confirmPicIndex)} />
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
                                    <Button type="submit" onClick={() => setConfirmPicIndex(carouselSelectedIndex)}>Save changes</Button>
                                </DialogClose>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="username">Set Username</Label>
                        <Input type='text' placeholder="Enter Username" onChange={(e) => setUsername((e.target as HTMLInputElement).value)}/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Set Password</Label>
                        <Input type='password' placeholder="Enter Password" onChange={(e) => setPassword((e.target as HTMLInputElement).value)}/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Confirm Password</Label>
                        <Input type='password' placeholder="Enter Password" onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}/>
                    </div>
                    <div className='pt-2'>
                        <Button className={`${username && password && confirmPassword && password===confirmPassword ? "" : "brightness-50 cursor-not-allowed"}`} onClick={username && password && confirmPassword && password===confirmPassword ? handleSubmit : () => {}}>Register Now</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Register
