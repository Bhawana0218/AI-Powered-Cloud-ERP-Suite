"use client";
import { useState, useEffect } from "react";
import { apiGet, apiPost, apiDelete } from "@/lib/api-helpers";
import { Building2, Plus, X, Trash2, AlertCircle, RefreshCw, Loader2 } from "lucide-react";

interface Department {
  id: string;
  name: string;
  employeeCount: number;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDepartments = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiGet("/hr/departments", { limit: 100 });
      setDepartments(result.data as any[]);
    } catch (err: any) {
      setError(err?.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await apiPost("/hr/departments", { name });
      setShowForm(false);
      setName("");
      fetchDepartments();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to create department");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this department?")) return;
    setDeletingId(id);
    try {
      await apiDelete(`/hr/departments/${id}`);
      fetchDepartments();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete department");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-zinc-800">Departments</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5 animate-pulse">
              <div className="h-5 bg-zinc-200 rounded w-2/3 mb-3" />
              <div className="h-3 bg-zinc-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-800">Departments</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={fetchDepartments} className="ml-auto p-1 hover:bg-red-100 rounded"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {!error && departments.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          <p className="text-lg">No departments found</p>
          <p className="text-sm mt-1">Get started by creating your first department.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((d) => (
            <div key={d.id} className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-800">{d.name}</h3>
                    <p className="text-xs text-zinc-500">{d.employeeCount} employee(s)</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(d.id)} disabled={deletingId === d.id} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors">
                  {deletingId === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-800">Add Department</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-zinc-100 rounded-lg"><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Department Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. Engineering" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={saving || !name.trim()} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
