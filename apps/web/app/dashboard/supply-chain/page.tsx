"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { apiGet, apiPost } from "@/lib/api-helpers";
import { Truck, Plus, X, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function SupplyChainPage() {
  const [stats, setStats] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVendor, setShowVendor] = useState(false);
  const [showPO, setShowPO] = useState(false);
  const [vendorForm, setVendorForm] = useState({ name: "", email: "", phone: "" });
  const [poForm, setPoForm] = useState({ vendorId: "", total: 0, notes: "" });

  const load = async () => {
    setLoading(true);
    const [s, v, o] = await Promise.all([
      api.get("/supply-chain/stats").then((r) => r.data),
      apiGet("/supply-chain/vendors"),
      apiGet("/supply-chain/purchase-orders"),
    ]);
    setStats(s);
    setVendors(v.data);
    setOrders(o.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createVendor = async () => {
    await apiPost("/supply-chain/vendors", vendorForm);
    setShowVendor(false);
    setVendorForm({ name: "", email: "", phone: "" });
    load();
  };

  const createPO = async () => {
    await apiPost("/supply-chain/purchase-orders", { ...poForm, total: Number(poForm.total) });
    setShowPO(false);
    setPoForm({ vendorId: "", total: 0, notes: "" });
    load();
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-96" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="w-6 h-6 text-indigo-600" /> Supply Chain
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Vendor management, purchase orders, and inventory automation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowVendor(true)} className="gap-2"><Plus className="w-4 h-4" /> Vendor</Button>
          <Button size="sm" onClick={() => setShowPO(true)} className="gap-2 gradient-brand text-white border-0"><Plus className="w-4 h-4" /> Purchase Order</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Vendors", value: stats?.vendors, icon: Users },
          { label: "Purchase Orders", value: stats?.orders, icon: Truck },
          { label: "Pending POs", value: stats?.pending, icon: Package },
          { label: "Low Stock Items", value: stats?.lowStockCount, icon: Package },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Vendors</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {vendors.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-indigo-200 transition-colors">
                <div>
                  <p className="font-medium text-sm">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">★ {v.rating}</p>
                  <p className="text-xs text-muted-foreground">{v._count?.purchaseOrders ?? 0} POs</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Purchase Orders</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["PO #", "Vendor", "Total", "Status"].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-border/50">
                      <td className="py-2.5 px-3 font-medium">{o.number}</td>
                      <td className="py-2.5 px-3">{o.vendor?.name}</td>
                      <td className="py-2.5 px-3">${Number(o.total).toLocaleString()}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant={o.status === "RECEIVED" ? "success" : o.status === "SENT" ? "brand" : "default"}>{o.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {showVendor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 w-full max-w-md mx-4 shadow-xl border border-border">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Vendor</h2>
              <button onClick={() => setShowVendor(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <Input placeholder="Vendor name" value={vendorForm.name} onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })} />
              <Input placeholder="Email" value={vendorForm.email} onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })} />
              <Input placeholder="Phone" value={vendorForm.phone} onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowVendor(false)}>Cancel</Button>
              <Button onClick={createVendor} className="gradient-brand text-white border-0">Save</Button>
            </div>
          </div>
        </div>
      )}

      {showPO && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 w-full max-w-md mx-4 shadow-xl border border-border">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Purchase Order</h2>
              <button onClick={() => setShowPO(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <select value={poForm.vendorId} onChange={(e) => setPoForm({ ...poForm, vendorId: e.target.value })} className="w-full h-9 rounded-lg border border-input px-3 text-sm">
                <option value="">Select vendor</option>
                {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
              <Input type="number" placeholder="Total amount" value={poForm.total || ""} onChange={(e) => setPoForm({ ...poForm, total: Number(e.target.value) })} />
              <Input placeholder="Notes" value={poForm.notes} onChange={(e) => setPoForm({ ...poForm, notes: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowPO(false)}>Cancel</Button>
              <Button onClick={createPO} className="gradient-brand text-white border-0">Create PO</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
