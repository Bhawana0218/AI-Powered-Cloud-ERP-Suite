"use client";
import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/lib/api-helpers";
import { Plus, X, AlertCircle, RefreshCw } from "lucide-react";

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  closeDate: string;
  notes: string;
  contact?: { firstName: string; lastName: string };
  owner?: { firstName: string; lastName: string };
}

const stages = ["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"];

const emptyForm = { title: "", value: 0, stage: "LEAD", probability: 50, closeDate: "", contactId: "", notes: "" };

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stageFilter, setStageFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchDeals = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiGet("/crm/deals", { stage: stageFilter || undefined, page, limit: 10 });
      setDeals(result.data as any[]);
      setTotalPages(Math.max(1, Math.ceil(result.total / 10)));
    } catch (err: any) {
      setError(err?.message || "Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDeals(); }, [page, stageFilter]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiPost("/crm/deals", { ...form, value: Number(form.value), probability: Number(form.probability) });
      setShowModal(false);
      setForm(emptyForm);
      setPage(1);
      fetchDeals();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to save deal");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-800">Deals</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Deal
        </button>
      </div>
      <div className="flex items-center gap-2">
        <select value={stageFilter} onChange={(e) => { setStageFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Stages</option>
          {stages.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={fetchDeals} className="ml-auto p-1 hover:bg-red-100 rounded"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {["Title", "Value", "Stage", "Probability", "Contact", "Owner"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-400">Loading...</td></tr>
            ) : !error && deals.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                <p className="text-base font-medium">No deals found</p>
                <p className="text-sm mt-1">Get started by adding your first deal.</p>
              </td></tr>
            ) : deals.map((d) => (
              <tr key={d.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium">{d.title}</td>
                <td className="px-4 py-3">${d.value?.toLocaleString()}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">{d.stage.replace(/_/g, " ")}</span></td>
                <td className="px-4 py-3">{d.probability}%</td>
                <td className="px-4 py-3 text-zinc-500">{d.contact ? `${d.contact.firstName} ${d.contact.lastName}` : "-"}</td>
                <td className="px-4 py-3 text-zinc-500">{d.owner ? `${d.owner.firstName} ${d.owner.lastName}` : "-"}</td>
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
              <h2 className="text-lg font-semibold text-zinc-800">Add Deal</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-zinc-100 rounded-lg"><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Value</label>
                  <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Probability (%)</label>
                  <input type="number" value={form.probability} onChange={(e) => setForm({ ...form, probability: Number(e.target.value) })} min={0} max={100} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Stage</label>
                <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {stages.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Close Date</label>
                <input type="date" value={form.closeDate} onChange={(e) => setForm({ ...form, closeDate: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Contact ID</label>
                <input value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
