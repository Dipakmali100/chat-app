import { useAuth } from "../context/AuthContext";


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAuth();

    if (!isAuthenticated) {
        return null;
    }

    return children;
}

export default PrivateRoute;