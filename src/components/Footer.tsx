import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-nav text-nav-foreground mt-16 w-full">
    <div className="w-full px-4 md:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-primary mb-4">StoreMX</h3>
          <p className="text-sm text-muted-foreground">Your one-stop destination for everything you need. Quality products, great prices.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
            <li><Link to="/products?category=electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
            <li><Link to="/products?category=fashion" className="hover:text-primary transition-colors">Fashion</Link></li>
            <li><Link to="/products?category=home" className="hover:text-primary transition-colors">Home & Kitchen</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
            <li><Link to="/register" className="hover:text-primary transition-colors">Register</Link></li>
            <li><Link to="/orders" className="hover:text-primary transition-colors">Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span className="cursor-pointer hover:text-primary transition-colors">Help Center</span></li>
            <li><span className="cursor-pointer hover:text-primary transition-colors">Shipping Info</span></li>
            <li><span className="cursor-pointer hover:text-primary transition-colors">Returns</span></li>
            <li><span className="cursor-pointer hover:text-primary transition-colors">Contact Us</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-nav-secondary mt-8 pt-8 text-center text-sm text-muted-foreground">
        © 2026 StoreMX. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
