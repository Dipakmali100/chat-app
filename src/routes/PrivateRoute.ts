import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const {isAuthenticated}: any = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        navigate("/login");
        return null;
    }

    return children;
}

export default PrivateRoute;