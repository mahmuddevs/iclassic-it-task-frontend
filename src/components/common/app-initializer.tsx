import { useEffect } from 'react'
import { useNavigate, Outlet, useMatches } from 'react-router'
import { setNavigate } from '../../utils/navigation'
import { useAppDispatch } from '../../store/store'
import { checkAuth } from '../../store/slices/auth-slice'
import { initTheme } from '../../store/slices/theme-slice'

export default function AppInitializer({
  children,
}: {
  children?: React.ReactNode
}) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const matches = useMatches()

  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])

  useEffect(() => {
    dispatch(checkAuth())
    dispatch(initTheme())
  }, [dispatch])

  useEffect(() => {
    const matchWithTitle = [...matches]
      .reverse()
      .find((m) => {
        const handle = m.handle as { title?: string } | undefined
        return handle && typeof handle.title === "string"
      })

    if (matchWithTitle) {
      const handle = matchWithTitle.handle as { title: string }
      document.title = `${handle.title} | Inventory & Sales Management System`
    } else {
      document.title = "Inventory & Sales Management System"
    }
  }, [matches])

  return <>{children || <Outlet />}</>
}