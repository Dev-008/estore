import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { toast } from "sonner";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = totalPrice > 4150 ? 0 : 497;
  const tax = Math.round(totalPrice * 0.08);
  const total = Math.round(totalPrice + shipping + tax - discount);

  const handleRemove = (productId: string) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeFromCart(productId);
      setRemovingId(null);
      toast.success("Item removed from cart");
    }, 300);
  };

  const applyPromoCode = () => {
    if (promoCode === "SAVE10") {
      setDiscount(Math.round(totalPrice * 0.1));
      toast.success("Promo code applied! 10% discount");
      return;
    }
    if (promoCode === "SAVE20") {
      setDiscount(Math.round(totalPrice * 0.2));
      toast.success("Promo code applied! 20% discount");
      return;
    }
    toast.error("Invalid promo code");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="bg-secondary/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Start shopping and discover amazing products!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/" className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold" style={{fontFamily: "'Poppins', sans-serif"}}>Shopping Cart</h1>
          <p className="text-muted-foreground font-semibold">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }, idx) => (
            <div
              key={product.id}
              className={`flex gap-4 bg-card border border-border rounded-lg p-4 transition-all duration-300 animate-fade-in hover:shadow-lg ${
                removingId === product.id ? "opacity-50 scale-95" : ""
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <Link to={`/product/${product.id}`} className="shrink-0 group">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              </Link>

              <div className="flex-1 min-w-0 flex flex-col">
                <Link
                  to={`/product/${product.id}`}
                  className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors"
                >
                  {product.name}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">{product.brand}</p>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-bold text-lg">₹{product.price.toLocaleString("en-IN")}</span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-3">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-secondary transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 text-sm font-bold">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-3 py-2 hover:bg-secondary transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(product.id)}
                    className="text-deal hover:text-deal/80 font-medium text-sm flex items-center gap-1.5 hover:bg-deal/10 px-3 py-2 rounded transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4 animate-slide-up">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{Math.round(totalPrice).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-success font-bold" : ""}>
                    {shipping === 0 ? "FREE 🎉" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (est.)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success font-bold">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="border-t border-primary/20 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="bg-background rounded-lg p-3 border border-border mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <label className="text-xs font-semibold text-muted-foreground">Promo Code</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="SAVE10, SAVE20"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={!promoCode}
                    className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-sm font-semibold rounded-lg disabled:opacity-50 transition-all duration-300"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Proceed to Checkout
              </Link>
            </div>

            {/* Suggestions */}
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">👉 Orders above ₹4,150 get free shipping!</p>
              <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-success h-full transition-all duration-500"
                  style={{ width: `${Math.min((totalPrice / 4150) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {totalPrice >= 4150 ? "✅ Free shipping unlocked!" : `Add ₹${Math.round(4150 - totalPrice)} more for free shipping`}
              </p>
            </div>

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="block text-center text-sm text-primary font-semibold mt-3 hover:gap-1 flex items-center justify-center group transition-all duration-300"
            >
              Continue Shopping
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
