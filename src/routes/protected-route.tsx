import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../store/store"
import Loading from "../components/common/loading"

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  if (loading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return <Outlet />
}