// Example: Updated Checkout.tsx with Real Email Service

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Copy, Check } from "lucide-react";

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface UseCartReturn {
  items: CartItem[];
  totalPrice: number;
  clearCart: () => void;
}

// Note: Replace with actual useCart import
const useCart = (): UseCartReturn => ({
  items: [],
  totalPrice: 0,
  clearCart: () => {},
});

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "", phone: "" });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [copiedTrackingId, setCopiedTrackingId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const shipping = totalPrice > 4150 ? 0 : 497;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shipping + tax;

  // For Vite projects, use: const apiUrl = (import.meta.env as any).VITE_API_URL || "http://localhost:5000";
  const apiUrl = "http://localhost:5000";

  const generateTrackingId = () => {
    const prefix = "STM";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const sendEmailConfirmation = async (
    email: string,
    trackingId: string,
    customerName: string,
    totalAmount: number
  ) => {
    try {
      const response = await fetch(`${apiUrl}/api/email/send-order-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          trackingId,
          customerName,
          orderDetails: {
            totalAmount: `₹${Math.round(total).toLocaleString('en-IN')}`,
            itemCount: items.length,
            orderDate: new Date().toLocaleDateString('en-IN'),
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`✅ Confirmation email sent to ${email}`);
        return true;
      } else {
        toast.error(`❌ ${data.message || "Failed to send email"}`);
        return false;
      }
    } catch (error) {
      console.error("Email error:", error);
      toast.error("Failed to send confirmation email. Please try again.");
      return false;
    }
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email) {
      toast.error("Email address is required");
      return;
    }

    setIsLoading(true);

    try {
      const newTrackingId = generateTrackingId();
      setTrackingId(newTrackingId);

      // Send email confirmation
      const emailSent = await sendEmailConfirmation(
        form.email,
        newTrackingId,
        form.name,
        total
      );

      if (!emailSent) {
        setIsLoading(false);
        return;
      }

      // Store order in localStorage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push({
        id: newTrackingId,
        date: new Date().toISOString(),
        customer: form.name,
        email: form.email,
        amount: total,
        status: "Processing",
        items: items,
      });
      localStorage.setItem("orders", JSON.stringify(orders));

      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopiedTrackingId(true);
    toast.success("Tracking ID copied!");
    setTimeout(() => setCopiedTrackingId(false), 2000);
  };

  const handleContinue = () => {
    navigate("/orders");
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <div className="bg-card border-2 border-success rounded-lg p-8 text-center mb-6">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Placed Successfully! 🎉</h1>
            <p className="text-muted-foreground mb-6">Thank you for shopping with StoreMX</p>

            {/* Tracking ID Section */}
            <div className="bg-secondary rounded-lg p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Your Tracking ID</p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-2xl font-bold text-primary">{trackingId}</code>
                <button
                  onClick={copyTrackingId}
                  className="p-2 rounded-md bg-primary/20 hover:bg-primary/30 transition-colors"
                  title="Copy Tracking ID"
                >
                  {copiedTrackingId ? (
                    <Check className="h-5 w-5 text-success" />
                  ) : (
                    <Copy className="h-5 w-5 text-primary" />
                  )}
                </button>
              </div>
            </div>

            {/* Email Confirmation Section */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6 text-left">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Order Confirmation Email Sent ✅</h3>
                  <p className="text-sm text-muted-foreground">
                    A detailed confirmation email with your tracking ID has been sent to <span className="font-medium text-foreground">{form.email}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    📬 Check your inbox and spam folder
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-secondary/50 rounded-lg p-6 mb-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer Name:</span>
                <span className="font-medium">{form.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-medium text-lg">₹{Math.round(total).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-success">Processing</span>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
            >
              View Your Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={handleOrder} className="space-y-4">
          <h2 className="font-semibold text-lg">Shipping & Contact Information</h2>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Email Address *</label>
            <input
              type="email"
              required
              placeholder="your.email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-1">📧 We'll send your order confirmation here</p>
          </div>

          {/* Other Fields */}
          {(["name", "address", "city", "zip", "phone"] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1.5 capitalize">
                {field === "zip" ? "ZIP Code" : field === "name" ? "Full Name" : field} *
              </label>
              <input
                type="text"
                required
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full px-4 py-2.5 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
          >
            {isLoading ? "Processing..." : `Place Order — ₹${Math.round(total).toLocaleString('en-IN')}`}
          </button>
        </form>

        <div className="bg-card border border-border rounded-lg p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item: CartItem) => {
              const { product, quantity } = item;
              return (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{product.name} × {quantity}</span>
                <span>₹{Math.round(product.price * quantity).toLocaleString('en-IN')}</span>
              </div>
            );
            })}
          </div>
          <div className="border-t border-border pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{Math.round(totalPrice).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-success">{shipping === 0 ? "FREE" : `₹${Math.round(shipping).toLocaleString('en-IN')}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>₹{Math.round(tax).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
              <span>Total</span>
              <span>₹{Math.round(total).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
