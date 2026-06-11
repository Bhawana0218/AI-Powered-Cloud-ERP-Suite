"use client";
import { useState, useEffect } from "react";
import { apiGet, apiPatch } from "@/lib/api-helpers";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/lib/toast-context";
import { Building2, Save, AlertCircle, CheckCircle2 } from "lucide-react";

interface Company {
  id: string;
  name: string;
  website: string;
  industry: string;
  size: string;
  address: string;
  phone: string;
}

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    name: "", website: "", industry: "", size: "", address: "", phone: "",
  });
  const { toast } = useToast();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const result = await apiGet("/companies/me") as any;
        const raw = result.data;
        const c: Company = raw?.company ?? raw ?? {};
        setCompanyId(c.id);
        setForm({
          name: c.name || "",
          website: c.website || "",
          industry: c.industry || "",
          size: c.size || "",
          address: c.address || "",
          phone: c.phone || "",
        });
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Failed to load company");
        toast("error", "Error", err?.response?.data?.message || err?.message || "Failed to load company");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [user]);

  const handleSave = async () => {
    if (!companyId) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await apiPatch(`/companies/${companyId}`, form);
      setSuccess("Settings saved successfully!");
      toast("success", "Updated", "Settings saved successfully");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to save settings");
      toast("error", "Error", err?.response?.data?.message || err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-zinc-800">Settings</h1>
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 animate-pulse">
          <div className="h-5 bg-zinc-200 rounded w-1/4 mb-6" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-zinc-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const fields = [
    { key: "name", label: "Company Name" },
    { key: "website", label: "Website" },
    { key: "industry", label: "Industry" },
    { key: "size", label: "Company Size" },
    { key: "address", label: "Address" },
    { key: "phone", label: "Phone" },
  ] as const;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-zinc-800">Settings</h1>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-blue-500" />
          <h2 className="text-base font-semibold text-zinc-800">Company Information</h2>
        </div>
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-zinc-700 mb-1">{f.label}</label>
              <input value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-6">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
