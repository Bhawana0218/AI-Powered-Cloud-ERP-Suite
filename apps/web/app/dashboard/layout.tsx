"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import {
  LayoutDashboard, Users, Handshake, Kanban, Package,
  FileText, Warehouse, UserCircle, Building2, FolderKanban,
  ChevronLeft, ChevronRight, LogOut, Menu,
} from "lucide-react";

const navGroups = [
  { label: "Main", items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "CRM", items: [
    { href: "/dashboard/crm/contacts", label: "Contacts", icon: Users },
    { href: "/dashboard/crm/deals", label: "Deals", icon: Handshake },
    { href: "/dashboard/crm/pipeline", label: "Pipeline", icon: Kanban },
  ]},
  { label: "Sales", items: [
    { href: "/dashboard/sales/products", label: "Products", icon: Package },
    { href: "/dashboard/sales/invoices", label: "Invoices", icon: FileText },
  ]},
  { label: "Inventory", items: [{ href: "/dashboard/inventory", label: "Inventory", icon: Warehouse }] },
  { label: "HR", items: [
    { href: "/dashboard/hr/employees", label: "Employees", icon: UserCircle },
    { href: "/dashboard/hr/departments", label: "Departments", icon: Building2 },
  ]},
  { label: "Projects", items: [{ href: "/dashboard/projects", label: "Projects", icon: FolderKanban }] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loadUser } = useAuthStore();

  useEffect(() => { loadUser(); }, [loadUser]);
  useEffect(() => {
    if (!useAuthStore.getState().loading && !useAuthStore.getState().user) router.push("/login");
  }, [router]);

  const handleLogout = () => { logout(); router.push("/login"); };
  const userName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email : "";

  return (
    <div className="min-h-screen flex bg-zinc-50">
      {mobileOpen && <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 flex flex-col bg-white border-r border-zinc-200 transition-all duration-200 ${collapsed ? "w-16" : "w-60"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between h-14 px-4 border-b border-zinc-200">
          {!collapsed && <span className="font-bold text-zinc-800 text-sm tracking-wide">ERP Suite</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && <p className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">{group.label}</p>}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${
                      active ? "bg-blue-50 text-blue-700 font-medium" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}>
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Link href="/dashboard/settings" className="text-sm text-zinc-600 hover:text-zinc-900">{userName}</Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
