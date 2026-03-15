import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: string;
  date: string;
}

const initialOrders: Order[] = [
  { id: "ORD-001", customer: "John Doe", email: "john@example.com", amount: 129.99, status: "Delivered", date: "2026-02-20" },
  { id: "ORD-002", customer: "Jane Smith", email: "jane@example.com", amount: 89.50, status: "Shipped", date: "2026-02-18" },
  { id: "ORD-003", customer: "Bob Wilson", email: "bob@example.com", amount: 254.99, status: "Processing", date: "2026-02-15" },
  { id: "ORD-004", customer: "Alice Brown", email: "alice@example.com", amount: 34.99, status: "Delivered", date: "2026-02-12" },
  { id: "ORD-005", customer: "Charlie Green", email: "charlie@example.com", amount: 179.00, status: "Processing", date: "2026-02-10" },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const updateStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success(`Order ${id} updated to ${status}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{fontFamily: "'Poppins', sans-serif"}}>Manage Orders</h1>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium">{order.id}</td>
                  <td className="py-3 px-4">
                    <div>{order.customer}</div>
                    <div className="text-xs text-muted-foreground">{order.email}</div>
                  </td>
                  <td className="py-3 px-4">{order.date}</td>
                  <td className="py-3 px-4 font-medium">${order.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      order.status === "Delivered" ? "bg-success text-success-foreground" :
                      order.status === "Shipped" ? "bg-primary text-primary-foreground" :
                      "bg-warning text-warning-foreground"
                    }`}>{order.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-xs border border-border rounded px-2 py-1 bg-background text-foreground"
                    >
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
