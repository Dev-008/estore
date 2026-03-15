import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { productService, Product } from "@/lib/productService";

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 41500]);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getAllProducts({
          limit: 100,
          category: selectedCategory || undefined,
          search: searchQuery || undefined,
        });
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    setSelectedCategory(categoryFilter);
  }, [categoryFilter]);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [products, priceRange, sortBy]);

  const filtered = useMemo(() => {
    let result = products;
    if (priceRange) {
      result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    }
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }
    return result;
  }, [products, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 animate-slide-up">
          <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-gray-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight" style={{fontFamily: "'Poppins', sans-serif"}}>
              {searchQuery
                ? "🔍 Search Results"
                : selectedCategory
                ? `📦 ${categories.find((c) => c.id === selectedCategory)?.name || "Products"}`
                : "🛍️ All Products"}
            </h1>
            <p className="text-slate-200 text-lg font-semibold">Discover {filtered.length} amazing products</p>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-bold text-gray-900 dark:text-white">{filtered.length}</span> products
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border-2 border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-slate-500 transition-all duration-300 cursor-pointer hover:border-slate-400 font-medium"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💸 Price: High to Low</option>
                <option value="popular">🔥 Most Popular</option>
              </select>
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="font-bold text-sm uppercase tracking-widest text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  💵 Price Range
                </label>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                    className="flex-1 sm:flex-none sm:w-24 border-2 border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-slate-500 transition-all"
                    min={0}
                    placeholder="Min"
                  />
                  <span className="text-gray-500 dark:text-gray-400 font-bold">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                    className="flex-1 sm:flex-none sm:w-24 border-2 border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-slate-500 transition-all"
                    placeholder="Max"
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          {loading ? (
            <div className="text-center py-32 animate-fade-in">
              <div className="text-8xl mb-6 opacity-40">⏳</div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Loading products...</p>
              <p className="text-lg text-gray-600 dark:text-gray-400">Fetching from MongoDB</p>
            </div>
          ) : error ? (
            <div className="text-center py-32 animate-fade-in">
              <div className="text-8xl mb-6 opacity-40">❌</div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Error loading products</p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
              >
                🔄 Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32 animate-fade-in">
              <div className="text-8xl mb-6 opacity-40">🔍</div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-3">No products found</p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Try adjusting your filters or search terms</p>
              <Link
                to="/products"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
              >
                ← Back to All Products
              </Link>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-8 bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-indigo-900/30 rounded-3xl border-2 border-purple-200 dark:border-purple-700/50 shadow-lg">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    📦 {filtered.length === 1 ? "Product" : "Products"} Found
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Browse and discover items that match your criteria</p>
                </div>
                <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl border-2 border-purple-200 dark:border-purple-700 shadow-md min-w-max">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    {filtered.length}
                  </p>
                </div>
              </div>

              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-5 transition-all duration-300 ${
                isAnimating ? "opacity-50" : "opacity-100"
              }`}>
                {filtered.map((product, idx) => (
                  <div
                    key={product.id}
                    style={{ animationDelay: `${idx * 50}ms` }}
                    className="animate-scale-in"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
