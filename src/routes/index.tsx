import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import ChattingPage from "../pages/ChattingPage";
import PrivateRoute from "./PrivateRoute";
import OpenRoutes from "./OpenRoute";
import Authentication from "../pages/Authentication";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/auth",
        element: (
            <OpenRoutes>
                <Authentication />
            </OpenRoutes>
        )
    },
    {
        path: "/chat",
        element: (
            <PrivateRoute>
                <ChattingPage />
            </PrivateRoute>
        )
    }
]);
