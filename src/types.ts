export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  image: string;
  stock: number;
  color?: string;
  isAvailable: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}