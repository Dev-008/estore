import { Link } from "react-router-dom";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";

const stats = [
  { label: "Total Users", value: "2,847", icon: Users, change: "+12%" },
  { label: "Total Products", value: "1,234", icon: Package, change: "+5%" },
  { label: "Total Orders", value: "856", icon: ShoppingCart, change: "+18%" },
  { label: "Revenue", value: "$45,230", icon: DollarSign, change: "+24%" },
];

const recentOrders = [
  { id: "ORD-001", customer: "John Doe", amount: "$129.99", status: "Delivered" },
  { id: "ORD-002", customer: "Jane Smith", amount: "$89.50", status: "Shipped" },
  { id: "ORD-003", customer: "Bob Wilson", amount: "$254.99", status: "Processing" },
  { id: "ORD-004", customer: "Alice Brown", amount: "$34.99", status: "Delivered" },
];

const AdminDashboard = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{fontFamily: "'Poppins', sans-serif"}}>Admin Dashboard</h1>
      <div className="flex gap-3">
        <Link to="/admin/products" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">
          Manage Orders
        </Link>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <stat.icon className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium text-success">{stat.change}</span>
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Recent Orders */}
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">Order ID</th>
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">Customer</th>
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">Amount</th>
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0">
                <td className="py-3 px-2 font-medium">{order.id}</td>
                <td className="py-3 px-2">{order.customer}</td>
                <td className="py-3 px-2 font-medium">{order.amount}</td>
                <td className="py-3 px-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    order.status === "Delivered" ? "bg-success text-success-foreground" :
                    order.status === "Shipped" ? "bg-primary text-primary-foreground" :
                    "bg-warning text-warning-foreground"
                  }`}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
