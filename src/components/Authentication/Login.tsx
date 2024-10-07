
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

function Login() {
    return (
        <div>
            <Card>
                <CardContent className="space-y-2 pt-4">
                    <div className="space-y-1">
                        <div className="space-y-1">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" placeholder="Enter Username" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type='password' placeholder="Enter Password" />
                    </div>
                    <div className='pt-2'>
                        <Button>Login Now</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login;
