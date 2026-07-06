import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router'
import { setNavigate } from '../../utils/navigation'
import { useAppDispatch } from '../../store/store'
import { checkAuth } from '../../store/slices/auth-slice'

export default function AppInitializer({
  children,
}: {
  children?: React.ReactNode
}) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return <>{children || <Outlet />}</>
}