import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import { toast } from "sonner";
import { Mail, Copy, Check, Banknote, CreditCard, Smartphone } from "lucide-react";
import { validateCheckoutForm } from "@/lib/validation";
import Logger from "@/lib/logger";
import { getErrorMessage } from "@/lib/errors";
import { sendOrderConfirmationEmail } from "@/lib/emailjs";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
    paymentMethod: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showNotification, setShowNotification] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [copiedTrackingId, setCopiedTrackingId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoRedirectTimer, setAutoRedirectTimer] = useState<NodeJS.Timeout | null>(null);

  // Redirect to cart if cart is empty (useEffect to avoid setState during render)
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (autoRedirectTimer) {
        clearTimeout(autoRedirectTimer);
      }
    };
  }, [autoRedirectTimer]);

  const shipping = totalPrice > 4150 ? 0 : 497;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shipping + tax;

  const generateTrackingId = (): string => {
    const prefix = "ZS";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const sendEmailConfirmation = async (
    email: string,
    trackingId: string,
    customerName: string
  ): Promise<boolean> => {
    try {
      // Calculate estimated delivery (5 days from now)
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

      const result = await sendOrderConfirmationEmail({
        to_email: email,
        customer_name: customerName,
        tracking_id: trackingId,
        order_date: new Date().toLocaleDateString("en-IN"),
        total_amount: Math.round(total).toLocaleString("en-IN"),
        item_count: items.length,
        estimated_delivery: estimatedDelivery.toLocaleDateString("en-IN"),
        order_items: items
          .map((item) => `${item.product.name} x${item.quantity}`)
          .join(", "),
      });

      if (result.success) {
        toast.success(`✅ Confirmation email sent to ${email}`);
        Logger.info(`Order confirmation email sent via EmailJS: ${email}`);
        return true;
      } else {
        throw new Error(result.error || "Failed to send email");
      }
    } catch (error) {
      const message = getErrorMessage(error);
      Logger.error("EmailJS sending error", error);
      toast.error(`❌ Could not send email: ${message}`);
      return false;
    }
  };

  const handleOrder = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setValidationErrors({});
    setLoading(true);

    try {
      // Check if user is authenticated
      if (!user || !user.email) {
        toast.error("❌ Please log in to place an order");
        navigate("/login");
        return;
      }

      // Validate form
      const validation = validateCheckoutForm(form);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        toast.error("❌ Please fix the errors below");
        return;
      }

      const newTrackingId = generateTrackingId();
      setTrackingId(newTrackingId);

      // Send email confirmation to authenticated user's email
      await sendEmailConfirmation(user.email, newTrackingId, user.name);

      // Store order in localStorage (for persistence)
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push({
        id: newTrackingId,
        date: new Date().toISOString(),
        customer: user.name,
        email: user.email,
        amount: total,
        paymentMethod: form.paymentMethod,
        status: "Processing",
        items: items,
      });
      localStorage.setItem("orders", JSON.stringify(orders));

      Logger.info(`Order placed: ${newTrackingId}`);
      
      // Show success notification with toast
      toast.success("🎉 Order placed successfully!", {
        description: `Tracking ID: ${newTrackingId}`,
        duration: 5000,
      });

      // Add notification to inbox
      addNotification({
        type: "order",
        title: "Order Confirmed! 🎉",
        description: `Your order #${newTrackingId} has been placed successfully`,
        orderId: newTrackingId,
        orderData: {
          trackingId: newTrackingId,
          date: new Date().toISOString(),
          customer: user.name,
          email: user.email,
          phone: form.phone,
          amount: total,
          items: items,
          paymentMethod: form.paymentMethod,
          status: "Processing",
        },
      });
      
      // Show modal notification
      setShowNotification(true);
      
      // Auto-redirect to orders page after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
        navigate("/orders");
      }, 5000);
      
      setAutoRedirectTimer(timer);
      clearCart();
    } catch (error) {
      Logger.error("Order placement failed", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyTrackingId = (): void => {
    navigator.clipboard.writeText(trackingId);
    setCopiedTrackingId(true);
    toast.success("📋 Tracking ID copied!");
    setTimeout(() => setCopiedTrackingId(false), 2000);
  };

  const handleContinue = (): void => {
    navigate("/orders");
  };

  const dismissNotification = (): void => {
    // Clear any pending auto-redirect timer
    if (autoRedirectTimer) {
      clearTimeout(autoRedirectTimer);
      setAutoRedirectTimer(null);
    }
    setShowNotification(false);
  };

  const handleViewOrder = (): void => {
    dismissNotification();
    navigate("/orders");
  };

  // Don't render if cart is empty (redirect handled by useEffect)
  if (items.length === 0) {
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Card */}
            <div className="animate-scale-in bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 rounded-3xl p-8 md:p-12 text-center mb-6 shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Check className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                Order Placed! 🎉
              </h1>
              <p className="text-slate-700 dark:text-slate-300 text-lg mb-8">
                Thank you for shopping with storeMX
              </p>

              {/* Tracking ID Section */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 animate-slide-up">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 font-medium">
                  Your Tracking ID
                </p>
                <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl p-4">
                  <code className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    {trackingId}
                  </code>
                  <button
                    onClick={copyTrackingId}
                    className="p-3 rounded-lg bg-slate-600 hover:bg-slate-700 transition-all duration-300 transform hover:scale-110 text-white shadow-lg"
                    title="Copy Tracking ID"
                  >
                    {copiedTrackingId ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Email Confirmation Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-6 mb-6 text-left animate-slide-up" style={{ animationDelay: "100ms" }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-600 rounded-lg text-white flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Confirmation Email Sent</h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      A detailed confirmation with your tracking ID has been sent to <span className="font-semibold text-slate-700 dark:text-slate-400">{user?.email}</span>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                      ✅ Check your inbox and spam folder • 📦 You can track your order anytime
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid md:grid-cols-3 gap-4 mb-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                  <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Order Date</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                  <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Customer</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">{user?.name}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                  <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Status</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Processing</p>
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-gradient-to-r from-slate-600 to-gray-700 rounded-2xl p-6 mb-8 text-white animate-slide-up" style={{ animationDelay: "300ms" }}>
                <p className="text-slate-200 mb-2">Total Amount Paid</p>
                <p className="text-4xl font-bold">₹{Math.round(total).toLocaleString('en-IN')}</p>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white py-3 md:py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
              >
                📦 View Your Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Order Success Notification Modal - Desktop Only */}
      {showNotification && (
        <>
          <div className="notification-overlay hidden md:block"></div>
          <div className="notification-modal hidden md:block">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl max-w-md">
              {/* Celebration Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 celebration-icon shadow-lg">
                <span className="text-5xl">🎉</span>
              </div>
              
              {/* Success Message */}
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-3">
                Order Placed!
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-base">
                Your order has been successfully placed. We're preparing your items for shipment.
              </p>
              
              {/* Tracking ID Preview */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">YOUR TRACKING ID</p>
                <code className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-gray-700">
                  {trackingId}
                </code>
              </div>
              
              {/* Email Sent Info */}
              <div className="bg-slate-50 dark:bg-slate-900/20 rounded-lg p-4 mb-6 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  ✉️ Confirmation email sent to <span className="font-semibold">{user?.email}</span>
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleViewOrder}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  📦 View Order Details
                </button>
                <button
                  onClick={dismissNotification}
                  className="w-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white py-3 rounded-xl font-bold transition-all duration-300"
                >
                  Dismiss
                </button>
              </div>
              
              {/* Auto-redirect message */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                Redirecting in 5 seconds...
              </p>
            </div>
          </div>
        </>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight" style={{fontFamily: "'Poppins', sans-serif"}}>🛒 Checkout</h1>
          <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">Complete your order and get it shipped to you</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <form onSubmit={handleOrder} className="lg:col-span-2 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-slate-700 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                📋 Shipping & Contact Information
              </h2>
              
              <div className="space-y-6">
                {/* Email Field */}
                <div className="animate-scale-in" style={{ animationDelay: "0ms" }}>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none transition-all duration-300 ${
                      validationErrors.email
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 dark:border-slate-600 focus:border-slate-500"
                    }`}
                  />
                  {validationErrors.email ? (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">❌ {validationErrors.email}</p>
                  ) : (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">💌 We'll send your order confirmation here</p>
                  )}
                </div>

                {/* Name */}
                <div className="animate-scale-in" style={{ animationDelay: "50ms" }}>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none transition-all duration-300 ${
                      validationErrors.name
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 dark:border-slate-600 focus:border-slate-500"
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">❌ {validationErrors.name}</p>
                  )}
                </div>

                {/* Address */}
                <div className="animate-scale-in" style={{ animationDelay: "100ms" }}>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123 Main Street"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none transition-all duration-300 ${
                      validationErrors.address
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 dark:border-slate-600 focus:border-slate-500"
                    }`}
                  />
                  {validationErrors.address && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">❌ {validationErrors.address}</p>
                  )}
                </div>

                {/* City, ZIP, Phone */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="animate-scale-in" style={{ animationDelay: "150ms" }}>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="New York"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none transition-all duration-300 ${
                        validationErrors.name
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 dark:border-slate-600 focus:border-slate-500"
                      }`}
                    />
                    {validationErrors.city && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">❌ {validationErrors.city}</p>
                    )}
                  </div>

                  <div className="animate-scale-in" style={{ animationDelay: "200ms" }}>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="10001"
                      value={form.zip}
                      onChange={(e) => setForm({ ...form, zip: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none transition-all duration-300 ${
                        validationErrors.email
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 dark:border-slate-600 focus:border-slate-500"
                      }`}
                    />
                    {validationErrors.zip && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">❌ {validationErrors.zip}</p>
                    )}
                  </div>

                  <div className="animate-scale-in" style={{ animationDelay: "250ms" }}>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="555-0123"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none transition-all duration-300 ${
                        validationErrors.phone
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 dark:border-slate-600 focus:border-slate-500"
                      }`}
                    />
                    {validationErrors.phone && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">❌ {validationErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="animate-scale-in mt-8 pt-8 border-t-2 border-gray-200 dark:border-slate-700" style={{ animationDelay: "300ms" }}>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-4">
                    💳 Payment Method *
                  </label>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mb-2">
                    {/* Cash on Delivery */}
                    <div
                      onClick={() => setForm({ ...form, paymentMethod: "cod" })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-center gap-3 ${
                        form.paymentMethod === "cod"
                          ? "border-slate-600 bg-slate-50 dark:bg-slate-900/30 shadow-lg"
                          : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${
                        form.paymentMethod === "cod"
                          ? "bg-slate-600 text-white"
                          : "bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300"
                      }`}>
                        <Banknote className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Cash on Delivery</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Pay when item arrives</p>
                      </div>
                    </div>

                    {/* Credit/Debit Card */}
                    <div
                      onClick={() => setForm({ ...form, paymentMethod: "card" })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-center gap-3 ${
                        form.paymentMethod === "card"
                          ? "border-slate-600 bg-slate-50 dark:bg-slate-900/30 shadow-lg"
                          : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${
                        form.paymentMethod === "card"
                          ? "bg-slate-600 text-white"
                          : "bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300"
                      }`}>
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Credit/Debit Card</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Visa, Mastercard, Rupay</p>
                      </div>
                    </div>

                    {/* Google Pay */}
                    <div
                      onClick={() => setForm({ ...form, paymentMethod: "gpay" })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-center gap-3 ${
                        form.paymentMethod === "gpay"
                          ? "border-slate-600 bg-slate-50 dark:bg-slate-900/30 shadow-lg"
                          : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${
                        form.paymentMethod === "gpay"
                          ? "bg-slate-600 text-white"
                          : "bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300"
                      }`}>
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Google Pay</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Fast & Secure UPI Payment</p>
                      </div>
                    </div>

                    {/* Net Banking */}
                    <div
                      onClick={() => setForm({ ...form, paymentMethod: "netbanking" })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-center gap-3 ${
                        form.paymentMethod === "netbanking"
                          ? "border-slate-600 bg-slate-50 dark:bg-slate-900/30 shadow-lg"
                          : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${
                        form.paymentMethod === "netbanking"
                          ? "bg-slate-600 text-white"
                          : "bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300"
                      }`}>
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Net Banking</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">All major banks supported</p>
                      </div>
                    </div>
                  </div>

                  {validationErrors.paymentMethod && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">❌ {validationErrors.paymentMethod}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl text-lg mt-8"
                >
                  {loading ? "⏳ Processing..." : "✅ Place Order"}
                </button>
              </div>
            </div>
          </form>

          {/* Order Summary */}
          <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-slate-700 shadow-lg sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                📦 Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                {items.map(({ product, quantity }, idx) => (
                  <div key={product.id} className="flex justify-between pb-3 border-b border-gray-200 dark:border-slate-700 animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Qty: {quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white text-right">₹{Math.round(product.price * quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t-2 border-gray-200 dark:border-slate-700 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{Math.round(totalPrice).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                    {shipping === 0 ? "FREE 🎉" : `₹${Math.round(shipping).toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{Math.round(tax).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-slate-700 pt-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-3">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">₹{Math.round(total).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 space-y-2 text-center text-xs text-gray-600 dark:text-gray-400">
                <p>🔒 100% Secure Payment • 🚚 Free Shipping on orders above ₹4,150 • ↩️ Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
