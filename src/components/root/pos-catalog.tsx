import type { ProductItem, GetProductsResponse } from "../../types/product-types"
import type { CartItem } from "../../types/sales-types"
import Pagination from "../common/pagination"
import { PackageIcon, XIcon } from "@phosphor-icons/react"
import { useGetQuery } from "../../hooks/useGetQuery"
import POSProductCard from "./pos-product-card"

interface POSCatalogProps {
  searchVal: string;
  setSearchVal: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  page: number;
  onPageChange: (page: number) => void;
  products: ProductItem[];
  meta: GetProductsResponse["meta"] | undefined;
  isLoading: boolean;
  cart: CartItem[];
  onAddToCart: (product: ProductItem) => void;
}

export default function POSCatalog({
  searchVal,
  setSearchVal,
  selectedCategory,
  onCategoryChange,
  page,
  onPageChange,
  products,
  meta,
  isLoading,
  cart,
  onAddToCart,
}: POSCatalogProps) {
  // Fetch categories dynamically from the public backend endpoint
  const { data: categories = [] } = useGetQuery<string[]>({
    url: "/products/categories",
    isPrivate: false,
    keys: ["categories"],
  })

  const allCategories = ["All", ...categories]

  return (
    <div className="bg-background-card border border-border rounded-2xl p-4 md:p-6 shadow-xs space-y-4">
      {/* Search and Categories Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Custom local search box to prevent nuqs conflicts and provide POS styling */}
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 inset-s-0 flex items-center ps-3.5 pointer-events-none text-secondary">
            <PackageIcon size={18} />
          </span>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search products by SKU / Name..."
            className="w-full bg-background-input border border-border ps-10 pe-10 h-12 text-sm rounded-xl outline-none transition-all text-foreground hover:border-slate-400 dark:hover:border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {searchVal && (
            <button
              type="button"
              onClick={() => setSearchVal("")}
              className="absolute inset-y-0 inset-e-0 flex items-center pe-3.5 text-secondary hover:text-foreground cursor-pointer border-none bg-transparent"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>

        {/* Horizontal scroll category filters */}
        <div
          className="w-full md:w-auto flex gap-2 overflow-x-auto select-none no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap cursor-pointer ${selectedCategory === cat
                ? "bg-primary border-primary! text-white shadow-sm"
                : "bg-transparent border-border text-secondary hover:text-foreground hover:bg-hover"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products catalog list or states */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-75">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-48 border border-border rounded-xl animate-pulse bg-slate-100 dark:bg-slate-800/40" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl min-h-75">
          <PackageIcon size={44} className="text-secondary mb-3" />
          <p className="font-semibold text-foreground text-sm">No Products Found</p>
          <p className="text-xs text-secondary mt-1">Try resetting search string or filter pills.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-75">
            {products.map((product) => {
              const cartQty = cart.find((item) => item.product._id === product._id)?.quantity || 0
              return (
                <POSProductCard
                  key={product._id}
                  product={product}
                  cartQty={cartQty}
                  onAddToCart={onAddToCart}
                />
              )
            })}
          </div>

          {/* Localized Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-end pt-2 border-t border-border/60">
              <Pagination
                currentPage={page}
                totalPages={meta.totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
