"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { user, loadUser, loading } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">Enterprise AI ERP Suite</h1>
        <p className="text-lg text-zinc-600 mb-8">
          AI-Powered Cloud Enterprise Resource Planning System
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-white text-zinc-700 border border-zinc-300 rounded-xl font-medium hover:bg-zinc-50 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
