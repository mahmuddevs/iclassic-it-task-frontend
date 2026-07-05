import { Outlet } from "react-router";
import Header from "../components/root/header";

export default function Root() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}