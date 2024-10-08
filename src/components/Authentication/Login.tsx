
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useState } from 'react';
import { loginApi } from '../../services/operations/AuthenticationAPI';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();
    const authContext = useAuth();

     if(!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
     }

    const { login } = authContext;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const response: any = await loginApi(username, password);
        if (response.success) {
            login({ userId: response.data.userId, username: username, imgUrl: response.data.imgUrl, token: response.data.token });
            navigate("/chat");
            toast({
                title: response.message,
                duration: 3000,
            })
        } else {
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
                    <div className="space-y-1">
                        <div className="space-y-1">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" placeholder="Enter Username" value={username.toLowerCase()} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type='password' placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className='pt-2'>
                        <Button className={`${!username || !password ? 'cursor-not-allowed brightness-50' : ''}`} onClick={!username || !password ? ()=>{} : handleLogin}>Login Now</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login;
