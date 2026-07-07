import { createBrowserRouter, Navigate } from "react-router";
import Home from "../pages/root/home";
import Products from "../pages/root/products";
import RootLayout from "../layouts/root";
import AuthLayout from "../layouts/auth";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import AppInitializer from "../components/common/app-initializer";
import ProtectedRoute from "../routes/protected-route";
import CreateSale from "../pages/root/create-sale";
import AllSales from "../pages/root/all-sales";
import NotFound from "../pages/not-found";
import ManageUsers from "../pages/root/manage-users";
import ManagePermissions from "../pages/root/manage-permissions";

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
              {
                path: "products",
                element: <Products />,
              },
              {
                path: "create-sale",
                element: <CreateSale />,
              },
              {
                path: "all-sales",
                element: <AllSales />,
              },
              {
                path: "settings",
                element: <Navigate to="manage-users" replace />,
              },
              {
                path: "settings/manage-users",
                element: <ManageUsers />,
              },
              {
                path: "settings/manage-permissions",
                element: <ManagePermissions />,
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
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;