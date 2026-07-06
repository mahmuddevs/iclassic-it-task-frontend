import { useState, useRef, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../../store/store"
import { useNavigate, Link } from "react-router"
import { setUser } from "../../store/slices/auth-slice"
import { getFetch } from "../../utils/getFetch"
import { toast } from "sonner"
import { HouseIcon, GearIcon, SignOutIcon } from "@phosphor-icons/react"
import ImageLoader from "./image-loader"

export default function Avatar() {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!user) {
    return null
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    `${user.firstName} ${user.lastName}`
  )}&background=6366f1&color=fff&bold=true&size=128&format=png`

  const handleLogout = async () => {
    try {
      setIsOpen(false)
      await getFetch("/auth/logout", {
        method: "POST",
        private: true,
      })
      dispatch(setUser(null))
      toast.success("Logged out successfully")
      navigate("/auth/login")
    } catch (error) {
      toast.error((error as { message?: string })?.message || "Failed to log out")
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-0.5 rounded-full hover:bg-hover transition-colors cursor-pointer select-none border-none bg-transparent shrink-0"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/10 shadow-inner relative shrink-0">
          <ImageLoader
            src={avatarUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="object-cover w-full h-full"
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 min-w-48 w-max bg-background-card border border-border rounded-lg shadow-lg py-1 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Details Header */}
          <div className="px-4 py-2 border-b border-border mb-1 select-none">
            <p className="text-sm font-bold text-foreground">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[11px] text-secondary truncate max-w-48 mt-0.5">
              {user.email}
            </p>
          </div>

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-secondary hover:bg-hover hover:text-primary transition-colors whitespace-nowrap"
          >
            <HouseIcon size={16} className="shrink-0" />
            <span>Go to Site</span>
          </Link>

          <Link
            to="/dashboard/profile-settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-secondary hover:bg-hover hover:text-primary transition-colors whitespace-nowrap"
          >
            <GearIcon size={16} className="shrink-0" />
            <span>Profile Settings</span>
          </Link>

          <div className="h-px bg-border my-1" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors border-none bg-transparent cursor-pointer text-left whitespace-nowrap"
          >
            <SignOutIcon size={16} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}