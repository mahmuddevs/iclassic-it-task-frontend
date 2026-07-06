import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProductSchema, type ProductInput } from "../../schemas/product-schemas"
import { useQueryMutation } from "../../hooks/useQueryMutation"
import Button from "../common/button"
import Select from "../common/select"
import ImageUpload from "../common/image-upload"
import { WarningCircleIcon, CircleNotchIcon } from "@phosphor-icons/react"
import { toast } from "sonner"
import Modal from "../common/modal"

interface AddProductProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CATEGORIES = ["Electronics", "Accessories", "Office Supplies", "Furniture", "Clothing"]

export default function AddProduct({ onSuccess, onCancel }: AddProductProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProductSchema),
  })

  const { mutate: addProduct, isPending } = useQueryMutation<
    { message?: string },
    Error,
    FormData
  >({
    url: "/products",
    method: "POST",
    isPrivate: true,
    mutationOptions: {
      onSuccess: (data) => {
        toast.success(data?.message || "Product created successfully.")
        reset()
        onSuccess?.()
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create product.")
      },
    },
  })

  const onSubmit = (values: ProductInput) => {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("sku", values.sku)
    formData.append("category", values.category)
    formData.append("purchasePrice", String(values.purchasePrice))
    formData.append("sellingPrice", String(values.sellingPrice))
    formData.append("stockQuantity", String(values.stockQuantity))
    if (values.image) {
      formData.append("image", values.image)
    }
    addProduct(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
      <Modal.Header title="Add New Product" onClose={onCancel} />
      
      <Modal.Body className="overflow-y-auto py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              {...register("name")}
              className="w-full px-4 py-3 bg-background-input border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm transition-all focus:outline-none text-foreground placeholder:text-slate-400"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <WarningCircleIcon size={16} />
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          {/* SKU */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
              SKU
            </label>
            <input
              type="text"
              placeholder="e.g. LAP-HQ-001"
              {...register("sku")}
              className="w-full px-4 py-3 bg-background-input border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm transition-all focus:outline-none text-foreground placeholder:text-slate-400"
            />
            {errors.sku && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <WarningCircleIcon size={16} />
                <span>{errors.sku.message}</span>
              </p>
            )}
          </div>

          {/* Category */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
              Category
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Category"
                  error={errors.category?.message}
                >
                  {CATEGORIES.map((cat) => (
                    <Select.Option key={cat} value={cat}>
                      {cat}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
            {errors.category && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <WarningCircleIcon size={16} />
                <span>{errors.category.message}</span>
              </p>
            )}
          </div>

          {/* Purchase Price */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
              Purchase Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("purchasePrice")}
              className="w-full px-4 py-3 bg-background-input border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm transition-all focus:outline-none text-foreground placeholder:text-slate-400"
            />
            {errors.purchasePrice && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <WarningCircleIcon size={16} />
                <span>{errors.purchasePrice.message}</span>
              </p>
            )}
          </div>

          {/* Selling Price */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
              Selling Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("sellingPrice")}
              className="w-full px-4 py-3 bg-background-input border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm transition-all focus:outline-none text-foreground placeholder:text-slate-400"
            />
            {errors.sellingPrice && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <WarningCircleIcon size={16} />
                <span>{errors.sellingPrice.message}</span>
              </p>
            )}
          </div>

          {/* Stock Quantity */}
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              placeholder="0"
              {...register("stockQuantity")}
              className="w-full px-4 py-3 bg-background-input border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm transition-all focus:outline-none text-foreground placeholder:text-slate-400"
            />
            {errors.stockQuantity && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <WarningCircleIcon size={16} />
                <span>{errors.stockQuantity.message}</span>
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="col-span-2">
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  label="Product Image"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.image}
                />
              )}
            />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="secondary"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isPending}
          className="min-w-32"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <CircleNotchIcon size={18} className="animate-spin text-white" />
              <span>Saving...</span>
            </span>
          ) : (
            "Save Product"
          )}
        </Button>
      </Modal.Footer>
    </form>
  )
}