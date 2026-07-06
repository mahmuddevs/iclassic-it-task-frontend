import { useState } from "react"
import { useQueryState, parseAsInteger } from "nuqs"
import { useGetQuery } from "../../hooks/useGetQuery"
import { useQueryMutation } from "../../hooks/useQueryMutation"
import Table from "../../components/common/table"
import ImageLoader from "../../components/common/image-loader"
import Pagination from "../../components/common/pagination"
import NoData from "../../components/common/no-data"
import Modal from "../../components/common/modal"
import Button from "../../components/common/button"
import { getAssetUrl } from "../../utils/getAssetUrl"
import { EyeIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"
import { toast } from "sonner"
import PageHeading from "../../components/root/page-heading"
import AddProduct from "../../components/root/add-product"
import UpdateProduct from "../../components/root/update-product"
import ViewProduct from "../../components/root/view-product"

interface ProductItem {
  _id: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  image?: string;
}

interface GetProductsResponse {
  products: ProductItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function Products() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [productToUpdate, setProductToUpdate] = useState<ProductItem | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [productToView, setProductToView] = useState<ProductItem | null>(null)

  const { data, isLoading, refetch } = useGetQuery<GetProductsResponse>({
    url: "/products",
    isPrivate: true,
    queryParams: {
      page,
      limit: 8,
    },
    keys: [page],
  })

  const { mutate: deleteProduct, isPending: isDeleting } = useQueryMutation<
    { message?: string },
    Error,
    string
  >({
    url: (id) => `/products/${id}`,
    method: "DELETE",
    isPrivate: true,
    mutationOptions: {
      onSuccess: (resData) => {
        toast.success(resData?.message || "Product deleted successfully.")
        const currentProductsCount = data?.products?.length || 0
        if (currentProductsCount === 1 && page > 1) {
          setPage(page - 1)
        }
        refetch()
        setIsDeleteModalOpen(false)
        setProductToDelete(null)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete product.")
      },
    },
  })

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete._id)
    }
  }

  const handleCloseDeleteModal = () => {
    if (isDeleting) return
    setIsDeleteModalOpen(false)
    setProductToDelete(null)
  }




  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-12 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
      </div>
    )
  }

  const productsList = data?.products || []
  const meta = data?.meta

  if (productsList.length === 0) {
    return (
      <NoData
        title="No Products Found"
        subtitle="It looks like there are no products in the catalog. Add one to see it listed here!"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <PageHeading />
        <Button onClick={() => setIsAddModalOpen(true)} className="border-primary!">
          Add Product
        </Button>

      </div>
      {/* Products Table */}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Image</Table.HeaderCell>
            <Table.HeaderCell>Product Name</Table.HeaderCell>
            <Table.HeaderCell>SKU</Table.HeaderCell>
            <Table.HeaderCell>Category</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Purchase Price</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Selling Price</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Stock Qty</Table.HeaderCell>
            <Table.HeaderCell className="text-center">Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {productsList.map((product) => (
            <Table.Row key={product._id}>
              <Table.Cell>
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center shrink-0">
                  <ImageLoader
                    src={product.image ? getAssetUrl(product.image) : ""}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              </Table.Cell>
              <Table.Cell className="font-bold text-foreground">
                {product.name}
              </Table.Cell>
              <Table.Cell className="font-mono text-xs text-secondary">
                {product.sku}
              </Table.Cell>
              <Table.Cell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {product.category}
                </span>
              </Table.Cell>
              <Table.Cell className="text-right font-semibold text-secondary">
                ${product.purchasePrice.toFixed(2)}
              </Table.Cell>
              <Table.Cell className="text-right font-semibold text-foreground">
                ${product.sellingPrice.toFixed(2)}
              </Table.Cell>
              <Table.Cell className="text-right font-semibold">
                <span
                  className={
                    product.stockQuantity < 10
                      ? "text-red-500 font-bold animate-pulse"
                      : "text-foreground"
                  }
                >
                  {product.stockQuantity}
                </span>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProductToView(product)
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
                      setProductToUpdate(product)
                      setIsUpdateModalOpen(true)
                    }}
                    className="p-1.5 rounded-lg text-secondary hover:text-green-600 hover:bg-hover transition-colors cursor-pointer border-none bg-transparent"
                    title="Edit product"
                  >
                    <PencilSimpleIcon size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProductToDelete(product)
                      setIsDeleteModalOpen(true)
                    }}
                    className="p-1.5 rounded-lg text-secondary hover:text-red-600 hover:bg-hover transition-colors cursor-pointer border-none bg-transparent"
                    title="Delete product"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Pagination (visible if totalPages > 1) */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
      {/* Add Product Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} className="max-w-2xl">
        <AddProduct
          onSuccess={() => {
            setIsAddModalOpen(false)
            refetch()
          }}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Update Product Modal */}
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} className="max-w-2xl">
        {productToUpdate && (
          <UpdateProduct
            product={productToUpdate}
            onSuccess={() => {
              setIsUpdateModalOpen(false)
              setProductToUpdate(null)
              refetch()
            }}
            onCancel={() => {
              setIsUpdateModalOpen(false)
              setProductToUpdate(null)
            }}
          />
        )}
      </Modal>

      {/* View Product Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} className="max-w-2xl">
        {productToView && (
          <ViewProduct
            product={productToView}
            onClose={() => {
              setIsViewModalOpen(false)
              setProductToView(null)
            }}
          />
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <Modal.Header title="Confirm Delete" onClose={handleCloseDeleteModal} />
        <Modal.Body>
          <div className="space-y-3">
            <p className="text-foreground">
              Are you sure you want to delete <strong className="font-semibold text-foreground">{productToDelete?.name}</strong>?
            </p>
            <p className="text-xs text-red-500 font-medium">
              This action cannot be undone. This product will be permanently removed from the catalog.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="secondary"
            onClick={handleCloseDeleteModal}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleConfirmDelete}
            className="bg-red-600 hover:bg-red-700 border-red-600!"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>



    </div>
  )
}