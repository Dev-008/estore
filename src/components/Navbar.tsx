import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Search, User, Menu, X, Package, LogOut, Settings, ChevronDown, Bell } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import { useState } from "react";
import { categories } from "@/data/products";
import InboxNotifications from "./InboxNotifications";

const Navbar = () => {
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const navigate = useNavigate();
  const hasAdminToken = !!localStorage.getItem("adminToken");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main Nav */}
      <div className="bg-nav text-nav-foreground w-full">
        <div className="w-full px-4 md:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/" className="text-2xl md:text-3xl font-bold text-white shrink-0 tracking-tight">
              StoreMX
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="flex w-full rounded-md overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands and more..."
                  className="flex-1 px-4 py-2 text-foreground bg-background text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-1 ml-auto relative">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    to="/orders"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-nav-secondary transition-colors text-sm font-medium"
                  >
                    <Package className="h-4 w-4" />
                    Orders
                  </Link>
                  {user?.isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-nav-secondary transition-colors text-sm font-medium text-orange-500 hover:text-orange-600"
                    >
                      ⚙️ Admin
                    </Link>
                  )}
                  {hasAdminToken && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-nav-secondary transition-colors text-sm font-medium text-sky-500 font-bold hover:text-sky-600"
                    >
                      🔧 Admin Panel
                    </Link>
                  )}
                  
                  {/* User Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-nav-secondary transition-colors text-sm font-medium"
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden lg:inline">{user?.name}</span>
                      <svg
                        className={`h-4 w-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                        
                        <Link
                          to="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>

                        {user?.isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                          >
                            <Settings className="h-4 w-4" />
                            Admin Dashboard (User)
                          </Link>
                        )}

                        {hasAdminToken && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-sky-600 dark:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors font-semibold"
                          >
                            <Settings className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        )}

                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-nav-secondary transition-colors text-sm font-medium"
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
              )}
              <Link
                to="/wishlist"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-nav-secondary transition-colors text-sm"
              >
                <Heart className="h-5 w-5" />
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => setInboxOpen(!inboxOpen)}
                  className="relative flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-nav-secondary transition-colors text-sm"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              )}
              <Link
                to="/cart"
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-nav-secondary transition-colors text-sm"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
                <span className="hidden md:inline">Cart</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-nav-secondary"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden mt-3">
            <div className="flex w-full rounded-md overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 text-foreground bg-background text-sm focus:outline-none"
              />
              <button type="submit" className="px-4 bg-primary text-primary-foreground">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Category Bar with Dropdown Menu */}
      <div className="bg-nav-secondary text-nav-foreground border-b border-nav w-full">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-0">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesMenuOpen(!categoriesMenuOpen)}
                className="flex items-center gap-2 px-4 py-3 hover:bg-nav rounded-md transition-colors whitespace-nowrap font-medium text-sm"
              >
                <Menu className="h-4 w-4" />
                Categories
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${categoriesMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {categoriesMenuOpen && (
                <div className="absolute left-0 mt-0 w-56 bg-white dark:bg-gray-900 shadow-xl rounded-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
                  <Link
                    to="/products"
                    onClick={() => setCategoriesMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700"
                  >
                    <span className="text-lg">🏪</span>
                    <span className="text-gray-900 dark:text-white font-medium">All Products</span>
                  </Link>
                  
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/products?category=${category.id}`}
                      onClick={() => setCategoriesMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                    >
                      <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{category.id === 'electronics' ? '📱' : category.id === 'fashion' ? '👕' : category.id === 'home' ? '🏠' : category.id === 'books' ? '📚' : category.id === 'sports' ? '🏆' : '✨'}</span>
                      <div className="flex-1">
                        <div className="text-gray-900 dark:text-white font-medium text-sm">{category.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{category.productCount.toLocaleString()} products</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Other category links for larger screens */}
            <div className="hidden lg:flex items-center gap-1 flex-1 ml-2 border-l border-nav pl-2">
              <Link to="/products" className="px-3 py-3 hover:bg-nav rounded-md transition-colors whitespace-nowrap text-xs font-medium">All</Link>
              {categories.map((cat) => (
                <Link 
                  key={cat.id}
                  to={`/products?category=${cat.id}`} 
                  className="px-3 py-3 hover:bg-nav rounded-md transition-colors whitespace-nowrap text-xs font-medium"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-nav text-nav-foreground border-t border-nav-secondary w-full">
          <div className="w-full px-4 md:px-6 lg:px-8 py-4 space-y-2">
            {/* Mobile Categories Section */}
            <div className="border-b border-nav-secondary pb-4 mb-4">
              <h3 className="px-3 py-2 font-bold text-sm text-gray-500 uppercase tracking-wider">Categories</h3>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md hover:bg-nav-secondary text-sm transition-colors"
              >
                🏪 All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md hover:bg-nav-secondary text-sm transition-colors"
                >
                  <span className="mr-2">{cat.id === 'electronics' ? '📱' : cat.id === 'fashion' ? '👕' : cat.id === 'home' ? '🏠' : cat.id === 'books' ? '📚' : cat.id === 'sports' ? '🏆' : '✨'}</span>
                  {cat.name}
                </Link>
              ))}
            </div>

            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 bg-nav-secondary rounded-md mb-2">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-nav-secondary text-sm">
                  <Package className="h-4 w-4" />
                  My Orders
                </Link>
                {user?.isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-nav-secondary text-sm text-orange-500">
                    <Settings className="h-4 w-4" />
                    Admin Panel (User)
                  </Link>
                )}
                {hasAdminToken && (
                  <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-nav-secondary text-sm text-sky-500 font-semibold">
                    <Settings className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-red-500/10 text-red-600 text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-nav-secondary text-sm">Login / Register</Link>
            )}
          </div>
        </div>
      )}

      {/* Inbox Modal */}
      {inboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setInboxOpen(false)}></div>
          <div className="relative z-[101]">
            <InboxNotifications onClose={() => setInboxOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
