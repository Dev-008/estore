import apiClient from './apiClient';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  brand: string;
  features: string[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  category?: string;
  inStock?: boolean;
  search?: string;
}

export interface PaginatedResponse {
  success: boolean;
  data: Product[];
  message?: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ProductService {
  /**
   * Fetch all products with optional filtering and pagination
   */
  async getAllProducts(params?: PaginationParams): Promise<PaginatedResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.inStock !== undefined) queryParams.append('inStock', params.inStock.toString());
      if (params?.search) queryParams.append('search', params.search);

      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await apiClient.get<PaginatedResponse>(`/api/products${query}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch products');
      }

      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Fetch a single product by ID
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Product; message?: string }>(
        `/api/products/${id}`
      );

      if (!response.success) {
        throw new Error('Failed to fetch product');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  /**
   * Fetch products by category
   */
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Product[]; message?: string }>(
        `/api/products/category/${categoryId}`
      );

      if (!response.success) {
        throw new Error('Failed to fetch products by category');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  /**
   * Create a new product (admin only)
   */
  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.post<{ success: boolean; data: Product; message?: string }>(
        '/api/products',
        productData
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to create product');
      }

      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update an existing product (admin only)
   */
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.put<{ success: boolean; data: Product; message?: string }>(
        `/api/products/${id}`,
        productData
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to update product');
      }

      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete a product (admin only)
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<{ success: boolean; message?: string }>(
        `/api/products/${id}`
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();
