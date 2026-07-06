import { createBrowserRouter, Navigate } from "react-router";
import Home from "../pages/root/home";
import RootLayout from "../layouts/root";
import AuthLayout from "../layouts/auth";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import AppInitializer from "../components/common/app-initializer";
import ProtectedRoute from "../routes/protected-route";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppInitializer />,
    children: [
      {
        path: "",
        element: <ProtectedRoute />,
        children: [
          {
            path: "",
            element: <RootLayout />,
            children: [
              {
                index: true,
                element: <Home />,
              },
            ],
          },
        ],
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="login" replace />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },
    ],
  },
]);

export default router;