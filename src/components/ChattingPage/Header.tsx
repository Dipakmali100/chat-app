import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";

function Header() {
    const { user }: any = useAuth();
    const authContext = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleOnClick = () => {
        authContext?.logout();
        navigate("/auth", { state: { isLogin: true } });
        toast({
            title: "You are logged out"
        })
    };

    return (
        <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">ChatNow</h1>
            <div>
                <h1 className="text-sm font-bold">Username: {user?.username}</h1>
                <h1 className="text-sm font-bold">UserId: {user?.userId}</h1>
            </div>
            <h1 className="cursor-pointer text-2xl font-bold mb-4" onClick={handleOnClick}>Logout</h1>
        </div>
    )
}

export default Header
