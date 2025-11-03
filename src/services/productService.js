// src/services/productService.js
import { apiClient } from './apiClient';

// Fetch products with pagination and optional filters
// params: { page=1, size=10, search='', status }
export async function getProducts({ page = 1, size = 10, search = '', status } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', String(size));
  if (search && search.trim()) params.set('name', search.trim());
  if (status && status !== 'all') params.set('status', status);

  const path = `/product/controller/api/v1/products?${params.toString()}`;
  return apiClient(path, { method: 'GET' });
}

export async function deleteProduct(productId) {
  if (!productId) throw new Error('productId is required');
  const path = `/product/controller/api/v1/${productId}`;
  return apiClient(path, { method: 'DELETE' });
}

// Create products in bulk (API expects an array payload)
// products: Array<{ name, category, description, stock, unit_price, low_stock, image_url, status }>
export async function addProducts(products = []) {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('products array is required');
  }
  const path = `/product/controller/api/v1/products`;
  return apiClient(path, { method: 'POST', body: products });
}

// Convenience wrapper for single product creation
export async function addProduct(product) {
  if (!product || typeof product !== 'object') throw new Error('product is required');
  return addProducts([product]);
}

// Upload/replace product image for a given product
// Sends multipart/form-data with field name 'image'
export async function uploadProductImage(productId, file) {
  if (!productId) throw new Error('productId is required');
  if (!file) throw new Error('file is required');
  const form = new FormData();
  form.append('file', file);
  const path = `/product/controller/api/v1/${encodeURIComponent(productId)}/image`;
  // Most APIs accept PUT for replace or POST for create; using PUT by default here
  return apiClient(path, { method: 'POST', body: form });
}

// Update a product partially (PUT) — send only defined, non-empty fields
// payload keys allowed by BE: { name, category, unit_price, description, low_stock, status }
export async function updateProduct(productId, payload = {}) {
  if (!productId) throw new Error('productId is required');
  if (!payload || typeof payload !== 'object') throw new Error('payload is required');

  const body = Object.entries(payload).reduce((acc, [k, v]) => {
    if (v === undefined || v === null) return acc;
    if (typeof v === 'string' && v.trim() === '') return acc;
    acc[k] = v;
    return acc;
  }, {});

  const path = `/product/controller/api/v1/${encodeURIComponent(productId)}`;
  return apiClient(path, { method: 'PUT', body });
}

// Fetch a single product by id
export async function getProduct(productId) {
  if (!productId) throw new Error('productId is required');
  const path = `/product/controller/api/v1/${encodeURIComponent(productId)}`;
  return apiClient(path, { method: 'GET' });
}
