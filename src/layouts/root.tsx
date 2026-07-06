import { Outlet } from "react-router";
import Header from "../components/root/header";

export default function RootLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}