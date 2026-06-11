"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { UserPlus, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, firstName, lastName, companyName);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-sm">AX</div>
            <div>
              <h1 className="text-xl font-bold">Create Account</h1>
              <p className="text-xs text-muted-foreground">AMDOX ERP Suite · AMX-ERP-2026-04</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Set up your organization and start managing operations</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">First Name</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Last Name</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Company Name
              </label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your Organization" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Work Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-10 gradient-brand text-white border-0 hover:opacity-90">
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">Sign In</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
