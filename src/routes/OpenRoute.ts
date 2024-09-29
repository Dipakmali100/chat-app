import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OpenRoutes = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated }: any = useAuth(); // Destructure isAuthenticated from the context
    const navigate = useNavigate();

    if (isAuthenticated) {
        navigate("/chat");
        return null;
    }

    return children;
};

export default OpenRoutes;
