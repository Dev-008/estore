import { useState } from "react";
import { X, Plus, Loader, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import apiClient from "../../lib/apiClient";

interface AddProductModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const AddProductModal = ({ onClose, onSuccess }: AddProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "electronics",
    brand: "",
    image: "",
    inStock: true,
    stockCount: "",
    rating: "0",
    reviewCount: "0",
    features: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.id || !formData.name || !formData.price || !formData.category) {
      setError("Please fill in all required fields: ID, Name, Price, Category");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const productData = {
        id: formData.id.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        category: formData.category.toLowerCase(),
        rating: Number(formData.rating || 0),
        reviewCount: Number(formData.reviewCount || 0),
        image: formData.image.trim() || "https://via.placeholder.com/400",
        images: [formData.image.trim() || "https://via.placeholder.com/400"],//1193675123e79c404875830f543db71e0f18f92e
        inStock: formData.inStock,
        stockCount: Number(formData.stockCount || 0),
        brand: formData.brand.trim(),
        features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
      };

      console.log("Sending payload:", productData);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        setError(data.message || `Error: ${response.status} ${response.statusText}`);
        toast.error(data.message || "Failed to add product");
        return;
      }

      toast.success("Product added successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error:", err);
      const errorMessage = err.message || "Error adding product";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-sky-50 to-sky-100 dark:from-gray-800 dark:to-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Plus className="w-6 h-6 text-sky-500" />
            Add New Product
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Two Column Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Product ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Product ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="e.g., 101"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-gray-900 dark:text-white"
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Premium Headphones"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-gray-900 dark:text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-gray-900 dark:text-white"
              >
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home</option>
                <option value="sports">Sports</option>
                <option value="beauty">Beauty</option>
                <option value="books">Books</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g., Sony"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-gray-900 dark:text-white"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-gray-900 dark:text-white"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-gray-900 dark:text-white"
              />
            </div>

            {/* Stock Count */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Stock Count
              </label>
              <input
                type="number"
                name="stockCount"
                value={formData.stockCount}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-gray-900 dark:text-white"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Rating (0-5)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="5"
                step="0.1"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-gray-900 dark:text-white"
              />
            </div>

            {/* In Stock */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label className="text-sm font-semibold text-gray-900 dark:text-white">
                In Stock
              </label>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.example.com/product.jpg"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-gray-900 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Features (comma-separated)
            </label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="e.g., Wireless, Noise Cancellation, 30-hour battery"
              rows={2}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg font-semibold hover:from-sky-600 hover:to-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
