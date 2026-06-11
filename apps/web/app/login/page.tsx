"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@erp.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh px-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-sm">AX</div>
            <div>
              <h1 className="text-xl font-bold">Welcome Back</h1>
              <p className="text-xs text-muted-foreground">AMDOX ERP Suite</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Sign in to your enterprise dashboard</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-10 gradient-brand text-white border-0 hover:opacity-90">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-700">
            <strong>Demo:</strong> admin@erp.local / admin123
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">Register</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
