"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import Link from "next/link";
import {
  ArrowRight, BarChart3, Brain, Shield, Zap, Globe,
  Users, Package, LineChart, CheckCircle2, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Brain, title: "AI Demand Forecasting", desc: "Prophet + LSTM models predict SKU demand with <12% MAPE" },
  { icon: BarChart3, title: "Business Intelligence", desc: "Drag-and-drop dashboards with real-time drill-down analytics" },
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 aligned, GDPR compliant, multi-tenant isolation" },
  { icon: Zap, title: "Automated Workflows", desc: "Intelligent approvals cut cycle time from days to minutes" },
  { icon: Globe, title: "Multi-Currency GL", desc: "Double-entry accounting with FX auto-fetch and period close" },
  { icon: Package, title: "Supply Chain", desc: "PO lifecycle, vendor portal, reorder automation" },
];

const modules = [
  { name: "Finance", icon: LineChart },
  { name: "HR & Payroll", icon: Users },
  { name: "CRM", icon: Sparkles },
  { name: "Inventory", icon: Package },
];

const stats = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<300ms", label: "API Latency" },
  { value: "2,000+", label: "Concurrent Users" },
  { value: "6+", label: "Integrated Modules" },
];

export default function Home() {
  const router = useRouter();
  const { user, loadUser, loading } = useAuthStore();

  useEffect(() => { loadUser(); }, [loadUser]);
  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          Loading platform...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass-light border-b border-teal-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-sm">AX</div>
            <div>
              <p className="font-bold text-sm text-foreground leading-tight">AMDOX TECHNOLOGIES</p>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">AMX-ERP-2026-04</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#modules" className="hover:text-foreground transition-colors">Modules</a>
            <a href="#platform" className="hover:text-foreground transition-colors">Platform</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gradient-brand text-white border-0 hover:opacity-90">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="gradient-hero text-white max-w-full px-4 sm:px-6 pt-20 pb-16 text-center glow-teal">
        <div className="max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Next-Generation Intelligent ERP Platform
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
          Enterprise <span className="text-gradient">AI-Powered</span> Cloud ERP Suite
        </h1>
        <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Consolidate finance, HR, supply chain, and business intelligence into one intelligent platform.
          Built for mid-market and enterprise organisations operating across geographies.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="gradient-brand text-white border-0 px-8 h-11 hover:opacity-90">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="px-8 h-11">
              View Live Demo
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Demo: admin@erp.local / admin123
        </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 gradient-mesh py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-5 text-center">
              <p className="text-2xl font-bold text-gradient">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Built for Enterprise Scale</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Machine learning, real-time analytics, and automated workflows — purpose-built for modern organisations.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-teal-300/50 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-4 group-hover:gradient-brand group-hover:text-white transition-all">
                  <Icon className="w-5 h-5 text-teal-700 group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="modules" className="bg-card border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-foreground">Unified Business Platform</h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Eliminate data silos across 6+ legacy systems. One platform for C-suite dashboards,
                finance automation, HR lifecycle, supply chain, and project management.
              </p>
              <ul className="mt-6 space-y-3">
                {["Multi-tenant SaaS with SAML/OIDC SSO", "Immutable audit trail & GDPR compliance", "REST + GraphQL API with OpenAPI 3.1", "PWA support with offline sync"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4 flex-1 max-w-md">
              {modules.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.name} className="gradient-brand rounded-xl p-6 text-white text-center">
                    <Icon className="w-8 h-8 mx-auto mb-3 opacity-90" />
                    <p className="font-semibold text-sm">{m.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-foreground">Ready to transform your operations?</h2>
        <p className="text-muted-foreground mt-3 mb-8">Join Amdox Technologies&apos; next-generation ERP platform.</p>
        <Link href="/register">
          <Button size="lg" className="gradient-brand text-white border-0 px-10 h-12 hover:opacity-90">
            Launch Your ERP Suite <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p className="font-medium text-foreground">AMDOX TECHNOLOGIES</p>
        <p className="mt-1">Enterprise AI-Powered Cloud ERP Suite · Project Code AMX-ERP-2026-04 · April 2026</p>
        <p className="mt-1">Confidential · Version 1.0</p>
      </footer>
    </div>
  );
}
