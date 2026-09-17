export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

export type Product = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: string;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  category: Category;
};