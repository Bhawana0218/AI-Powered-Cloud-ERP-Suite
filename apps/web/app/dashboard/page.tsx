"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api-helpers";
import { Users, Handshake, DollarSign, UserCircle, FolderKanban, FileText, Activity, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [recentDeals, setRecentDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, actRes] = await Promise.all([
          apiGet("/dashboard/stats"),
          apiGet("/dashboard/activity"),
        ]);
        const s = statsRes.data as any || {};
        setStats([
          { label: "Contacts", value: s.contactsCount ?? 0, icon: Users, color: "text-blue-600 bg-blue-50" },
          { label: "Deals", value: s.dealsCount ?? 0, icon: Handshake, color: "text-green-600 bg-green-50" },
          { label: "Pipeline Value", value: s.pipelineValue ? `$${Number(s.pipelineValue).toLocaleString()}` : "$0", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
          { label: "Employees", value: s.employeesCount ?? 0, icon: UserCircle, color: "text-purple-600 bg-purple-50" },
          { label: "Projects", value: s.projectsCount ?? 0, icon: FolderKanban, color: "text-orange-600 bg-orange-50" },
          { label: "Revenue", value: s.revenue ? `$${Number(s.revenue).toLocaleString()}` : "$0", icon: FileText, color: "text-rose-600 bg-rose-50" },
        ]);
        const raw = actRes as any;
        const activity = (Array.isArray(raw.data) ? raw.data : raw.data?.recentDeals ?? []) as any[];
        setRecentDeals(activity.slice(0, 8));
      } catch (err: any) {
        setError(err?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-zinc-100 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900 mb-6">Dashboard</h1>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-zinc-500" />
          <h2 className="text-base font-semibold text-zinc-900">Recent Deals</h2>
        </div>
        {recentDeals.length === 0 ? (
          <p className="text-sm text-zinc-400 py-4 text-center">No recent activity</p>
        ) : (
          <div className="space-y-2">
            {recentDeals.map((d: any) => (
              <div key={d.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-50">
                <div>
                  <p className="text-sm font-medium text-zinc-800">{d.title}</p>
                  <p className="text-xs text-zinc-400">{d.stage?.replace(/_/g, " ")}</p>
                </div>
                <span className="text-sm font-semibold text-zinc-700">${Number(d.value).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
