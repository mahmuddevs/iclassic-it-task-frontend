import { Link, useLocation } from "react-router"
import { HouseIcon, PackageIcon, ReceiptIcon, UsersIcon, GearIcon, ChartBarIcon, XIcon, PlusCircleIcon, ShoppingCartIcon } from "@phosphor-icons/react"
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
  { name: "Customers", path: "/customers", icon: UsersIcon, permission: "users.read" },
  { name: "Reports", path: "/reports", icon: ChartBarIcon, permission: "reports.read" },
  { name: "Settings", path: "/dashboard/profile-settings", icon: GearIcon, permission: null },
]

export default function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }: SidebarProps) {
  const location = useLocation()
  const user = useAppSelector((state) => state.auth.user)

  const userPermissionNames = user?.permissions?.map((p) => p.name) ?? []

  const menuItems = ALL_MENU_ITEMS.filter((item) => {
    // Items with no required permission are always visible (Dashboard, Settings)
    if (!item.permission) return true
    return userPermissionNames.includes(item.permission)
  })

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
      </nav>
    </aside>
  )
}