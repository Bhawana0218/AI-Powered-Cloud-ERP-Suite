"use client";
import { useState, useEffect } from "react";
import { apiGet, apiPatch } from "@/lib/api-helpers";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/lib/toast-context";
import { Building2, Save, Users, Shield, ChevronDown } from "lucide-react";

interface Company {
  id: string; name: string; website: string; industry: string; size: string; address: string; phone: string;
}

interface TeamUser {
  id: string; email: string; firstName: string | null; lastName: string | null; role: string; isActive: boolean; createdAt: string;
}

const roleOptions = [
  { value: "ADMIN", label: "Admin", desc: "Full company access" },
  { value: "MANAGER", label: "Manager", desc: "Department & team oversight" },
  { value: "STAFF", label: "Staff", desc: "Basic self-service access" },
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [tab, setTab] = useState<"company" | "team">("company");
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "", website: "", industry: "", size: "", address: "", phone: "",
  });
  const [team, setTeam] = useState<TeamUser[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [changingRole, setChangingRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const result = await apiGet("/companies/me") as any;
        const raw = result.data;
        const c: Company = raw?.company ?? raw ?? {};
        setCompanyId(c.id);
        setForm({
          name: c.name || "", website: c.website || "", industry: c.industry || "",
          size: c.size || "", address: c.address || "", phone: c.phone || "",
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

  useEffect(() => {
    if (tab !== "team") return;
    const fetchTeam = async () => {
      setTeamLoading(true);
      try {
        const res = await apiGet("/users/company") as any;
        setTeam(res.data?.users ?? []);
      } catch (err: any) {
        toast("error", "Error", "Failed to load team members");
      } finally {
        setTeamLoading(false);
      }
    };
    fetchTeam();
  }, [tab]);

  const handleSave = async () => {
    if (!companyId) return;
    setSaving(true); setError(""); setSuccess("");
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

  const handleRoleChange = async (userId: string, newRole: string) => {
    setChangingRole(userId);
    try {
      await apiPatch(`/users/${userId}/role`, { role: newRole });
      setTeam((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      toast("success", "Role Updated", `User role changed to ${newRole}`);
    } catch (err: any) {
      toast("error", "Error", err?.response?.data?.message || "Failed to update role");
    } finally {
      setChangingRole(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="page-title">Settings</h1>
        <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
          <div className="h-5 bg-muted rounded w-1/4 mb-6" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 bg-muted rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your organization and team</p>
      </div>

      <div className="flex gap-1 bg-card rounded-xl p-1 border border-border w-fit">
        <button onClick={() => setTab("company")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "company" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          <Building2 className="w-4 h-4" /> Company
        </button>
        <button onClick={() => setTab("team")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "team" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          <Users className="w-4 h-4" /> Team
        </button>
      </div>

      {tab === "company" && (
        <>
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
          )}
          {success && (
            <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">{success}</div>
          )}
          <div className="bg-card rounded-xl border border-border p-6 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold">Company Information</h2>
            </div>
            <div className="space-y-4">
              {[{ key: "name", label: "Company Name" }, { key: "website", label: "Website" }, { key: "industry", label: "Industry" }, { key: "size", label: "Company Size" }, { key: "address", label: "Address" }, { key: "phone", label: "Phone" }].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium mb-1.5 text-foreground-secondary">{f.label}</label>
                  <input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 disabled:opacity-50 transition-all font-medium">
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </>
      )}

      {tab === "team" && (
        <div className="bg-card rounded-xl border border-border">
          <div className="flex items-center gap-3 p-6 pb-4 border-b border-border">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-base font-semibold">Team Members</h2>
              <p className="text-xs text-muted-foreground">Manage roles and permissions</p>
            </div>
          </div>
          {teamLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-muted" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : team.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">No team members found</div>
          ) : (
            <div className="divide-y divide-border">
              {team.map((member) => (
                <div key={member.id} className="flex items-center justify-between px-6 py-4 hover:bg-card-hover transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-sm font-semibold text-primary">
                      {(member.firstName?.[0] || member.email[0]).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {member.firstName || member.lastName ? `${member.firstName || ""} ${member.lastName || ""}`.trim() : member.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="relative group">
                    <select
                      value={member.role}
                      disabled={changingRole === member.id || member.id === user?.id}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="appearance-none bg-muted border border-border text-sm rounded-lg px-3 py-1.5 pr-8 text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 cursor-pointer"
                    >
                      {roleOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                    {changingRole === member.id && (
                      <span className="absolute -bottom-5 left-0 text-[10px] text-primary">Updating...</span>
                    )}
                    {member.id === user?.id && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 text-right">(you)</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="px-6 py-3 border-t border-border bg-card-hover/50">
            <p className="text-[11px] text-muted-foreground">
              <strong className="text-foreground-secondary">Admin</strong> — Full access &nbsp;·&nbsp;
              <strong className="text-foreground-secondary">Manager</strong> — Dept oversight &nbsp;·&nbsp;
              <strong className="text-foreground-secondary">Staff</strong> — Self-service
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
