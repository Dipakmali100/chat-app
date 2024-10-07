import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import Header from '../components/LandingPage/Header';
import { useLocation } from 'react-router-dom';
import Register from '../components/Authentication/Register';
import Login from '../components/Authentication/Login';

function Authentication() {
    const location = useLocation();
    const isLogin = location.state;

    return (
        <div className="bg-black text-white min-h-screen">
            <Header variant="authentication" />
            <div className='min-h-screen min-w-screen flex flex-col items-center justify-center'>
                <Tabs defaultValue={isLogin ? "login" : "register"} className="sm:w-[400px] z-10">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="register">Register</TabsTrigger>
                        <TabsTrigger value="login">Login</TabsTrigger>
                    </TabsList>
                    <TabsContent value="register">
                        <Register />
                    </TabsContent>
                    <TabsContent value="login">
                        <Login />
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    )
}

export default Authentication
