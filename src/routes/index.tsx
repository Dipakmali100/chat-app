import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import ChattingPage from "../pages/ChattingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import OpenRoutes from "./OpenRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/register",
        element: (
            // <OpenRoutes>
                <Register />
            // </OpenRoutes>
        )
    },
    {
        path: "/login",
        element: (
            // <OpenRoutes>
                <Login />
            // </OpenRoutes>
        )
    },
    {
        path: "/chat",
        element: (
            // <PrivateRoute>
                <ChattingPage />
            // </PrivateRoute>
        )
    }
]);
