import { useLocation } from "react-router"

export default function PageHeading() {
  const location = useLocation()

  const getPageTitle = (pathname: string) => {
    if (pathname === "/") return "Dashboard"
    const segments = pathname.split("/").filter(Boolean)
    const lastSegment = segments[segments.length - 1] || ""
    return lastSegment
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <h1 className="text-xl md:text-2xl font-bold text-foreground mb-6 select-none tracking-tight">
      {getPageTitle(location.pathname)}
    </h1>
  )
}