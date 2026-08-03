import { Product } from '../types';
import { CATEGORIES, PRODUCTS } from '../data/products';

const API_BASE_URL = 'http://localhost:3001';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Unable to fetch ${path}: ${response.statusText}`);
  }
  return response.json();
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchJson('/categories');
}

export async function fetchProducts(): Promise<Product[]> {
  return fetchJson('/products');
}

export async function getCategories(): Promise<Category[]> {
  try {
    return await fetchCategories();
  } catch (error) {
    return CATEGORIES;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    return await fetchProducts();
  } catch (error) {
    return PRODUCTS;
  }
}
