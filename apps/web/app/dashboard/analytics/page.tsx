"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { BarChart3, TrendingUp, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function AnalyticsPage() {
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics/charts").then((r) => setCharts(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-96" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" /> Business Intelligence
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Drill-down analytics across revenue, pipeline, and inventory</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Revenue by Month</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={charts?.revenueByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Deal Creation Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={charts?.dealTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="deals" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package className="w-4 h-4" /> Inventory Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Product", "Stock", "Threshold", "Status"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(charts?.inventory || []).map((item: any, i: number) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4">{item.stock}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.threshold}</td>
                    <td className="py-3 px-4">
                      <Badge variant={item.status === "low" ? "destructive" : "success"}>
                        {item.status === "low" ? "Low Stock" : "OK"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
