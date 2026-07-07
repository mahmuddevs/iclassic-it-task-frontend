import type { ProductItem } from "./product-types";

export interface SaleItem {
  product: {
    _id: string;
    name: string;
    sku: string;
    category: string;
  };
  quantity: number;
  unitPrice: number;
}

export interface SaleDoc {
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

export interface GetSalesResponse {
  sales: SaleDoc[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}
