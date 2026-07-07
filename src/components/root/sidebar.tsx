import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router"
import { HouseIcon, PackageIcon, ReceiptIcon, GearIcon, ChartBarIcon, XIcon, PlusCircleIcon, ShoppingCartIcon, CaretDownIcon, UsersIcon, KeyIcon } from "@phosphor-icons/react"
import { useAppSelector } from "../../store/store"

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const ALL_MENU_ITEMS = [
  { name: "Dashboard", path: "/", icon: HouseIcon, permission: null },
  { name: "Products", path: "/products", icon: PackageIcon, permission: "products.read" },
  { name: "Create Sale", path: "/create-sale", icon: PlusCircleIcon, permission: "sales.create" },
  { name: "All Sales", path: "/all-sales", icon: ShoppingCartIcon, permission: "sales.read" },
  { name: "Orders", path: "/orders", icon: ReceiptIcon, permission: "orders.read" },
  { name: "Reports", path: "/reports", icon: ChartBarIcon, permission: "reports.read" },
]

export default function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }: SidebarProps) {
  const location = useLocation()
  const user = useAppSelector((state) => state.auth.user)
  const [isSettingsOpen, setIsSettingsOpen] = useState(location.pathname.startsWith("/settings"))

  const userPermissionNames = user?.permissions?.map((p) => p.name) ?? []

  const menuItems = ALL_MENU_ITEMS.filter((item) => {
    if (!item.permission) return true
    return userPermissionNames.includes(item.permission)
  })

  useEffect(() => {
    const syncSettingsMenuState = () => {
      if (location.pathname.startsWith("/settings")) {
        setIsSettingsOpen(true)
      }
    }
    syncSettingsMenuState()
  }, [location.pathname])

  const isSidebarExpanded = !isCollapsed || isMobileOpen

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-dvh flex flex-col bg-background-card border-r border-border transition-all duration-300 w-64
    ${isCollapsed ? "md:w-20" : "md:w-64"}
    ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
  `

  return (
    <aside className={sidebarClasses}>
      {/* Brand Header */}
      <div className={`h-16 flex items-center border-b border-border shrink-0 select-none ${
        isSidebarExpanded ? "justify-between px-6" : "justify-center px-0"
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shrink-0 shadow-sm shadow-primary/30">
            I
          </div>
          {isSidebarExpanded && (
            <span className="font-bold text-base text-foreground tracking-tight whitespace-nowrap">
              I&S
            </span>
          )}
        </div>
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="p-2 -mr-2 rounded-lg hover:bg-hover text-secondary hover:text-foreground md:hidden cursor-pointer border-none bg-transparent"
          >
            <XIcon size={22} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onCloseMobile}
              className={`flex items-center rounded-xl transition-all select-none py-3 ${
                isSidebarExpanded
                  ? "gap-3 px-3.5 justify-start"
                  : "justify-center px-0"
              } ${isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-secondary hover:text-foreground hover:bg-hover"
              }`}
            >
              <Icon size={22} className="shrink-0" />
              {isSidebarExpanded && (
                <span className="text-sm tracking-wide whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          )
        })}

        {/* Settings Accordion Group */}
        {(userPermissionNames.includes("users.read") || userPermissionNames.includes("permissions.read")) && (
          <div>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center w-full rounded-xl transition-all select-none py-3 cursor-pointer border-none bg-transparent ${
                isSidebarExpanded
                  ? "gap-3 px-3.5 justify-between"
                  : "justify-center px-0"
              } ${
                location.pathname.startsWith("/settings")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-secondary hover:text-foreground hover:bg-hover"
              }`}
            >
              <div className="flex items-center gap-3">
                <GearIcon size={22} className="shrink-0" />
                {isSidebarExpanded && (
                  <span className="text-sm tracking-wide whitespace-nowrap">
                    Settings
                  </span>
                )}
              </div>
              {isSidebarExpanded && (
                <CaretDownIcon
                  size={14}
                  className={`transition-transform duration-300 shrink-0 ${isSettingsOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {/* Collapsible Submenu Accordion */}
            <div
              className="transition-all duration-300 ease-in-out overflow-hidden space-y-1"
              style={{
                maxHeight: isSettingsOpen && isSidebarExpanded ? "100px" : "0px",
                opacity: isSettingsOpen && isSidebarExpanded ? 1 : 0,
                paddingLeft: isSidebarExpanded ? "2.5rem" : "0",
                marginTop: isSettingsOpen && isSidebarExpanded ? "0.25rem" : "0",
              }}
            >
              {userPermissionNames.includes("users.read") && (
                <Link
                  to="/settings/manage-users"
                  onClick={onCloseMobile}
                  className={`flex items-center gap-2.5 rounded-lg py-2 px-3 text-xs font-semibold transition-all select-none ${
                    location.pathname === "/settings/manage-users"
                      ? "bg-primary/20 text-primary"
                      : "text-secondary hover:text-foreground hover:bg-hover"
                  }`}
                >
                  <UsersIcon size={16} className="shrink-0" />
                  <span>Manage Users</span>
                </Link>
              )}
              {userPermissionNames.includes("permissions.read") && (
                <Link
                  to="/settings/manage-permissions"
                  onClick={onCloseMobile}
                  className={`flex items-center gap-2.5 rounded-lg py-2 px-3 text-xs font-semibold transition-all select-none ${
                    location.pathname === "/settings/manage-permissions"
                      ? "bg-primary/20 text-primary"
                      : "text-secondary hover:text-foreground hover:bg-hover"
                  }`}
                >
                  <KeyIcon size={16} className="shrink-0" />
                  <span>Manage Permissions</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </aside>
  )
}