export interface ProductItem {
  _id: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  image?: string;
}

export interface GetProductsResponse {
  products: ProductItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
