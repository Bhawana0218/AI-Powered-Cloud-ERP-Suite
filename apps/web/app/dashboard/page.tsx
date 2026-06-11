"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import {
  Users, Handshake, DollarSign, UserCircle, FolderKanban, FileText,
  TrendingUp, AlertTriangle, ArrowUpRight, Brain, Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/stats"),
      api.get("/analytics/charts"),
      api.get("/dashboard/activity"),
    ]).then(([statsRes, chartsRes, actRes]) => {
      setStats(statsRes.data);
      setCharts(chartsRes.data);
      setActivity(actRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const kpiCards = stats ? [
    { label: "Pipeline Value", value: `$${Number(stats.pipelineValue || 0).toLocaleString()}`, icon: TrendingUp, change: "+12.5%", color: "from-indigo-500 to-violet-500" },
    { label: "Revenue (Paid)", value: `$${Number(stats.revenue || 0).toLocaleString()}`, icon: DollarSign, change: "+8.2%", color: "from-emerald-500 to-teal-500" },
    { label: "Active Deals", value: stats.dealsCount ?? 0, icon: Handshake, change: `${stats.dealsWon ?? 0} won`, color: "from-blue-500 to-cyan-500" },
    { label: "Contacts", value: stats.contactsCount ?? 0, icon: Users, change: "CRM", color: "from-violet-500 to-purple-500" },
    { label: "Employees", value: stats.employeesCount ?? 0, icon: UserCircle, change: "HR", color: "from-orange-500 to-amber-500" },
    { label: "Projects", value: stats.projectsCount ?? 0, icon: FolderKanban, change: `${stats.activeProjects ?? 0} active`, color: "from-rose-500 to-pink-500" },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time KPIs and business intelligence overview</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/ai-forecast">
            <Badge variant="brand" className="cursor-pointer px-3 py-1.5 gap-1.5">
              <Brain className="w-3.5 h-3.5" /> AI Insights
            </Badge>
          </Link>
          {(stats?.invoicesOverdue ?? 0) > 0 && (
            <Badge variant="warning" className="px-3 py-1.5 gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> {stats.invoicesOverdue} Overdue
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-emerald-600 mt-1 font-medium">{stat.change}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-600" /> Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={charts?.revenueByMonth || []}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake className="w-4 h-4 text-violet-600" /> Sales Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={charts?.pipeline || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis dataKey="stage" type="category" width={90} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip formatter={(v, name) => [name === "value" ? `$${Number(v).toLocaleString()}` : v, name === "value" ? "Value" : "Count"]} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4" /> Recent Activity
            </CardTitle>
            <Link href="/dashboard/crm/deals" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-1">
            {(activity?.recentDeals || []).slice(0, 5).map((d: any) => (
              <div key={d.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Handshake className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.stage?.replace(/_/g, " ")}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">${Number(d.value).toLocaleString()}</span>
              </div>
            ))}
            {(activity?.recentInvoices || []).slice(0, 3).map((inv: any) => (
              <div key={inv.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{inv.number}</p>
                    <Badge variant={inv.status === "PAID" ? "success" : "warning"} className="text-[10px]">{inv.status}</Badge>
                  </div>
                </div>
                <span className="text-sm font-semibold">${Number(inv.total).toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deal Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={charts?.dealTrend || []}
                  dataKey="deals"
                  nameKey="month"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {(charts?.dealTrend || []).map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
