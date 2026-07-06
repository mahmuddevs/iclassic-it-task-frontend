import { SunIcon, MoonIcon, ListIcon } from "@phosphor-icons/react"
import { useAppDispatch, useAppSelector } from "../../store/store"
import { toggleTheme, selectActiveTheme } from "../../store/slices/theme-slice"
import Avatar from "../common/avatar"

interface HeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onToggleMobile: () => void;
}

export default function Header({ onToggleCollapse, onToggleMobile }: HeaderProps) {
  const dispatch = useAppDispatch()
  const activeTheme = useAppSelector(selectActiveTheme)

  return (
    <header className="h-16 bg-background-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40 shrink-0 select-none">
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar Button for Mobile */}
        <button
          onClick={onToggleMobile}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-secondary hover:text-foreground md:hidden cursor-pointer border-none bg-transparent"
        >
          <ListIcon size={22} />
        </button>

        {/* Toggle Sidebar Button for Desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-secondary hover:text-foreground cursor-pointer border-none bg-transparent"
        >
          <ListIcon size={22} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-secondary hover:text-foreground cursor-pointer border-none bg-transparent"
          title={`Switch to ${activeTheme === "dark" ? "light" : "dark"} theme`}
        >
          {activeTheme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>

        <div className="h-6 w-px bg-border" />
        <Avatar />
      </div>
    </header>
  )
}