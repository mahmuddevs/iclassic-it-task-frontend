import { z } from "zod"

export const ProductSchema = z.object({
  name: z
    .string({ message: "Product Name is required" })
    .trim()
    .min(1, "Product Name is required"),
  sku: z
    .string({ message: "SKU is required" })
    .trim()
    .min(1, "SKU is required"),
  category: z
    .string({ message: "Category is required" })
    .trim()
    .min(1, "Category is required"),
  purchasePrice: z.coerce
    .number({ message: "Purchase Price is required" })
    .min(0, "Purchase Price cannot be negative"),
  sellingPrice: z.coerce
    .number({ message: "Selling Price is required" })
    .min(0, "Selling Price cannot be negative"),
  stockQuantity: z.coerce
    .number({ message: "Stock Quantity is required" })
    .int("Stock Quantity must be an integer")
    .min(0, "Stock Quantity cannot be negative"),
  image: z
    .instanceof(File, { message: "Image is required" }),
})

export type ProductInput = z.infer<typeof ProductSchema>;

export const UpdateProductSchema = z.object({
  name: z
    .string({ message: "Product Name is required" })
    .trim()
    .min(1, "Product Name is required"),
  sku: z
    .string({ message: "SKU is required" })
    .trim()
    .min(1, "SKU is required"),
  category: z
    .string({ message: "Category is required" })
    .trim()
    .min(1, "Category is required"),
  purchasePrice: z.coerce
    .number({ message: "Purchase Price is required" })
    .min(0, "Purchase Price cannot be negative"),
  sellingPrice: z.coerce
    .number({ message: "Selling Price is required" })
    .min(0, "Selling Price cannot be negative"),
  stockQuantity: z.coerce
    .number({ message: "Stock Quantity is required" })
    .int("Stock Quantity must be an integer")
    .min(0, "Stock Quantity cannot be negative"),
  image: z
    .union([z.instanceof(File), z.string()])
    .optional(),
})

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
