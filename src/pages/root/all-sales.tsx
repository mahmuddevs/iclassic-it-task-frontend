import { useState, useEffect, useRef } from "react"
import { useQueryState, parseAsInteger } from "nuqs"
import { useGetQuery } from "../../hooks/useGetQuery"
import { useQueryMutation } from "../../hooks/useQueryMutation"
import Table from "../../components/common/table"
import Pagination from "../../components/common/pagination"
import NoData from "../../components/common/no-data"
import Modal from "../../components/common/modal"
import Button from "../../components/common/button"
import { EyeIcon, TrashIcon } from "@phosphor-icons/react"
import PageHeading from "../../components/root/page-heading"
import Search from "../../components/common/search"
import TableSkeleton from "../../components/common/table-skeleton"
import { toast } from "sonner"
import { invalidateQuery } from "../../utils/query-client"

interface ProductDetails {
  _id: string;
  name: string;
  sku: string;
  category: string;
  sellingPrice: number;
}

interface SaleItem {
  product: ProductDetails;
  quantity: number;
  unitPrice: number;
}

interface SaleDoc {
  _id: string;
  invoiceId: string;
  products: SaleItem[];
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  changeAmount: number;
  createdAt: string;
  updatedAt: string;
}

interface GetSalesResponse {
  sales: SaleDoc[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AllSales() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [search] = useQueryState("search")
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [saleToView, setSaleToView] = useState<SaleDoc | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [saleToDelete, setSaleToDelete] = useState<SaleDoc | null>(null)
  const [shouldRestoreStock, setShouldRestoreStock] = useState(true)

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

  const { data, isLoading, refetch } = useGetQuery<GetSalesResponse>({
    url: "/sales",
    isPrivate: true,
    queryParams: {
      page,
      limit: 8,
      search: search || undefined,
    },
    keys: [page, search],
  })

  const { mutate: performDeleteSale, isPending: isDeleting } = useQueryMutation<
    { message?: string },
    Error,
    string
  >({
    url: (id) => `/sales/${id}${shouldRestoreStock ? "?restoreStock=true" : ""}`,
    method: "DELETE",
    isPrivate: true,
    mutationOptions: {
      onSuccess: (resData) => {
        toast.success(resData?.message || "Sale deleted successfully.")
        refetch()
        invalidateQuery("/products")
        setIsDeleteModalOpen(false)
        setSaleToDelete(null)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete sale.")
      },
    },
  })

  const salesList = data?.sales || []
  const meta = data?.meta

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <PageHeading />
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <Search placeholder="Search By Invoice ID" />
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : salesList.length === 0 ? (
        <NoData
          title="No Sales Found"
          subtitle="It looks like there are no sales records matching the query."
        />
      ) : (
        <>
          {/* Sales Table */}
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Invoice ID</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Items Sold</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Grand Total</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Paid</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Due</Table.HeaderCell>
                <Table.HeaderCell className="text-center">Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {salesList.map((sale) => {
                const totalItems = sale.products.reduce((acc, item) => acc + item.quantity, 0)
                return (
                  <Table.Row key={sale._id}>
                    <Table.Cell className="font-mono text-xs text-secondary font-bold">
                      {sale.invoiceId}
                    </Table.Cell>
                    <Table.Cell className="text-foreground font-semibold">
                      {new Date(sale.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Table.Cell>
                    <Table.Cell className="text-right text-secondary font-semibold">
                      {totalItems}
                    </Table.Cell>
                    <Table.Cell className="text-right text-foreground font-bold">
                      ${sale.grandTotal.toFixed(2)}
                    </Table.Cell>
                    <Table.Cell className="text-right text-green-600 font-bold">
                      ${sale.paidAmount.toFixed(2)}
                    </Table.Cell>
                    <Table.Cell className="text-right text-red-500 font-bold">
                      ${sale.dueAmount.toFixed(2)}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSaleToView(sale)
                            setIsViewModalOpen(true)
                          }}
                          className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-hover transition-colors cursor-pointer border-none bg-transparent"
                          title="View details"
                        >
                          <EyeIcon size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSaleToDelete(sale)
                            setShouldRestoreStock(true) // default check true
                            setIsDeleteModalOpen(true)
                          }}
                          className="p-1.5 rounded-lg text-secondary hover:text-red-600 hover:bg-hover transition-colors cursor-pointer border-none bg-transparent"
                          title="Delete sale"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
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

      {/* Sale Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} className="max-w-2xl">
        {saleToView && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <Modal.Header title="Sale Details" onClose={() => setIsViewModalOpen(false)} />

            <Modal.Body className="overflow-y-auto space-y-6">
              <div className="flex justify-between items-start border-b border-border pb-4">
                <div>
                  <p className="text-xs text-secondary font-mono">Invoice: {saleToView.invoiceId}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-secondary">Date & Time</span>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    {new Date(saleToView.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Products Table in Modal */}
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/40 border-b border-border text-xs font-semibold text-secondary uppercase">
                      <th className="px-4 py-3">Product Name</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {saleToView.products.map((item, index) => (
                      <tr key={index} className="hover:bg-hover/20">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-foreground">{item.product?.name || "Deleted Product"}</p>
                          <p className="text-xs text-secondary font-mono mt-0.5">{item.product?.sku || "N/A"}</p>
                        </td>
                        <td className="px-4 py-3 text-right text-foreground font-semibold">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-secondary font-semibold">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-foreground font-semibold">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/20 p-4 rounded-xl border border-border">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Grand Total:</span>
                    <span className="font-bold text-foreground">${saleToView.grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Paid Amount:</span>
                    <span className="font-bold text-green-600">${saleToView.paidAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-2 border-l border-border pl-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Due Amount:</span>
                    <span className="font-bold text-red-500">${saleToView.dueAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Change Given:</span>
                    <span className="font-bold text-foreground">${saleToView.changeAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button type="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>

      {/* Delete Sale Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => !isDeleting && setIsDeleteModalOpen(false)} className="max-w-md">
        <div className="flex flex-col flex-1 overflow-hidden">
          <Modal.Header title="Delete Sale" onClose={() => !isDeleting && setIsDeleteModalOpen(false)} />

          <Modal.Body className="space-y-4">
            <p className="text-foreground font-semibold text-sm">
              Are you sure you want to delete this sale transaction?
            </p>
            {saleToDelete && (
              <div className="p-4 bg-background border border-border rounded-xl font-mono text-xs text-secondary space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-medium">Invoice ID:</span>
                  <span className="text-foreground font-bold">{saleToDelete.invoiceId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-medium">Grand Total:</span>
                  <span className="text-red-500 font-extrabold">${saleToDelete.grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-border pt-2 mt-1">
                  <span className="text-secondary font-medium">Date:</span>
                  <span className="text-foreground font-semibold">
                    {new Date(saleToDelete.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <label className="flex items-start gap-3 p-3.5 border border-border rounded-xl bg-background cursor-pointer select-none hover:bg-hover transition-colors">
              <input
                type="checkbox"
                checked={shouldRestoreStock}
                onChange={(e) => setShouldRestoreStock(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-foreground">Restore Product Stock</span>
                <p className="text-xs text-secondary leading-relaxed">
                  If checked, the quantities of products sold in this transaction will be returned to their respective stock inventory. If unchecked, the sale is deleted but inventory remains unchanged.
                </p>
              </div>
            </label>
          </Modal.Body>

          <Modal.Footer>
            <Button type="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              onClick={() => saleToDelete && performDeleteSale(saleToDelete._id)}
              disabled={isDeleting}
              className="border-red-500! bg-red-500 hover:bg-red-600! text-white"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  )
}