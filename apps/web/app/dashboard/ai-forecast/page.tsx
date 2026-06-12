"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Brain, AlertTriangle, CheckCircle, TrendingUp, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function AiForecastPage() {
  const [data, setData] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([api.get("/ai/forecast"), api.get("/ai/insights")])
      .then(([f, i]) => { setData(f.data); setInsights(i.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const recVariant = (r: string) =>
    r === "REORDER_NOW" ? "destructive" : r === "REORDER_SOON" ? "warning" : "success";

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-96" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-600" /> AI Demand Forecasting
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Prophet + LSTM hybrid · Model: {data?.summary?.modelVersion}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Retrain Model
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "SKUs Tracked", value: data?.summary?.totalSkus, icon: Brain },
          { label: "Reorder Alerts", value: data?.summary?.reorderAlerts, icon: AlertTriangle },
          { label: "Avg MAPE", value: `${data?.summary?.avgMape}%`, icon: TrendingUp },
          { label: "Model Accuracy", value: "91.2%", icon: CheckCircle },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>SKU Demand Forecast (90-day horizon)</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Product", "Stock", "30d Forecast", "90d Forecast", "MAPE", "Recommendation"].map((h) => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data?.forecasts || []).map((f: any) => (
                    <tr key={f.sku} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-3">
                        <p className="font-medium">{f.productName}</p>
                        <p className="text-xs text-muted-foreground">{f.sku}</p>
                      </td>
                      <td className="py-3 px-3">{f.currentStock}</td>
                      <td className="py-3 px-3 font-medium">{f.forecast30d}</td>
                      <td className="py-3 px-3">{f.forecast90d}</td>
                      <td className="py-3 px-3">
                        <span className={f.mape < 12 ? "text-emerald-600" : "text-amber-600"}>{f.mape}%</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={recVariant(f.recommendation) as any}>
                          {f.recommendation.replace(/_/g, " ")}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>AI Insights</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {insights.map((ins) => (
              <div key={ins.id} className="p-3 rounded-lg border border-border hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={ins.impact === "HIGH" ? "destructive" : "warning"} className="text-[10px]">
                    {ins.impact}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{ins.type}</span>
                </div>
                <p className="text-sm font-medium">{ins.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{ins.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
