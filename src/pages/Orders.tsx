import { Package, Copy, Check, ChevronDown, ChevronUp, Truck, CheckCircle2, Clock, AlertCircle, MapPin, Box } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity?: number;
}

interface Order {
  id: string;
  date: string;
  status: string;
  amount?: number;
  total?: number;
  paymentMethod?: string;
  itemCount?: number;
  items?: OrderItem[] | string[];
  customer: string;
  email: string;
}

const statusColor: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Processing: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-800 dark:text-amber-300",
    icon: <Clock className="h-5 w-5" />,
  },
  Shipped: {
    bg: "bg-slate-100 dark:bg-slate-900/30",
    text: "text-slate-800 dark:text-slate-300",
    icon: <Truck className="h-5 w-5" />,
  },
  Delivered: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-800 dark:text-emerald-300",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
};

const paymentMethodDisplay: Record<string, { name: string; icon: string }> = {
  cod: { name: "Cash on Delivery", icon: "💵" },
  card: { name: "Credit/Debit Card", icon: "💳" },
  gpay: { name: "Google Pay", icon: "📱" },
  netbanking: { name: "Net Banking", icon: "🏦" },
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        const parsedOrders = JSON.parse(storedOrders);
        setOrders(parsedOrders);
      } catch (error) {
        console.error("Error parsing orders:", error);
      }
    }
  }, []);

  const copyTrackingId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Tracking ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const cancelOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast.success("✅ Order cancelled successfully!");
  };

  const handleCancelClick = (orderId: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Are you sure you want to cancel this order?</p>
        <p className="text-sm text-gray-600">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              cancelOrder(orderId);
              toast.dismiss(t.id);
            }}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Yes, Cancel Order
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-medium transition-colors"
          >
            No, Keep Order
          </button>
        </div>
      </div>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalAmount = (order: Order) => {
    if (typeof order.amount === 'number') return order.amount;
    if (typeof order.total === 'number') return order.total;
    return 0;
  };

  const getItemCount = (order: Order) => {
    if (order.itemCount) return order.itemCount;
    if (Array.isArray(order.items)) return order.items.length;
    return 0;
  };

  const getStatusTimeline = (status: string, orderDate: string) => {
    const baseDate = new Date(orderDate);
    
    // Estimate times for each step
    const placedDate = new Date(baseDate);
    const processingDate = new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000); // +1 day
    const shippedDate = new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000); // +2 days
    const deliveredDate = new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000); // +5 days
    
    const steps = [
      { 
        name: "Order Placed", 
        status: "Completed",
        date: placedDate,
        estimatedTime: "Today"
      },
      { 
        name: "Processing", 
        status: status === "Processing" ? "Active" : status === "Processing" || status === "Shipped" || status === "Delivered" ? "Completed" : "Pending",
        date: processingDate,
        estimatedTime: status === "Delivered" || status === "Shipped" || status === "Processing" ? processingDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : "Expected"
      },
      { 
        name: "Shipped", 
        status: status === "Shipped" ? "Active" : status === "Delivered" ? "Completed" : "Pending",
        date: shippedDate,
        estimatedTime: status === "Delivered" || status === "Shipped" ? shippedDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : "Expected"
      },
      { 
        name: "Delivered", 
        status: status === "Delivered" ? "Active" : "Pending",
        date: deliveredDate,
        estimatedTime: status === "Delivered" ? deliveredDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : "Estimated by " + deliveredDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
      },
    ];
    return steps;
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight" style={{fontFamily: "'Poppins', sans-serif"}}>My Orders</h1>
        <div className="text-center py-20 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl">
          <Package className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800 dark:text-white" style={{fontFamily: "'Poppins', sans-serif"}}>No orders yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg font-semibold">You haven't placed any orders. Start shopping now!</p>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-2 tracking-tight" style={{fontFamily: "'Poppins', sans-serif"}}>My Orders</h1>
        <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">Track and manage your orders</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-sky-300 dark:hover:border-sky-700"
          >
            {/* Order Header */}
            <div
              className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-50 via-white to-sky-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-sky-100/30 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <div>
                    <p className="font-bold text-xl text-gray-900 dark:text-white">Order #{order.id}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(order.date)}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold ${statusColor[order.status]?.bg} ${statusColor[order.status]?.text} shadow-sm`}>
                    {statusColor[order.status]?.icon}
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {getItemCount(order)} item(s) ordered
                </p>
              </div>
              <div className="flex items-center gap-6 self-start sm:self-auto">
                <div className="text-right">
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-semibold">Total Amount</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">₹{getTotalAmount(order).toLocaleString('en-IN')}</p>
                </div>
                <button className="p-2 hover:bg-sky-200/30 dark:hover:bg-sky-600/30 rounded-lg transition-colors flex-shrink-0">
                  {expandedOrder === order.id ? (
                    <ChevronUp className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedOrder === order.id && (
              <div className="p-6 sm:p-8 space-y-8 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white/50 to-sky-50/30 dark:from-gray-900 dark:to-gray-800/50">
                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-sky-600" />
                    Items Ordered
                  </h3>
                  <div className="space-y-3">
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      order.items.map((item, idx) => {
                        const itemStr = typeof item === 'string' ? item : item.name || '';
                        const quantity = typeof item === 'object' && item.quantity ? item.quantity : 1;
                        const price = typeof item === 'object' && item.price ? item.price : null;
                        
                        return (
                          <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-sky-50 to-sky-100/50 dark:from-sky-900/20 dark:to-sky-800/10 rounded-xl border border-sky-200 dark:border-sky-700/50 hover:border-sky-400 dark:hover:border-sky-600 transition-all hover:shadow-md">
                            {/* Product Icon */}
                            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                              <Package className="w-6 h-6 text-white" />
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-base text-gray-900 dark:text-white truncate">{itemStr}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">✓ Product in Order</p>
                              {price && (
                                <p className="text-sm font-semibold text-sky-600 dark:text-sky-400 mt-2">₹{price.toLocaleString('en-IN')}</p>
                              )}
                            </div>
                            
                            {/* Quantity Badge */}
                            {quantity && (
                              <div className="flex-shrink-0 text-right">
                                <span className="inline-block px-3 py-1 bg-sky-600 text-white rounded-full text-xs font-bold">
                                  Qty: {quantity}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">No item details available</p>
                    )}
                  </div>
                </div>

                {/* 2-Column Layout for Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-4 bg-sky-600 rounded"></div>
                      Customer Details
                    </h3>
                    <div className="space-y-3 bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-900/20 dark:to-sky-800/10 p-5 rounded-xl border border-sky-200 dark:border-sky-700/50">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Name</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-base mt-1">{order.customer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Email</p>
                        <p className="font-semibold text-gray-900 dark:text-white break-all text-sm mt-1">{order.email}</p>
                      </div>
                      {order.paymentMethod && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Payment Method</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-base mt-1">
                            {paymentMethodDisplay[order.paymentMethod]?.icon} {paymentMethodDisplay[order.paymentMethod]?.name || order.paymentMethod}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tracking ID */}
                  <div>
                    <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-4 bg-sky-600 rounded"></div>
                      Tracking Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-4 border border-sky-300 dark:border-sky-600 shadow-lg">
                        <code className="flex-1 font-mono text-sm font-bold text-white" title={order.id}>{order.id}</code>
                        <button
                          onClick={() => copyTrackingId(order.id)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                          title="Copy Tracking ID"
                        >
                          {copiedId === order.id ? (
                            <Check className="h-5 w-5 text-white" />
                          ) : (
                            <Copy className="h-5 w-5 text-white" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">📧 Confirmation sent to {order.email}</p>
                    </div>
                  </div>
                </div>

                {/* Order Status Timeline */}
                <div>
                  <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1 h-4 bg-sky-600 rounded"></div>
                    Order Progress Timeline
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    {/* Timeline Header with progress bar */}
                    <div className="mb-8">
                      <div className="flex justify-between items-end mb-3">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Estimated Delivery</p>
                        <p className="text-lg font-bold text-sky-600 dark:text-sky-400">
                          {new Date(order.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} → {new Date(new Date(order.date).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      {/* Progress Bar */}
                      <div className="relative h-3 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{
                            width: order.status === "Delivered" ? "100%" : order.status === "Shipped" ? "70%" : order.status === "Processing" ? "40%" : "15%"
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {order.status === "Delivered" ? "✓ Order completed" : order.status === "Shipped" ? "📦 On the way to you" : order.status === "Processing" ? "⏳ Getting ready to ship" : "📋 Order confirmed"}
                      </p>
                    </div>

                    {/* Timeline Steps - Horizontal View */}
                    <div className="hidden md:block">
                      <div className="relative mb-12">
                        {/* Connection Line */}
                        <div className="absolute top-7 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-400 to-gray-300 dark:from-emerald-600 dark:via-emerald-600 dark:to-gray-600 rounded-full" style={{
                          width: order.status === "Delivered" ? "100%" : order.status === "Shipped" ? "70%" : order.status === "Processing" ? "40%" : "15%"
                        }}></div>
                        
                        {/* Timeline Nodes */}
                        <div className="flex justify-between">
                          {getStatusTimeline(order.status, order.date).map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center flex-1">
                              {/* Circle Node */}
                              <div
                                className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg transition-all shadow-lg relative z-20 border-4 ${
                                  step.status === "Completed"
                                    ? "bg-emerald-500 dark:bg-emerald-600 text-white border-emerald-600 dark:border-emerald-700"
                                    : step.status === "Active"
                                    ? "bg-sky-500 dark:bg-sky-600 text-white border-sky-600 dark:border-sky-700 ring-4 ring-sky-300 dark:ring-sky-500 scale-125"
                                    : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {step.status === "Completed" ? (
                                  <Check className="w-7 h-7" />
                                ) : step.status === "Active" ? (
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                ) : idx === 0 ? (
                                  <CheckCircle2 className="w-7 h-7" />
                                ) : idx === 1 ? (
                                  <Box className="w-7 h-7" />
                                ) : idx === 2 ? (
                                  <Truck className="w-7 h-7" />
                                ) : (
                                  <MapPin className="w-7 h-7" />
                                )}
                              </div>
                              
                              {/* Step Label and Date */}
                              <div className="text-center mt-4">
                                <p className={`font-bold text-sm transition-colors ${
                                  step.status === "Active" 
                                    ? "text-sky-600 dark:text-sky-400" 
                                    : step.status === "Completed"
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}>
                                  {step.name}
                                </p>
                                <p className={`text-xs font-medium mt-1 ${
                                  step.status === "Active"
                                    ? "text-sky-500 dark:text-sky-400"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}>
                                  {step.estimatedTime}
                                </p>
                                {step.status === "Active" && (
                                  <div className="mt-2 flex items-center justify-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></div>
                                    <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">In Progress</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Timeline Steps - Vertical View (Mobile) */}
                    <div className="md:hidden space-y-0">
                      {getStatusTimeline(order.status, order.date).map((step, idx) => (
                        <div key={idx}>
                          <div className="flex items-start gap-4 py-5 relative">
                            {/* Timeline Connector */}
                            {idx < 3 && (
                              <div className="absolute left-[23px] top-16 w-1 h-12 rounded-full" style={{
                                background: step.status === "Completed" ? "rgb(16, 185, 129)" : step.status === "Active" ? "rgb(59, 130, 246)" : "rgb(209, 213, 219)"
                              }}></div>
                            )}

                            {/* Timeline Circle */}
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg transition-all shadow-md relative z-10 border-2 ${
                                step.status === "Completed"
                                  ? "bg-emerald-500 dark:bg-emerald-600 text-white border-emerald-600 dark:border-emerald-700"
                                  : step.status === "Active"
                                  ? "bg-sky-500 dark:bg-sky-600 text-white border-sky-600 dark:border-sky-700 ring-4 ring-sky-300 dark:ring-sky-500 scale-110"
                                  : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {step.status === "Completed" ? (
                                <Check className="w-6 h-6" />
                              ) : step.status === "Active" ? (
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                              ) : idx === 0 ? (
                                <CheckCircle2 className="w-6 h-6" />
                              ) : idx === 1 ? (
                                <Box className="w-6 h-6" />
                              ) : idx === 2 ? (
                                <Truck className="w-6 h-6" />
                              ) : (
                                <MapPin className="w-6 h-6" />
                              )}
                            </div>
                            
                            {/* Step Details */}
                            <div className="flex-1 pt-1">
                              <p className={`font-bold text-base transition-colors ${
                                step.status === "Active" 
                                  ? "text-sky-600 dark:text-sky-400" 
                                  : step.status === "Completed"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}>
                                {step.name}
                              </p>
                              <p className={`text-xs font-medium mt-1 ${
                                step.status === "Active"
                                  ? "text-sky-500 dark:text-sky-400"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}>
                                {step.estimatedTime}
                              </p>
                              {step.status === "Active" && (
                                <div className="mt-2 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                                  <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">In Progress...</p>
                                </div>
                              )}
                            </div>

                            {/* Status Badge */}
                            <div className="text-right pt-1">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                step.status === "Completed"
                                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                  : step.status === "Active"
                                  ? "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 ring-1 ring-sky-400"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                              }`}>
                                {step.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Timeline Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                        <div className="p-3 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-gray-600 dark:text-gray-400 font-semibold">Order Date</p>
                          <p className="font-bold text-gray-900 dark:text-white mt-1">{new Date(order.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-gray-600 dark:text-gray-400 font-semibold">Processing</p>
                          <p className="font-bold text-gray-900 dark:text-white mt-1">1-2 Days</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-gray-600 dark:text-gray-400 font-semibold">In Transit</p>
                          <p className="font-bold text-gray-900 dark:text-white mt-1">2-3 Days</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-sky-100 to-sky-50 dark:from-sky-900/30 dark:to-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-700/50">
                          <p className="text-sky-600 dark:text-sky-400 font-semibold">Est. Delivery</p>
                          <p className="font-bold text-sky-700 dark:text-sky-300 mt-1">{new Date(new Date(order.date).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => toast.success("Order details sent to email!")}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    📧 Email Invoice
                  </button>
                  <Link
                    to="/products"
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors text-center"
                  >
                    🛍️ Shop Again
                  </Link>
                  {order.status !== "Delivered" && (
                    <button
                      onClick={() => handleCancelClick(order.id)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      ✕ Cancel Order
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
