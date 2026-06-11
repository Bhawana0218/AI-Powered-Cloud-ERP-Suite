"use client";
import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api-helpers";
import { useToast } from "@/lib/toast-context";
import { Package, AlertTriangle, AlertCircle, RefreshCw } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stockQty: number;
  minStockQty: number;
  price: number;
}

export default function InventoryPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiGet("/sales/products", { limit: 200 });
      setProducts(result.data as any[]);
    } catch (err: any) {
      setError(err?.message || "Failed to load inventory");
      toast("error", "Error", err?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-zinc-800">Inventory</h1>
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-zinc-200 p-4">
              <div className="h-4 bg-zinc-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-zinc-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const lowStock = products.filter((p) => p.stockQty < p.minStockQty);
  const okStock = products.filter((p) => p.stockQty >= p.minStockQty);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-800">Inventory</h1>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Package className="w-4 h-4" /> {products.length} products
        </div>
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={fetchProducts} className="ml-auto p-1 hover:bg-red-100 rounded"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {!error && products.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          <p className="text-lg">No products found</p>
          <p className="text-sm mt-1">Add products from the Sales section.</p>
        </div>
      )}
      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">{lowStock.length} product(s) below minimum stock level</p>
            <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
              {lowStock.map((p) => (
                <li key={p.id}>{p.name} (SKU: {p.sku}) - {p.stockQty} / {p.minStockQty}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {["Product", "SKU", "Category", "Price", "Stock Qty", "Min Stock", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isLow = p.stockQty < p.minStockQty;
              return (
                <tr key={p.id} className={`border-b border-zinc-100 hover:bg-zinc-50 ${isLow ? "bg-red-50" : ""}`}>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{p.sku}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-zinc-100 text-zinc-600">{p.category}</span></td>
                  <td className="px-4 py-3">${p.price?.toFixed(2)}</td>
                  <td className="px-4 py-3 font-medium">{p.stockQty}</td>
                  <td className="px-4 py-3 text-zinc-500">{p.minStockQty}</td>
                  <td className="px-4 py-3">
                    {isLow ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-700">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-emerald-700">In Stock</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
