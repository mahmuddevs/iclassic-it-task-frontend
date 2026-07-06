import { getAssetUrl } from "../../utils/getAssetUrl"
import ImageLoader from "../common/image-loader"
import Button from "../common/button"
import Modal from "../common/modal"

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

interface ViewProductProps {
  product: ProductItem;
  onClose: () => void;
}

export default function ViewProduct({ product, onClose }: ViewProductProps) {
  const profit = product.sellingPrice - product.purchasePrice
  const margin = product.purchasePrice > 0 ? (profit / product.purchasePrice) * 100 : 0

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Modal.Header title="Product Details" onClose={onClose} />
      
      <Modal.Body className="overflow-y-auto py-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image Section */}
          <div className="w-full md:w-1/3 shrink-0">
            <div className="w-full aspect-square rounded-xl overflow-hidden border border-border bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center">
              <ImageLoader
                src={product.image ? getAssetUrl(product.image) : ""}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex-1 space-y-4">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
                {product.category}
              </span>
              <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
              <p className="text-xs text-secondary mt-1 font-mono">SKU: {product.sku}</p>
            </div>

            <hr className="border-border" />

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-secondary font-medium uppercase tracking-wider">Purchase Price</p>
                <p className="text-base font-semibold text-secondary mt-0.5">${product.purchasePrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-secondary font-medium uppercase tracking-wider">Selling Price</p>
                <p className="text-base font-semibold text-foreground mt-0.5">${product.sellingPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-secondary font-medium uppercase tracking-wider">Est. Profit (Margin)</p>
                <p className={`text-base font-semibold mt-0.5 ${profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                  ${profit.toFixed(2)} ({margin.toFixed(1)}%)
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary font-medium uppercase tracking-wider">Current Stock</p>
                <p className="text-base font-semibold mt-0.5">
                  <span
                    className={
                      product.stockQuantity < 10
                        ? "text-red-500 font-bold"
                        : "text-foreground"
                    }
                  >
                    {product.stockQuantity} units
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button type="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </div>
  )
}
