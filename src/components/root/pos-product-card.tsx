import type { ProductItem } from "../../types/product-types"
import ImageLoader from "../common/image-loader"
import { PackageIcon } from "@phosphor-icons/react"
import { getAssetUrl } from "../../utils/getAssetUrl"

interface POSProductCardProps {
  product: ProductItem;
  cartQty: number;
  onAddToCart: (product: ProductItem) => void;
}

export default function POSProductCard({
  product,
  cartQty,
  onAddToCart,
}: POSProductCardProps) {
  const isOutOfStock = product.stockQuantity <= 0
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5

  return (
    <div
      onClick={() => !isOutOfStock && onAddToCart(product)}
      className={`group relative flex flex-col bg-background-card border border-border rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all select-none duration-300 ${isOutOfStock
        ? "opacity-60 cursor-not-allowed filter grayscale"
        : "cursor-pointer active:scale-98"
        }`}
    >
      {/* Image area */}
      <div className="relative h-32 w-full bg-slate-50 dark:bg-slate-900/30 overflow-hidden flex items-center justify-center shrink-0 border-b border-border/60">
        {product.image ? (
          <ImageLoader
            src={getAssetUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <PackageIcon size={32} className="text-slate-300 dark:text-slate-700 transition-transform duration-300 group-hover:scale-110" />
        )}

        {/* Category Badge */}
        <span className="absolute top-2.5 inset-s-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/60 text-white backdrop-blur-xs select-none">
          {product.category}
        </span>

        {/* Quantity already in Cart overlay badge */}
        {cartQty > 0 && (
          <span className="absolute top-2.5 inset-e-2.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-white shadow-md animate-in zoom-in select-none">
            {cartQty}
          </span>
        )}

        {/* Stock Status Badge */}
        {isOutOfStock ? (
          <span className="absolute inset-0 m-auto h-7 w-24 rounded-full flex items-center justify-center text-[10px] font-extrabold bg-red-600 text-white uppercase tracking-wider select-none shadow-sm">
            Out of stock
          </span>
        ) : isLowStock ? (
          <span className="absolute bottom-2 inset-e-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-white select-none">
            Only {product.stockQuantity} left
          </span>
        ) : null}
      </div>

      {/* Text Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-[10px] text-secondary font-mono tracking-wider mt-0.5">
            SKU: {product.sku}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-extrabold text-foreground">
            ${product.sellingPrice.toFixed(2)}
          </span>
          <span className="text-[10px] font-semibold text-secondary">
            {!isOutOfStock && `${product.stockQuantity} available`}
          </span>
        </div>
      </div>
    </div>
  )
}
