import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../store/store"
import Loading from "../components/common/loading"

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  if (loading) {
    return <Loading />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
