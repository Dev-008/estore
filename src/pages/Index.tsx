import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { categories } from "@/data/products";
import categoryElectronics from "@/assets/category-electronics.jpg";
import categoryFashion from "@/assets/category-fashion.jpg";
import categoryHome from "@/assets/category-home.jpg";
import * as Icons from "lucide-react";
import { useState, useEffect } from "react";
import { productService, Product } from "@/lib/productService";

const getIconComponent = (iconName: string) => {
  return (Icons as Record<string, React.ComponentType<{ className?: string }>>)[iconName] || null;
};

const categoryImages: Record<string, string> = {
  electronics: categoryElectronics,
  fashion: categoryFashion,
  home: categoryHome,
};

const Index = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts({ limit: 100 });
        const products = response.data;
        
        // Featured products (highest rated)
        const featuredProds = [...products]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4);
        setFeatured(featuredProds);
        
        // Trending products (most reviews)
        const trendingProds = [...products]
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, 4);
        setTrending(trendingProds);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      <HeroBanner />

      {/* Categories */}
      <section className={`w-full py-16 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="w-full px-4 md:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-5xl md:text-6xl font-bold mb-3 text-gray-900 dark:text-white tracking-tight" style={{fontFamily: "'Poppins', sans-serif"}}>🛍️ Shop by Category</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Explore our curated collections</p>
          </div>

          {/* Categories Grid with Enhanced Styling */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            {categories.map((cat, idx) => {
              const IconComponent = getIconComponent(cat.icon);
              const colorClasses = [
                "from-slate-600 to-slate-700",
                "from-slate-700 to-gray-700",
                "from-gray-600 to-slate-700",
                "from-slate-600 to-gray-600",
                "from-gray-700 to-slate-600",
                "from-gray-600 to-gray-700"
              ];
              const bgGradient = colorClasses[idx % colorClasses.length];

              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className={`group relative bg-gradient-to-br ${bgGradient} rounded-2xl p-6 md:p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden animate-fade-in`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Decorative Background Elements */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl -mr-16 -mt-16"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {IconComponent && (
                      <div className="mb-4 transform group-hover:scale-125 transition-transform duration-300 inline-block">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 inline-flex">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-white transition-colors tracking-wide" style={{fontFamily: "'Poppins', sans-serif"}}>{cat.name}</h3>
                    <p className="text-base font-semibold text-white/90">{cat.productCount > 0 ? `${cat.productCount} items` : "Browse now"}</p>
                    <div className="mt-4 flex items-center gap-2 text-white/80 group-hover:text-white transition-colors text-base font-bold">
                      Explore
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>

                  {/* Hover Border Animation */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/30 transition-all duration-300"></div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full px-4 md:px-6 lg:px-8 py-12 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="animate-slide-up">
            <h2 className="text-3xl font-bold">✨ Featured Products</h2>
            <p className="text-muted-foreground mt-1">Handpicked selections just for you</p>
          </div>
          <Link to="/products" className="text-sm text-primary font-semibold hover:gap-2 flex items-center group transition-all duration-300">
            Explore More
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((product, idx) => (
            <div key={product.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-slide-up">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Deal Banner */}
      <section className="w-full px-4 md:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-deal via-deal/80 to-deal/60 rounded-2xl p-8 md:p-16 text-deal-foreground overflow-hidden relative group hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10 animate-slide-up">
            <span className="inline-block bg-deal-foreground/20 text-deal-foreground px-4 py-1.5 rounded-full text-xs font-bold mb-3">
              ⚡ Limited Time Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Deal of the Day</h2>
            <p className="text-lg opacity-90 mb-6 max-w-2xl">Get up to 40% off on selected electronics. Hurry, stock is running out fast!</p>
            <Link
              to="/products?category=electronics"
              className="inline-block bg-deal-foreground text-deal px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 transform active:scale-95"
            >
              Shop Electronics Now
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="w-full px-4 md:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="animate-slide-up">
            <h2 className="text-3xl font-bold">🔥 Trending Now</h2>
            <p className="text-muted-foreground mt-1">What's hot this week</p>
          </div>
          <Link to="/products" className="text-sm text-primary font-semibold hover:gap-2 flex items-center group transition-all duration-300">
            View All
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((product, idx) => (
            <div key={product.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-slide-up">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Category Showcase */}
      <section className="w-full px-4 md:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8 animate-slide-up">Popular Categories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["electronics", "fashion", "home"].map((cat, idx) => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="relative rounded-2xl overflow-hidden group h-56 shadow-lg hover:shadow-2xl transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <img
                src={categoryImages[cat]}
                alt={cat}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6 group-hover:from-black/90 transition-all duration-300">
                <div className="transform group-hover:-translate-y-2 transition-transform duration-300">
                  <span className="text-white font-bold text-2xl capitalize block mb-2">{cat === "home" ? "Home & Kitchen" : cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                  <span className="text-white/80 text-sm">Discover trending styles →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="w-full px-4 md:px-6 lg:px-8 py-12 border-t border-border mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "Truck", title: "Free Shipping", desc: "On orders above ₹500" },
            { icon: "Shield", title: "Secure Payment", desc: "100% secure transactions" },
            { icon: "RotateCcw", title: "Easy Returns", desc: "30 days return policy" },
            { icon: "Headphones", title: "24/7 Support", desc: "Dedicated customer care" },
          ].map((badge, idx) => {
            const Icon = getIconComponent(badge.icon);
            return (
              <div key={idx} className="group animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                {Icon && <Icon className="w-10 h-10 mx-auto mb-3 text-primary group-hover:scale-125 transition-transform duration-300" />}
                <h3 className="font-bold text-sm mb-1">{badge.title}</h3>
                <p className="text-xs text-muted-foreground">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Index;
