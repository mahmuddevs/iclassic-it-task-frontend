import { useState, useEffect } from "react"
import { useGetQuery } from "../../hooks/useGetQuery"
import { useQueryMutation } from "../../hooks/useQueryMutation"
import { useAppSelector } from "../../store/store"
import PageHeading from "../../components/root/page-heading"
import Button from "../../components/common/button"
import { toast } from "sonner"
import { ShieldCheckIcon, InfoIcon } from "@phosphor-icons/react"
import TableSkeleton from "../../components/common/table-skeleton"

interface PermissionItem {
  _id: string;
  name: string;
  module: string;
  description?: string;
}

interface RoleDoc {
  _id: string;
  name: string;
  description: string;
  permissions: PermissionItem[];
}

interface VirtualOption {
  key: string;
  label: string;
  permNames: string[];
}

const getVirtualOptionsForModule = (module: string): VirtualOption[] => {
  switch (module) {
    case "products":
      return [
        { key: "read_create", label: "Read & Create", permNames: ["products.read", "products.create"] },
        { key: "update", label: "Update", permNames: ["products.update"] },
        { key: "delete", label: "Delete", permNames: ["products.delete"] },
      ]
    case "sales":
      return [
        { key: "read", label: "Read", permNames: ["sales.read"] },
        { key: "create", label: "Create", permNames: ["sales.create"] },
        { key: "delete", label: "Delete", permNames: ["sales.delete"] },
      ]
    case "users":
      return [
        { key: "read", label: "Read", permNames: ["users.read"] },
        { key: "update", label: "Update", permNames: ["users.update"] },
        { key: "delete", label: "Delete", permNames: ["users.delete"] },
      ]
    default:
      return []
  }
}

export default function ManagePermissions() {
  const user = useAppSelector((state) => state.auth.user)
  const userPermissionNames = user?.permissions?.map((p) => p.name) ?? []
  const canUpdate = userPermissionNames.includes("permissions.update")

  const [selectedRole, setSelectedRole] = useState<"Manager" | "Employee">("Manager")
  const [selectedPerms, setSelectedPerms] = useState<string[]>([])

  // 1. Fetch all roles
  const { data: roles, isLoading: isLoadingRoles, refetch: refetchRoles } = useGetQuery<RoleDoc[]>({
    url: "/roles",
    isPrivate: true,
    keys: ["roles-list"],
  })

  // Set initial permission selection when active role or roles data changes
  useEffect(() => {
    const syncActiveRolePermissions = () => {
      if (roles) {
        const activeRoleData = roles.find((r) => r.name === selectedRole)
        if (activeRoleData) {
          setSelectedPerms(activeRoleData.permissions.map((p) => p.name))
        }
      }
    }
    syncActiveRolePermissions()
  }, [roles, selectedRole])

  // Mutation to update permissions
  const { mutate: savePermissions, isPending: isSaving } = useQueryMutation<
    { message?: string },
    Error,
    { roleName: string; permissionNames: string[] }
  >({
    url: ({ roleName }) => `/roles/${roleName}/permissions`,
    method: "PATCH",
    isPrivate: true,
    mutationOptions: {
      onSuccess: (resData) => {
        toast.success(resData?.message || "Permissions updated successfully.")
        refetchRoles()
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update permissions.")
      },
    },
  })

  const handleVirtualCheckboxChange = (option: VirtualOption, checked: boolean) => {
    if (checked) {
      setSelectedPerms((prev) => {
        const toAdd = option.permNames.filter((name) => !prev.includes(name))
        return [...prev, ...toAdd]
      })
    } else {
      setSelectedPerms((prev) => prev.filter((p) => !option.permNames.includes(p)))
    }
  }

  const isOptionChecked = (option: VirtualOption) => {
    return option.permNames.every((name) => selectedPerms.includes(name))
  }

  const handleSave = () => {
    if (!canUpdate) {
      toast.error("Not authorized. You do not have permission to update role permissions.")
      return
    }
    savePermissions({ roleName: selectedRole, permissionNames: selectedPerms })
  }

  const isLoading = isLoadingRoles

  // Determine which modules are displayed for each role
  const enabledModules = selectedRole === "Manager"
    ? ["products", "sales", "users"]
    : ["products", "sales"]

  const moduleDisplayNames: Record<string, string> = {
    products: "Products Catalog Management",
    sales: "Sales Billing & Transactions",
    users: "User Profile Directory",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <PageHeading />
      </div>

      {!canUpdate && (
        <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-700 dark:text-amber-400">
          <InfoIcon size={20} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-sm font-bold">Read-Only Mode</span>
            <p className="text-xs opacity-90 leading-relaxed">
              You are not authorized to update permissions. Changes are locked.
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left Column - Role Selectors */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-wider pl-1">Security Roles</h3>
            <button
              onClick={() => setSelectedRole("Manager")}
              className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer select-none bg-background-card ${selectedRole === "Manager"
                ? "border-primary shadow-sm ring-1 ring-primary"
                : "border-border hover:border-slate-300 dark:hover:border-slate-700"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedRole === "Manager" ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-900/50 text-secondary"}`}>
                  <ShieldCheckIcon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Manager Role</h4>
                  <p className="text-xs text-secondary mt-0.5">Control product, sale, and user profiles</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole("Employee")}
              className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer select-none bg-background-card ${selectedRole === "Employee"
                ? "border-primary shadow-sm ring-1 ring-primary"
                : "border-border hover:border-slate-300 dark:hover:border-slate-700"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedRole === "Employee" ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-900/50 text-secondary"}`}>
                  <ShieldCheckIcon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Employee Role</h4>
                  <p className="text-xs text-secondary mt-0.5">Access general product specs & sales billing</p>
                </div>
              </div>
            </button>
          </div>

          {/* Right Column - Module Permission Cards */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">
                Module Access Rights ({selectedRole})
              </h3>
              {canUpdate && (
                <Button onClick={handleSave} disabled={isSaving} className="border-primary!">
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {enabledModules.map((module) => {
                const options = getVirtualOptionsForModule(module)
                return (
                  <div key={module} className="bg-background-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
                    <div>
                      <h4 className="font-bold text-foreground capitalize text-sm">{module} Permissions</h4>
                      <p className="text-xs text-secondary mt-0.5">{moduleDisplayNames[module]}</p>
                    </div>

                    <hr className="border-border/60" />

                    <div className="grid grid-cols-2 xs:grid-cols-4 gap-4">
                      {options.map((opt) => {
                        const isChecked = isOptionChecked(opt)
                        return (
                          <label
                            key={opt.key}
                            className={`flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer select-none transition-colors hover:bg-hover ${!canUpdate ? "opacity-75 cursor-not-allowed" : ""
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={!canUpdate || isSaving}
                              onChange={(e) => handleVirtualCheckboxChange(opt, e.target.checked)}
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer disabled:cursor-not-allowed"
                            />
                            <span className="text-xs font-semibold text-foreground">
                              {opt.label}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
