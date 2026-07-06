import { useQueryState, parseAsInteger } from "nuqs"
import { useGetQuery } from "../../hooks/useGetQuery"
import Table from "../../components/common/table"
import ImageLoader from "../../components/common/image-loader"
import Pagination from "../../components/common/pagination"
import NoData from "../../components/common/no-data"
import { getAssetUrl } from "../../utils/getAssetUrl"
import { EyeIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"

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

  const { data, isLoading } = useGetQuery<GetProductsResponse>({
    url: "/products",
    isPrivate: true,
    queryParams: {
      page,
      limit: 8, // Small limit to demonstrate pagination controls
    },
    keys: [page],
  })

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
                    className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-hover transition-colors cursor-pointer border-none bg-transparent"
                    title="View details"
                  >
                    <EyeIcon size={16} />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-secondary hover:text-green-600 hover:bg-hover transition-colors cursor-pointer border-none bg-transparent"
                    title="Edit product"
                  >
                    <PencilSimpleIcon size={16} />
                  </button>
                  <button
                    type="button"
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
    </div>
  )
}