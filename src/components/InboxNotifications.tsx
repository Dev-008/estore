import { useNotification, NotificationMessage } from "@/contexts/NotificationContext";
import { X, Trash2, Check, FileText, Package, Truck, CheckCircle2, Calendar, Mail, Banknote, Download, AlertCircle } from "lucide-react";
import { useState } from "react";

const InboxNotifications = ({ onClose }: { onClose: () => void }) => {
  const { notifications, markAsRead, deleteNotification, markAllAsRead, clearAllNotifications } = useNotification();
  const [selectedNotification, setSelectedNotification] = useState<NotificationMessage | null>(null);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-5 w-5 text-slate-600" />;
      case "shipping":
        return <Truck className="h-5 w-5 text-orange-600" />;
      case "delivery":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700";
      case "shipping":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700";
      case "delivery":
        return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotals = (orderData: any) => {
    if (!orderData) return { subtotal: 0, tax: 0, shipping: 0, total: 0 };

    const items = orderData.items || [];
    let subtotal = 0;

    if (Array.isArray(items)) {
      items.forEach((item: any) => {
        if (typeof item === "object") {
          // Handle cart items which have item.product.price structure
          const price = item.product?.price || item.price || 0;
          const quantity = item.quantity || 1;
          subtotal += price * quantity;
        }
      });
    }

    const shipping = subtotal > 4150 ? 0 : 497;
    const tax = subtotal * 0.08;
    const total = orderData.amount || subtotal + shipping + tax;

    return { subtotal, tax, shipping, total };
  };

  const getProductName = (item: any) => {
    if (typeof item === "string") return item;
    if (item.product?.name) return item.product.name;
    if (item.name) return item.name;
    return "Product";
  };

  const downloadInvoice = (notification: NotificationMessage) => {
    const orderData = notification.orderData;
    if (!orderData) return;

    const totals = calculateTotals(orderData);
    
    // Create HTML content for invoice
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${orderData.trackingId}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
          .company-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .invoice-title { font-size: 20px; font-weight: bold; margin: 20px 0; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .totals { display: grid; grid-template-columns: 1fr 200px; gap: 20px; }
          .totals-table { border-left: 2px solid #333; padding-left: 20px; }
          .totals-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-bottom: 10px; }
          .total-amount { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; display: grid; grid-template-columns: 1fr auto; gap: 10px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company-name">📦 StoreMX</div>
            <div>E-commerce Store</div>
          </div>
          
          <div class="invoice-title">Invoice / Order Confirmation</div>
          
          <div class="grid">
            <div>
              <div class="section-title">Order Information</div>
              <div>
                <strong>Order ID:</strong> ${orderData.trackingId}<br>
                <strong>Order Date:</strong> ${new Date(orderData.date).toLocaleDateString("en-IN")}<br>
                <strong>Status:</strong> ${orderData.status}
              </div>
            </div>
            <div>
              <div class="section-title">Customer Information</div>
              <div>
                <strong>Name:</strong> ${orderData.customer}<br>
                <strong>Email:</strong> ${orderData.email}<br>
                <strong>Phone:</strong> ${orderData.phone}
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Order Items</div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${Array.isArray(orderData.items)
                  ? orderData.items
                      .map((item: any) => {
                        const productName = getProductName(item);
                        const quantity = item.quantity || 1;
                        const price = item.product?.price || item.price || 0;
                        const amount = price * quantity;
                        return `
                          <tr>
                            <td>${productName}</td>
                            <td style="text-align: center;">${quantity}</td>
                            <td style="text-align: right;">₹${price.toLocaleString("en-IN")}</td>
                            <td style="text-align: right;">₹${amount.toLocaleString("en-IN")}</td>
                          </tr>
                        `;
                      })
                      .join("")
                  : ""}
              </tbody>
            </table>
          </div>
          
          <div class="totals">
            <div></div>
            <div class="totals-table">
              <div class="totals-row">
                <span>Subtotal:</span>
                <span>₹${totals.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div class="totals-row">
                <span>Shipping:</span>
                <span>${totals.shipping === 0 ? "FREE" : `₹${totals.shipping.toLocaleString("en-IN")}`}</span>
              </div>
              <div class="totals-row">
                <span>Tax (8%):</span>
                <span>₹${Math.round(totals.tax).toLocaleString("en-IN")}</span>
              </div>
              <div class="total-amount">
                <span>Total Amount:</span>
                <span>₹${Math.round(totals.total).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Payment Details</div>
            <div>
              <strong>Payment Method:</strong> 
              ${
                orderData.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : orderData.paymentMethod === "card"
                    ? "Credit/Debit Card"
                    : orderData.paymentMethod === "gpay"
                      ? "Google Pay"
                      : "Net Banking"
              }
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with StoreMX!</p>
            <p>This is an automated invoice. Please keep it for your records.</p>
            <p>For support, contact us at support@storemx.com</p>
            <p>Invoice generated on ${new Date().toLocaleString("en-IN")}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    // Create an iframe to print to PDF
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print();
      }, 250);
    };
    
    document.body.appendChild(iframe);
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(iframe);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  if (selectedNotification) {
    const totals = calculateTotals(selectedNotification.orderData);

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {getNotificationIcon(selectedNotification.type)}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {selectedNotification.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {formatDate(selectedNotification.timestamp)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedNotification(null)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Order Details */}
        {selectedNotification.orderData && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900/20 p-4 rounded-lg">
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">TRACKING ID</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedNotification.orderData.trackingId}
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">ORDER STATUS</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedNotification.orderData.status}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Customer Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Name</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedNotification.orderData.customer}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Mail className="h-4 w-4" /> Email
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white break-all">
                    {selectedNotification.orderData.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    📞 Phone
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedNotification.orderData.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" /> Order Items
              </h3>
              <div className="space-y-3">
                {Array.isArray(selectedNotification.orderData.items) && selectedNotification.orderData.items.length > 0 ? (
                  selectedNotification.orderData.items.map((item: any, idx: number) => {
                    const productName = getProductName(item);
                    const quantity = item.quantity || 1;
                    const price = item.product?.price || item.price || 0;
                    const amount = price * quantity;

                    return (
                      <div key={idx} className="flex justify-between items-center p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 dark:text-white">{productName}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Qty: {quantity} × ₹{price.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900 dark:text-white">
                            ₹{amount.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                    <AlertCircle className="h-4 w-4" />
                    No items found
                  </div>
                )}
              </div>
            </div>

            {/* Bill/Invoice */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 p-6 rounded-lg border-2 border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-600" /> Invoice Details
              </h3>
              <div className="space-y-3 bg-white dark:bg-slate-800 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ₹{totals.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Shipping</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {totals.shipping === 0 ? "FREE" : `₹${totals.shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Tax (8%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ₹{Math.round(totals.tax).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-600 pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Total Amount</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-gray-700 bg-clip-text text-transparent">
                    ₹{Math.round(totals.total).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Payment Method: <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedNotification.orderData.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : selectedNotification.orderData.paymentMethod === "card"
                        ? "Credit/Debit Card"
                        : selectedNotification.orderData.paymentMethod === "gpay"
                          ? "Google Pay"
                          : "Net Banking"}
                  </span>
                </p>
              </div>
            </div>

            {/* Download Button */}
            <button 
              onClick={() => downloadInvoice(selectedNotification)}
              className="w-full bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              Download Invoice (PDF)
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">📬 Inbox</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Action Buttons */}
      {notifications.length > 0 && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-900/50 transition-colors"
          >
            <Check className="h-4 w-4" />
            Mark All Read
          </button>
          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                notification.read
                  ? "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                  : getStatusColor(notification.type)
              }`}
              onClick={() => {
                markAsRead(notification.id);
                setSelectedNotification(notification);
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold ${notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}>
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {notification.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatDate(notification.timestamp)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InboxNotifications;
