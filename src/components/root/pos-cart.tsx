import type { CartItem } from "../../types/sales-types"
import Button from "../common/button"
import {
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react"

interface POSCartProps {
  cart: CartItem[];
  onClearCart: () => void;
  onUpdateQty: (productId: string, qty: number, stockLimit: number) => void;
  onRemoveItem: (productId: string) => void;
  paidAmountInput: string;
  setPaidAmountInput: (val: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.SubmitEvent) => void;
}

export default function POSCart({
  cart,
  onClearCart,
  onUpdateQty,
  onRemoveItem,
  paidAmountInput,
  setPaidAmountInput,
  isSubmitting,
  onSubmit,
}: POSCartProps) {
  // Localized calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0)
  const grandTotal = subtotal
  const paidAmount = paidAmountInput === "" ? 0 : parseFloat(paidAmountInput) || 0
  const dueAmount = paidAmount >= grandTotal ? 0 : grandTotal - paidAmount
  const changeAmount = paidAmount >= grandTotal ? paidAmount - grandTotal : 0
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="bg-background-card border border-border rounded-2xl shadow-xs overflow-hidden flex flex-col sticky top-6">
      {/* Header */}
      <div className="p-4 md:p-5 border-b border-border flex items-center justify-between bg-background-card">
        <div className="flex items-center gap-2">
          <ShoppingCartIcon size={20} className="text-primary" />
          <span className="font-bold text-sm text-foreground">Checkout Cart</span>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer border-none bg-transparent"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Cart items list */}
      <div className="flex-1 min-h-55 max-h-90 overflow-y-auto pe-1 p-4 space-y-3 bg-background">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-50 text-center select-none py-8">
            <div className="w-12 h-12 rounded-full bg-background-input border border-border flex items-center justify-center text-secondary mb-3">
              <ShoppingCartIcon size={24} />
            </div>
            <p className="font-semibold text-foreground text-xs">Cart is Empty</p>
            <p className="text-[11px] text-secondary mt-1 max-w-50 leading-relaxed">
              Click product cards in the catalog to add items to this sale.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center justify-between gap-4 p-3.5 bg-background-card border border-border rounded-xl shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-foreground truncate leading-snug">
                  {item.product.name}
                </h4>
                <p className="text-[10px] text-secondary font-mono tracking-tight mt-0.5">
                  ${item.product.sellingPrice.toFixed(2)} / unit
                </p>
              </div>

              {/* Quantity Actions */}
              <div className="flex items-center gap-2 border border-border rounded-lg p-1 bg-background select-none">
                <button
                  type="button"
                  onClick={() => onUpdateQty(item.product._id, item.quantity - 1, item.product.stockQuantity)}
                  className="p-1 hover:bg-hover rounded-md text-secondary hover:text-foreground transition-colors cursor-pointer border-none bg-transparent"
                >
                  <MinusIcon size={12} />
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateQty(item.product._id, parseInt(e.target.value) || 0, item.product.stockQuantity)}
                  className="w-8 text-center text-xs font-bold text-foreground bg-transparent border-none focus:outline-hidden p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => onUpdateQty(item.product._id, item.quantity + 1, item.product.stockQuantity)}
                  className="p-1 hover:bg-hover rounded-md text-secondary hover:text-foreground transition-colors cursor-pointer border-none bg-transparent"
                >
                  <PlusIcon size={12} />
                </button>
              </div>

              {/* Price & Delete */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-extrabold text-foreground min-w-12.5 text-right">
                  ${(item.product.sellingPrice * item.quantity).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.product._id)}
                  className="p-1 text-secondary hover:text-red-600 hover:bg-hover transition-colors rounded-lg cursor-pointer border-none bg-transparent"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment form */}
      <form onSubmit={onSubmit} className="border-t border-border p-4 md:p-5 bg-background-card space-y-4 select-none">
        {/* Quick Pricing Summary */}
        <div className="space-y-2 text-xs font-semibold">
          <div className="flex justify-between text-secondary">
            <span>Items Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-secondary">
            <span>Total Items Quantity:</span>
            <span>{totalItemsCount} units</span>
          </div>
          <div className="flex justify-between text-foreground text-sm font-extrabold pt-2 border-t border-border/60">
            <span>Grand Total:</span>
            <span className="text-primary text-base">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Paid Amount Input */}
        <div className="space-y-2">
          <label htmlFor="paidAmount" className="text-xs font-bold text-foreground inline-block">
            Paid Amount ($)
          </label>
          <div className="relative">
            <input
              id="paidAmount"
              type="number"
              step="any"
              min="0"
              placeholder="Enter cash amount..."
              value={paidAmountInput}
              onChange={(e) => setPaidAmountInput(e.target.value)}
              className="w-full bg-background-input border border-border px-4 h-11 text-sm font-semibold rounded-xl outline-none transition-all text-foreground hover:border-slate-400 dark:hover:border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Quick Cash Buttons */}
          {grandTotal > 0 && (
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setPaidAmountInput(grandTotal.toString())}
                className="py-1 px-2 text-[10px] font-bold text-center border border-border rounded-lg bg-background-input hover:bg-hover hover:border-slate-400 dark:hover:border-slate-600 text-foreground transition-all cursor-pointer"
              >
                Exact
              </button>
              <button
                type="button"
                onClick={() => setPaidAmountInput("0")}
                className="py-1 px-2 text-[10px] font-bold text-center border border-border rounded-lg bg-background-input hover:bg-hover hover:border-slate-400 dark:hover:border-slate-600 text-foreground transition-all cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  const current = parseFloat(paidAmountInput) || 0
                  setPaidAmountInput((current + 20).toString())
                }}
                className="py-1 px-2 text-[10px] font-bold text-center border border-border rounded-lg bg-background-input hover:bg-hover hover:border-slate-400 dark:hover:border-slate-600 text-foreground transition-all cursor-pointer"
              >
                +$20
              </button>
              <button
                type="button"
                onClick={() => {
                  const current = parseFloat(paidAmountInput) || 0
                  setPaidAmountInput((current + 50).toString())
                }}
                className="py-1 px-2 text-[10px] font-bold text-center border border-border rounded-lg bg-background-input hover:bg-hover hover:border-slate-400 dark:hover:border-slate-600 text-foreground transition-all cursor-pointer"
              >
                +$50
              </button>
            </div>
          )}
        </div>

        {/* Calculations display */}
        {grandTotal > 0 && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-background border border-border rounded-xl">
            <div>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">
                Due Amount
              </span>
              <span className={`text-sm font-extrabold ${dueAmount > 0 ? "text-red-500" : "text-slate-400"}`}>
                ${dueAmount.toFixed(2)}
              </span>
            </div>
            <div className="border-l border-border ps-3">
              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">
                Change Amount
              </span>
              <span className={`text-sm font-extrabold ${changeAmount > 0 ? "text-green-600" : "text-slate-400"}`}>
                ${changeAmount.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Submit checkout button */}
        <Button
          htmlType="submit"
          disabled={cart.length === 0 || isSubmitting}
          className="w-full h-12 flex justify-center items-center font-bold"
        >
          {isSubmitting ? (
            <>
              <CircleNotchIcon size={18} className="animate-spin text-white me-2" />
              Processing Sale...
            </>
          ) : (
            `Process Checkout ($${grandTotal.toFixed(2)})`
          )}
        </Button>
      </form>
    </div>
  )
}
