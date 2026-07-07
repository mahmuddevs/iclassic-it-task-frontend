import { useState, useEffect, useRef } from "react"
import { useQueryState, parseAsInteger } from "nuqs"
import { useGetQuery } from "../../hooks/useGetQuery"
import { useQueryMutation } from "../../hooks/useQueryMutation"
import { useAppSelector } from "../../store/store"
import Table from "../../components/common/table"
import Pagination from "../../components/common/pagination"
import NoData from "../../components/common/no-data"
import Modal from "../../components/common/modal"
import Button from "../../components/common/button"
import Select from "../../components/common/select"
import { TrashIcon, PencilSimpleIcon, Warning } from "@phosphor-icons/react"
import PageHeading from "../../components/root/page-heading"
import Search from "../../components/common/search"
import TableSkeleton from "../../components/common/table-skeleton"
import { toast } from "sonner"

interface UserDoc {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface GetUsersResponse {
  users: UserDoc[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ManageUsers() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [search] = useQueryState("search")

  const user = useAppSelector((state) => state.auth.user)
  const userPermissionNames = user?.permissions?.map((p) => p.name) ?? []
  const canUpdateUsers = userPermissionNames.includes("users.update")
  const canDeleteUsers = userPermissionNames.includes("users.delete")

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [userToUpdateRole, setUserToUpdateRole] = useState<UserDoc | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>("Employee")

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserDoc | null>(null)

  const prevSearchRef = useRef(search)

  // Reset page to 1 if search query changes
  useEffect(() => {
    if (prevSearchRef.current !== search) {
      prevSearchRef.current = search
      if (page !== 1) {
        setPage(1)
      }
    }
  }, [search, page, setPage])

  const { data, isLoading, refetch } = useGetQuery<GetUsersResponse>({
    url: "/users",
    isPrivate: true,
    queryParams: {
      page,
      limit: 8,
      search: search || undefined,
    },
    keys: [page, search],
  })

  // Role Update Mutation
  const { mutate: performUpdateRole, isPending: isUpdatingRole } = useQueryMutation<
    { message?: string; data?: UserDoc },
    Error,
    { id: string; role: string }
  >({
    url: ({ id }) => `/users/${id}/role`,
    method: "PATCH",
    isPrivate: true,
    mutationOptions: {
      onSuccess: (resData) => {
        toast.success(resData?.message || "User role updated successfully.")
        refetch()
        setIsRoleModalOpen(false)
        setUserToUpdateRole(null)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update user role.")
      },
    },
  })

  // Delete User Mutation
  const { mutate: performDeleteUser, isPending: isDeleting } = useQueryMutation<
    { message?: string },
    Error,
    string
  >({
    url: (id) => `/users/${id}`,
    method: "DELETE",
    isPrivate: true,
    mutationOptions: {
      onSuccess: (resData) => {
        toast.success(resData?.message || "User deleted successfully.")
        refetch()
        setIsDeleteModalOpen(false)
        setUserToDelete(null)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete user.")
      },
    },
  })

  const usersList = data?.users || []
  const meta = data?.meta

  const getRoleBadgeClasses = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
      case "Manager":
        return "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400"
      default:
        return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <PageHeading />
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <Search placeholder="Search users by name or email..." />
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : usersList.length === 0 ? (
        <NoData
          title="No Users Found"
          subtitle="It looks like there are no user accounts matching your query."
        />
      ) : (
        <>
          {/* Users Table */}
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>User Name</Table.HeaderCell>
                <Table.HeaderCell>Email Address</Table.HeaderCell>
                <Table.HeaderCell>System Role</Table.HeaderCell>
                <Table.HeaderCell>Created Date</Table.HeaderCell>
                <Table.HeaderCell className="text-center">Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {usersList.map((usr) => (
                <Table.Row key={usr._id}>
                  <Table.Cell className="font-semibold text-foreground">
                    {usr.firstName} {usr.lastName}
                  </Table.Cell>
                  <Table.Cell className="text-secondary font-medium">
                    {usr.email}
                  </Table.Cell>
                  <Table.Cell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getRoleBadgeClasses(usr.role)}`}>
                      {usr.role}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-secondary font-medium">
                    {new Date(usr.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!canUpdateUsers) {
                            toast.error("Not authorized. You do not have permission to update user roles.")
                            return
                          }
                          setUserToUpdateRole(usr)
                          setSelectedRole(usr.role)
                          setIsRoleModalOpen(true)
                        }}
                        className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-hover transition-colors cursor-pointer border-none bg-transparent"
                        title="Edit role"
                      >
                        <PencilSimpleIcon size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!canDeleteUsers) {
                            toast.error("Not authorized. You do not have permission to delete user accounts.")
                            return
                          }
                          setUserToDelete(usr)
                          setIsDeleteModalOpen(true)
                        }}
                        className="p-1.5 rounded-lg text-secondary hover:text-red-600 hover:bg-hover transition-colors cursor-pointer border-none bg-transparent"
                        title="Delete user"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-end mt-4">
              <Pagination
                currentPage={page}
                totalPages={meta.totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </>
      )}

      {/* Edit Role Modal */}
      <Modal isOpen={isRoleModalOpen} onClose={() => !isUpdatingRole && setIsRoleModalOpen(false)} className="max-w-md overflow-visible!">
        <div className="flex flex-col flex-1 overflow-visible!">
          <Modal.Header title="Update User Role" onClose={() => !isUpdatingRole && setIsRoleModalOpen(false)} />

          <Modal.Body className="space-y-4 overflow-visible!">
            {userToUpdateRole && (
              <div className="p-4 bg-background border border-border rounded-xl font-mono text-xs text-secondary space-y-1.5">
                <div>User: <span className="text-foreground font-bold">{userToUpdateRole.firstName} {userToUpdateRole.lastName}</span></div>
                <div>Email: <span className="text-foreground">{userToUpdateRole.email}</span></div>
                <div>Current Role: <span className="text-foreground font-semibold">{userToUpdateRole.role}</span></div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">Select New Role</label>
              <Select
                value={selectedRole}
                onChange={(val) => setSelectedRole(val)}
              >
                <Select.Option value="Admin">Admin</Select.Option>
                <Select.Option value="Manager">Manager</Select.Option>
                <Select.Option value="Employee">Employee</Select.Option>
              </Select>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button type="secondary" onClick={() => setIsRoleModalOpen(false)} disabled={isUpdatingRole}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (userToUpdateRole) {
                  if (selectedRole === userToUpdateRole.role) {
                    toast.info(`No changes detected.`)
                    return
                  }
                  performUpdateRole({ id: userToUpdateRole._id, role: selectedRole })
                }
              }}
              disabled={isUpdatingRole}
            >
              {isUpdatingRole ? "Updating..." : "Save Role"}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Delete User Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => !isDeleting && setIsDeleteModalOpen(false)} className="max-w-md">
        <div className="flex flex-col flex-1 overflow-hidden">
          <Modal.Header title="Delete User Account" onClose={() => !isDeleting && setIsDeleteModalOpen(false)} />

          <Modal.Body className="space-y-5">
            {/* Warning Banner */}
            <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-700 dark:text-amber-400">
              <Warning size={20} className="shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-sm font-bold">This action cannot be undone</span>
                <p className="text-xs opacity-90 leading-relaxed">
                  Deleting this user will permanently delete their account and access to the system.
                </p>
              </div>
            </div>

            <p className="text-foreground/90 font-medium text-sm px-1">
              Are you sure you want to delete this user account?
            </p>

            {userToDelete && (
              <div className="p-4 bg-background border border-border rounded-xl font-mono text-xs text-secondary space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-medium">User Name:</span>
                  <span className="text-foreground font-bold">{userToDelete.firstName} {userToDelete.lastName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-medium">Email Address:</span>
                  <span className="text-foreground font-bold">{userToDelete.email}</span>
                </div>
                <div className="flex justify-between items-center border-t border-border pt-2.5 mt-0.5">
                  <span className="text-secondary font-medium">Role:</span>
                  <span className="text-foreground font-bold">{userToDelete.role}</span>
                </div>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button type="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              onClick={() => userToDelete && performDeleteUser(userToDelete._id)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  )
}
