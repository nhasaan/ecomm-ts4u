export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string | null;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string | null;
}

export interface ProductFilter {
  page: number;
  limit: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
