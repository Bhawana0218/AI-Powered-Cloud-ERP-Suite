"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import api from "@/lib/api";
import {
  LayoutDashboard, Users, Handshake, Kanban, Package, FileText, Warehouse,
  UserCircle, Building2, FolderKanban, ChevronLeft, ChevronRight, LogOut, Menu,
  Brain, BarChart3, DollarSign, Truck, Bell, Settings, Search, Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const navGroups = [
  { label: "Overview", items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/ai-forecast", label: "AI Forecasting", icon: Brain, badge: "AI" },
  ]},
  { label: "CRM & Sales", items: [
    { href: "/dashboard/crm/contacts", label: "Contacts", icon: Users },
    { href: "/dashboard/crm/deals", label: "Deals", icon: Handshake },
    { href: "/dashboard/crm/pipeline", label: "Pipeline", icon: Kanban },
    { href: "/dashboard/sales/products", label: "Products", icon: Package },
    { href: "/dashboard/sales/invoices", label: "Invoices", icon: FileText },
  ]},
  { label: "Operations", items: [
    { href: "/dashboard/inventory", label: "Inventory", icon: Warehouse },
    { href: "/dashboard/supply-chain", label: "Supply Chain", icon: Truck },
    { href: "/dashboard/finance", label: "Finance", icon: DollarSign },
  ]},
  { label: "People & Projects", items: [
    { href: "/dashboard/hr/employees", label: "Employees", icon: UserCircle },
    { href: "/dashboard/hr/departments", label: "Departments", icon: Building2 },
    { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  ]},
  { label: "System", items: [
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]},
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loadUser } = useAuthStore();

  useEffect(() => { loadUser(); }, [loadUser]);
  useEffect(() => {
    if (!useAuthStore.getState().loading && !useAuthStore.getState().user) router.push("/login");
  }, [router]);

  useEffect(() => {
    if (!user) return;
    api.get("/notifications/unread-count").then((r) => setUnreadCount(r.data)).catch(() => {});
  }, [user, pathname]);

  const handleLogout = () => { logout(); router.push("/login"); };
  const userName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email : "";
  const initials = userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className="min-h-screen flex bg-background">
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 flex flex-col gradient-sidebar border-r border-teal-900/30 text-slate-200 transition-all duration-200 ${collapsed ? "w-[68px]" : "w-64"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-3 h-16 px-4 border-b border-teal-900/40">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-xs shrink-0">AX</div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">AMDOX ERP</p>
              <p className="text-[10px] text-teal-400/70 tracking-wider">v1.0 · 2026</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex ml-auto p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && <p className="px-2 text-[10px] font-semibold text-teal-500/60 uppercase tracking-widest mb-1.5">{group.label}</p>}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-all mb-0.5 ${
                      active
                        ? "bg-teal-500/20 text-teal-300 font-medium shadow-sm border border-teal-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`}>
                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-teal-400" : ""}`} />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {"badge" in item && item.badge && (
                          <Badge variant="brand" className="text-[10px] px-1.5 py-0">{item.badge}</Badge>
                        )}
                        {item.href === "/dashboard/notifications" && unreadCount > 0 && (
                          <Badge variant="destructive" className="text-[10px] px-1.5">{unreadCount}</Badge>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        {!collapsed && (
          <div className="p-3 border-t border-teal-900/40">
            <div className="rounded-lg bg-teal-500/10 border border-teal-500/20 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-xs font-semibold text-teal-300">AI Assistant</span>
              </div>
              <p className="text-[10px] text-teal-400/70 leading-relaxed">3 reorder alerts · Forecast updated 2h ago</p>
            </div>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-10">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search modules, contacts, invoices..."
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>
          </div>
          <div className="flex-1 sm:flex-none" />
          <Link href="/dashboard/notifications" className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{unreadCount}</span>
            )}
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-semibold">{initials}</div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium leading-tight">{userName}</p>
              <p className="text-[10px] text-muted-foreground">{user?.role?.replace(/_/g, " ")}</p>
            </div>
          </Link>
          <Button variant="ghost" size="icon-sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" />
          </Button>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto gradient-mesh">{children}</main>
      </div>
    </div>
  );
}
