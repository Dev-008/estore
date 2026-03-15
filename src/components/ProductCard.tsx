import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Zap, Share2, Eye, Package } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { useState } from "react";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const wishlisted = isInWishlist(product.id);

  // Generate placeholder initials from product name
  const getProductInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisting(true);
    
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast("Removed from wishlist", {
        style: { background: "#f87171" },
      });
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist! ❤️");
    }
    
    setTimeout(() => setIsWishlisting(false), 300);
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/checkout");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on StoreMX!`,
        url: `/product/${product.id}`,
      });
    } else {
      toast("Share link copied!");
      navigator.clipboard.writeText(`${window.location.origin}/product/${product.id}`);
    }
  };

  return (
    <div 
      className="group bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-500 animate-fade-in hover:scale-105 hover:-translate-y-1 flex flex-col h-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-slate-700">
        {imageError || !product.image ? (
          // Professional Placeholder with modern gradient
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-500 via-slate-600 to-gray-600 dark:from-slate-700 dark:via-slate-800 dark:to-gray-800 relative">
            <div className="flex flex-col items-center justify-center gap-3 transform group-hover:scale-110 transition-transform duration-700">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-all duration-500">
                <Package className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
              <div className="text-center">
                <p className="text-white font-black text-3xl drop-shadow-md">{getProductInitials(product.name)}</p>
                <p className="text-white/80 text-xs font-semibold drop-shadow-sm mt-1 tracking-wide">{product.brand}</p>
              </div>
            </div>
            {/* Animated texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none group-hover:from-black/10 transition-all duration-500"></div>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        )}
        
        {/* Overlay Actions - Smooth fade in */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-5 animate-fade-in">
            <button
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-white text-gray-900 rounded-full p-4 hover:bg-slate-600 hover:text-white transition-all duration-300 transform hover:scale-125 shadow-xl hover:shadow-2xl active:scale-95"
              title="View Details"
            >
              <Eye className="h-6 w-6" />
            </button>
            <button
              onClick={handleShare}
              className="bg-white text-gray-900 rounded-full p-4 hover:bg-slate-600 hover:text-white transition-all duration-300 transform hover:scale-125 shadow-xl hover:shadow-2xl active:scale-95"
              title="Share Product"
            >
              <Share2 className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Discount Badge - Professional */}
        {discount > 0 && (
          <span className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-black px-3 py-2 rounded-full shadow-lg animate-scale-in hover:scale-110 transition-transform duration-300 uppercase tracking-widest">
            -{discount}%
          </span>
        )}

        {/* Stock Status - More prominent */}
        {product.stockCount <= 5 && product.stockCount > 0 && (
          <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg animate-pulse-soft uppercase tracking-wider">
            ⚡ {product.stockCount} left
          </span>
        )}

        {/* Wishlist Button - Enhanced */}
        <button
          onClick={handleWishlist}
          className={`absolute bottom-6 right-6 p-3.5 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 transform hover:scale-125 shadow-lg active:scale-95 ${
            isWishlisting ? "scale-125 animate-rotate-in" : ""
          } ${wishlisted ? "ring-2 ring-red-500 ring-offset-2 dark:ring-offset-slate-800" : ""}`}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-5 w-5 transition-all duration-300 ${
              wishlisted ? "fill-red-500 text-red-500 scale-125" : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>
      </Link>

      {/* Info Section - Enhanced */}
      <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-700/50">
        <Link to={`/product/${product.id}`} className="block group/link">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest mb-2 group-hover/link:text-slate-700 dark:group-hover/link:text-slate-300 transition-colors">
            {product.brand}
          </p>
          <h3 className="font-bold text-base line-clamp-2 text-gray-900 dark:text-white group-hover/link:text-slate-600 dark:group-hover/link:text-slate-400 transition-colors duration-300 h-10 leading-tight" style={{fontFamily: "'Poppins', sans-serif"}}>
            {product.name}
          </h3>
        </Link>

        {/* Price Section - More attractive */}
        <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
          <span className="text-2xl font-black text-gray-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through font-semibold">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              <span className="text-xs font-bold text-white bg-gradient-to-r from-slate-600 to-gray-700 px-2.5 py-1 rounded-full uppercase tracking-wide shadow-md">{discount}% OFF</span>
            </>
          )}
        </div>

        {/* Features Preview - Better styling */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {product.features.slice(0, 2).map((feature, idx) => (
              <span 
                key={idx} 
                className="text-xs bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-900/40 dark:to-gray-900/40 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full font-semibold border border-slate-200 dark:border-slate-700/50 hover:scale-105 transition-transform duration-300"
              >
                ✓ {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons - Professional */}
        <div className="mt-auto pt-4 space-y-3">
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl"
          >
            <Zap className="h-4 w-4" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
