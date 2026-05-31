"use client";
import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/lib/api-helpers";
import { Plus, X, AlertCircle, RefreshCw } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  unit: string;
  category: string;
  stockQty: number;
  minStockQty: number;
}

const emptyForm = { name: "", sku: "", price: 0, cost: 0, unit: "pcs", category: "", stockQty: 0, minStockQty: 0 };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiGet("/sales/products", { page, limit: 10 });
      setProducts(result.data as any[]);
      setTotalPages(Math.max(1, Math.ceil(result.total / 10)));
    } catch (err: any) {
      setError(err?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiPost("/sales/products", {
        ...form,
      });
      setShowModal(false);
      setForm(emptyForm);
      setPage(1);
      fetchProducts();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-800">Products</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={fetchProducts} className="ml-auto p-1 hover:bg-red-100 rounded"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {["Name", "SKU", "Price", "Cost", "Unit", "Category", "Stock"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-zinc-400">Loading...</td></tr>
            ) : !error && products.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                <p className="text-base font-medium">No products found</p>
                <p className="text-sm mt-1">Get started by adding your first product.</p>
              </td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-zinc-500">{p.sku}</td>
                <td className="px-4 py-3">${p.price?.toFixed(2)}</td>
                <td className="px-4 py-3 text-zinc-500">${p.cost?.toFixed(2)}</td>
                <td className="px-4 py-3 text-zinc-500">{p.unit}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-zinc-100 text-zinc-600">{p.category}</span></td>
                <td className="px-4 py-3">{p.stockQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 text-sm rounded-lg border border-zinc-300 disabled:opacity-40 hover:bg-zinc-100 transition-colors">Prev</button>
          <span className="text-sm text-zinc-500">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 text-sm rounded-lg border border-zinc-300 disabled:opacity-40 hover:bg-zinc-100 transition-colors">Next</button>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-800">Add Product</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-zinc-100 rounded-lg"><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Price</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Cost</label>
                  <input type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Unit</label>
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="pcs">Pieces</option>
                    <option value="kg">Kilogram</option>
                    <option value="m">Meter</option>
                    <option value="L">Liter</option>
                    <option value="box">Box</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Stock Qty</label>
                  <input type="number" value={form.stockQty} onChange={(e) => setForm({ ...form, stockQty: Number(e.target.value) })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Min Stock Qty</label>
                  <input type="number" value={form.minStockQty} onChange={(e) => setForm({ ...form, minStockQty: Number(e.target.value) })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
