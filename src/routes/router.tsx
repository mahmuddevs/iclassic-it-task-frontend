import { createBrowserRouter } from "react-router";
import Root from "../layouts/root";
import Home from "../pages/root/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

export default router;