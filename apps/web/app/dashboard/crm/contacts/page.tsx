"use client";
import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/lib/api-helpers";
import { useToast } from "@/lib/toast-context";
import { Search, Plus, X, AlertCircle, RefreshCw } from "lucide-react";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  source: string;
  notes: string;
  owner?: { firstName: string; lastName: string };
}

const emptyForm = { firstName: "", lastName: "", email: "", phone: "", jobTitle: "", source: "", notes: "" };

export default function ContactsPage() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiGet("/crm/contacts", { search, page, limit: 10 });
      setContacts(result.data as any[]);
      setTotalPages(Math.max(1, Math.ceil(result.total / 10)));
    } catch (err: any) {
      setError(err?.message || "Failed to load contacts");
      toast("error", "Error", err?.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, [page, search]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiPost("/crm/contacts", form);
      setShowModal(false);
      setForm(emptyForm);
      setPage(1);
      fetchContacts();
      toast("success", "Created", "Contact created successfully");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to save contact");
      toast("error", "Error", err?.response?.data?.message || err?.message || "Failed to save contact");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-800">Contacts</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search contacts..." className="w-full pl-9 pr-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={fetchContacts} className="ml-auto p-1 hover:bg-red-100 rounded"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {["First Name", "Last Name", "Email", "Phone", "Owner"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-400">Loading...</td></tr>
            ) : !error && contacts.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-400">
                <p className="text-base font-medium">No contacts found</p>
                <p className="text-sm mt-1">Get started by adding your first contact.</p>
              </td></tr>
            ) : contacts.map((c) => (
              <tr key={c.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium">{c.firstName}</td>
                <td className="px-4 py-3">{c.lastName}</td>
                <td className="px-4 py-3 text-zinc-500">{c.email}</td>
                <td className="px-4 py-3 text-zinc-500">{c.phone || "-"}</td>
                <td className="px-4 py-3 text-zinc-500">{c.owner ? `${c.owner.firstName} ${c.owner.lastName}` : "-"}</td>
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
              <h2 className="text-lg font-semibold text-zinc-800">Add Contact</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-zinc-100 rounded-lg"><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            <div className="space-y-4">
              {(["firstName","lastName","email","phone","jobTitle","source"] as const).map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">{f.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</label>
                  <input value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              ))}
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
