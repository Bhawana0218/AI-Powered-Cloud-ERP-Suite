"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { DollarSign, ArrowDownLeft, ArrowUpRight, Wallet, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function FinancePage() {
  const [finance, setFinance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics/finance").then((r) => setFinance(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-4 gap-4">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-24"/>)}</div></div>;

  const accounts = [
    { label: "Cash Balance", value: finance?.cashBalance, icon: Wallet, color: "from-emerald-500 to-teal-500" },
    { label: "Accounts Receivable", value: finance?.accountsReceivable, icon: ArrowDownLeft, color: "from-blue-500 to-indigo-500" },
    { label: "Accounts Payable", value: finance?.accountsPayable, icon: ArrowUpRight, color: "from-orange-500 to-amber-500" },
    { label: "Overdue Amount", value: finance?.overdueAmount, icon: AlertCircle, color: "from-red-500 to-rose-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-600" /> Financial Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">General ledger overview, AP/AR, and multi-currency reconciliation</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map((a) => {
          const Icon = a.icon;
          return (
            <Card key={a.label}>
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-muted-foreground">{a.label}</p>
                <p className="text-2xl font-bold mt-1">${Number(a.value || 0).toLocaleString()}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Invoice #", "Customer", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(finance?.recentTransactions || []).map((t: any) => (
                  <tr key={t.number} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 font-medium">{t.number}</td>
                    <td className="py-3 px-4">{t.customerName || "—"}</td>
                    <td className="py-3 px-4 font-semibold">${Number(t.total).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant={t.status === "PAID" ? "success" : t.status === "OVERDUE" ? "destructive" : "warning"}>{t.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{new Date(t.issueDate).toLocaleDateString()}</td>
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
