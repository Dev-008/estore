import { Heart, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";
import { toast } from "sonner";

const Wishlist = () => {
  const { items } = useWishlist();
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleAddAllToCart = () => {
    items.forEach(product => {
      addToCart(product);
    });
    toast.success(`Added ${items.length} items to cart! 🎉`);
  };

  const toggleSelection = (productId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  const handleAddSelectedToCart = () => {
    const selectedProducts = items.filter(p => selectedItems.has(p.id));
    selectedProducts.forEach(product => {
      addToCart(product);
    });
    toast.success(`Added ${selectedProducts.length} items to cart! 🎉`);
    setSelectedItems(new Set());
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-900/20 dark:to-gray-900/20 rounded-full mb-6">
            <Heart className="h-12 w-12 text-slate-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-tight" style={{fontFamily: "'Poppins', sans-serif"}}>
            Your Wishlist is Empty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg font-semibold">
            Save your favorite items to your wishlist and they'll be waiting for you whenever you're ready!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ShoppingBag className="h-5 w-5" />
            Start Exploring
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Link
              to="/"
              className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-tight" style={{fontFamily: "'Poppins', sans-serif"}}>
                My Wishlist
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 font-semibold text-lg">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddAllToCart}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="h-5 w-5" />
              Add All to Cart ({items.length})
            </button>
            {selectedItems.size > 0 && (
              <button
                onClick={handleAddSelectedToCart}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="h-5 w-5" />
                Add {selectedItems.size} Selected
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product, idx) => (
            <div
              key={product.id}
              className="group animate-scale-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="relative">
                <ProductCard product={product} />
                
                {/* Selection Checkbox */}
                <label className="absolute top-3 left-3 flex items-center justify-center w-6 h-6 bg-white/90 dark:bg-slate-800/90 rounded-lg border-2 border-gray-300 dark:border-slate-600 cursor-pointer hover:border-primary transition-colors z-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(product.id)}
                    onChange={() => toggleSelection(product.id)}
                    className="w-4 h-4 accent-primary"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 text-center hover:shadow-lg transition-shadow">
            <p className="text-4xl font-bold text-primary mb-2">{items.length}</p>
            <p className="text-gray-600 dark:text-gray-400">Items Saved</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 text-center hover:shadow-lg transition-shadow">
            <p className="text-4xl font-bold text-green-600 mb-2">
              ₹{items.reduce((sum, p) => sum + p.price, 0).toLocaleString('en-IN')}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Total Value</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 text-center hover:shadow-lg transition-shadow">
            <p className="text-4xl font-bold text-blue-600 mb-2">
              ₹{Math.round(items.reduce((sum, p) => sum + (p.originalPrice - p.price), 0)).toLocaleString('en-IN')}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Potential Savings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
