import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Minus, Plus, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { productService, Product } from "@/lib/productService";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) throw new Error("Product ID is required");
        
        const fetchedProduct = await productService.getProductById(id);
        setProduct(fetchedProduct);

        // Fetch related products
        const related = await productService.getProductsByCategory(fetchedProduct.category);
        setRelatedProducts(related.filter((p) => p.id !== fetchedProduct.id).slice(0, 4));
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-8xl mb-6 opacity-40">⏳</div>
        <h1 className="text-2xl font-bold mb-4">Loading product...</h1>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-8xl mb-6 opacity-40">❌</div>
        <h1 className="text-2xl font-bold mb-4">{error || "Product not found"}</h1>
        <Link to="/products" className="text-primary hover:underline">Back to products</Link>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 dark:text-gray-400 mb-8 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium line-clamp-2">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div className="animate-scale-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden aspect-square mb-6 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow group">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-slate-600 to-gray-700 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  {discount}% OFF
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg flex-shrink-0 ${
                      selectedImage === i
                        ? "border-primary shadow-lg shadow-primary/50"
                        : "border-gray-200 dark:border-slate-700 hover:border-primary"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="animate-slide-up">
            <p className="text-base font-bold text-slate-600 dark:text-slate-400 upper mb-2 tracking-wide">{product.brand}</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white leading-tight tracking-tight" style={{fontFamily: "'Poppins', sans-serif"}}>{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 font-bold px-3 py-1.5 rounded-full text-sm shadow-lg">
                <Star className="h-4 w-4 fill-current" />
                {product.rating}
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {product.reviewCount.toLocaleString()} verified ratings
              </span>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-100 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl p-6 mb-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💰 Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} on this item
              </p>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-lg">{product.description}</p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">✨ Key Features</h3>
              <ul className="space-y-2 grid sm:grid-cols-2 gap-4">
                {product.features.map((f) => (
                  <li key={f} className="text-gray-700 dark:text-gray-300 flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stock Status */}
            <div className={`inline-flex items-center gap-2 font-semibold mb-8 px-4 py-2 rounded-lg ${
              product.inStock
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            }`}>
              <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-600" : "bg-red-600"}`} />
              {product.inStock ? `In Stock (${product.stockCount} available)` : "Out of Stock"}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-4">
                <label className="font-semibold text-gray-900 dark:text-white">Quantity:</label>
                <div className="flex items-center border-2 border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="px-6 py-2 font-bold text-lg text-gray-900 dark:text-white border-l border-r border-gray-300 dark:border-slate-600">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    toast.success("✅ Added to cart!");
                  }}
                  disabled={!product.inStock}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    navigate("/checkout");
                  }}
                  disabled={!product.inStock}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-lg hover:shadow-xl"
                >
                  <Zap className="h-5 w-5" />
                  Buy Now
                </button>
              </div>

              <button
                onClick={() => {
                  if (wishlisted) {
                    removeFromWishlist(product.id);
                    toast("❤️ Removed from wishlist");
                  } else {
                    addToWishlist(product);
                    toast.success("❤️ Added to wishlist!");
                  }
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all duration-300 border-2 ${
                  wishlisted
                    ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400"
                    : "bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-red-500"
                }`}
              >
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-current" : ""}`} />
                {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
              <div className="text-center">
                <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Secure</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Related Products</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <div key={p.id} className="animate-scale-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
