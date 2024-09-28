import { useAuth } from "../context/AuthContext";

const OpenRoutes = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAuth(); // Destructure isAuthenticated from the context

    if (isAuthenticated) {
        return null;
    }

    return children;
};

export default OpenRoutes;
