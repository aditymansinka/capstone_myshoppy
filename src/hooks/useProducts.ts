import { useEffect, useState, useCallback } from 'react';
import { Product } from '../types';
import { Category, getCategories, getProducts } from '../api/productsApi';

export interface UseProductsResult {
  categories: Category[];
  products: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useProducts(): UseProductsResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [remoteCategories, remoteProducts] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);

      setCategories(remoteCategories);
      setProducts(remoteProducts);
    } catch (fetchError) {
      setError('Unable to load products from server. Showing local data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    categories,
    products,
    loading,
    error,
    refresh: loadData,
  };
}
