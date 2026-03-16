import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "../../lib/apiClient";
import AddProductModal from "@/components/admin/AddProductModal";
import EditProductModal from "@/components/admin/EditProductModal";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  inStock: boolean;
  stockCount: number;
  brand?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [limit] = useState(20);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Check authentication and fetch products
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchProducts();
  }, [page, debouncedSearch]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());
      if (debouncedSearch) queryParams.append("search", debouncedSearch);
      
      const response = await apiClient.get<ApiResponse<Product[]>>(
        `/api/products?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.success && response.data) {
        setProducts(response.data);
        setTotalPages(response.pagination?.pages || 0);
      } else {
        toast.error(response.message || "Failed to fetch products");
      }
    } catch (error: any) {
      toast.error(error.message || "Error fetching products");
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast.success("Logged out successfully!");
    navigate("/admin/login");
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await apiClient.delete<ApiResponse<boolean>>(
        `/api/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.success) {
        toast.success("Product deleted successfully!");
        setPage(1);
        fetchProducts();
      } else {
        toast.error(response.message || "Failed to delete product");
      }
    } catch (error: any) {
      toast.error(error.message || "Error deleting product");
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const admin = localStorage.getItem("adminUser");
  const adminName = admin ? JSON.parse(admin).username : "Admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Welcome, <span className="font-semibold">{adminName}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="w-full sm:flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, ID..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
            />
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => {
              setSelectedProduct(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 px-6">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">
                {search ? "No products found matching your search" : "No products yet"}
              </p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">
                {search ? "Try a different search term" : "Create your first product to get started"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">ID</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Product Name</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Category</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Price</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Stock</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Status</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, idx) => (
                      <tr
                        key={product.id}
                        className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                          idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/30"
                        }`}
                      >
                        <td className="px-6 py-4 font-mono text-sm font-semibold text-sky-600 dark:text-sky-400">
                          {product.id}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{product.name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {product.stockCount}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              product.inStock
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                            }`}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/50 rounded-lg transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: {product.id}</p>
                      </div>
                      <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">
                        {product.category}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Price</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Stock</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{product.stockCount}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          product.inStock
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (page > 3) pageNum = page - 2 + i;
                if (page > totalPages - 3) pageNum = totalPages - 4 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      page === pageNum
                        ? "bg-sky-500 text-white"
                        : "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            setPage(1);
            fetchProducts();
          }}
        />
      )}

      {showEditModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
