"use client";
import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/lib/api-helpers";
import { Plus, X, Trash2, AlertCircle, RefreshCw } from "lucide-react";

interface Invoice {
  id: string;
  number: string;
  customerName: string;
  total: number;
  status: string;
  date: string;
}

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

const emptyLineItem: LineItem = { description: "", quantity: 1, unitPrice: 0 };

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([{ ...emptyLineItem }]);

  const fetchInvoices = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiGet("/sales/invoices", { page, limit: 10 });
      setInvoices(result.data as any[]);
      setTotalPages(Math.max(1, Math.ceil(result.total / 10)));
    } catch (err: any) {
      setError(err?.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, [page]);

  const total = lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0);

  const handleSave = async () => {
    setSaving(true);
    try {
await apiPost("/sales/invoices", {
  customerName,
  items: lineItems,
});
      setShowModal(false);
      setCustomerName("");
      setLineItems([{ ...emptyLineItem }]);
      setPage(1);
      fetchInvoices();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to create invoice");
    } finally {
      setSaving(false);
    }
  };

  const updateLineItem = (i: number, field: keyof LineItem, value: string | number) => {
    const updated = lineItems.map((li, idx) => (idx === i ? { ...li, [field]: value } : li));
    setLineItems(updated);
  };

  const addLineItem = () => setLineItems([...lineItems, { ...emptyLineItem }]);
  const removeLineItem = (i: number) => setLineItems(lineItems.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-800">Invoices</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={fetchInvoices} className="ml-auto p-1 hover:bg-red-100 rounded"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {["Invoice #", "Customer", "Total", "Status", "Date"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-400">Loading...</td></tr>
            ) : !error && invoices.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-400">
                <p className="text-base font-medium">No invoices found</p>
                <p className="text-sm mt-1">Get started by creating your first invoice.</p>
              </td></tr>
            ) : invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium">{inv.number}</td>
                <td className="px-4 py-3">{inv.customerName}</td>
                <td className="px-4 py-3">${inv.total?.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    inv.status === "PAID" ? "bg-emerald-100 text-emerald-700" :
                    inv.status === "OVERDUE" ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>{inv.status}</span>
                </td>
                <td className="px-4 py-3 text-zinc-500">{inv.date ? new Date(inv.date).toLocaleDateString() : "-"}</td>
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
          <div className="bg-white rounded-xl p-6 w-full max-w-xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-800">Create Invoice</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-zinc-100 rounded-lg"><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Customer Name</label>
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-zinc-700">Line Items</label>
                  <button onClick={addLineItem} className="text-xs text-blue-600 hover:underline">+ Add item</button>
                </div>
                <div className="space-y-3">
                  {lineItems.map((li, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <input placeholder="Description" value={li.description} onChange={(e) => updateLineItem(i, "description", e.target.value)} className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      <input type="number" placeholder="Qty" value={li.quantity} onChange={(e) => updateLineItem(i, "quantity", Number(e.target.value))} className="w-16 px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      <input type="number" step="0.01" placeholder="Price" value={li.unitPrice} onChange={(e) => updateLineItem(i, "unitPrice", Number(e.target.value))} className="w-24 px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      <span className="py-2 text-sm text-zinc-600 w-20 text-right">${(li.quantity * li.unitPrice).toFixed(2)}</span>
                      {lineItems.length > 1 && (
                        <button onClick={() => removeLineItem(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-right mt-2 text-sm font-semibold text-zinc-800">Total: ${total.toFixed(2)}</div>
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
