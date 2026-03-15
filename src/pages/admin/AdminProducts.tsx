import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { products as allProducts, Product } from "@/data/products";
import { toast } from "sonner";

const AdminProducts = () => {
  const [productList, setProductList] = useState<Product[]>(allProducts);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{fontFamily: "'Poppins', sans-serif"}}>Manage Products</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="font-bold mb-4">Add New Product</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Product Name", "Brand", "Price", "Category"].map((label) => (
              <div key={label}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => { setShowForm(false); toast.success("Product added (demo)"); }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
            >
              Save Product
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-md text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" className="w-10 h-10 rounded object-cover" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">${product.price}</td>
                  <td className="py-3 px-4 capitalize">{product.category}</td>
                  <td className="py-3 px-4">{product.stockCount}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded hover:bg-secondary"><Pencil className="h-4 w-4 text-muted-foreground" /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded hover:bg-secondary"><Trash2 className="h-4 w-4 text-deal" /></button>
                    </div>
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

export default AdminProducts;
