"use client";
import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", variant = "danger", onConfirm, onCancel }: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  const colors = {
    danger: { icon: "text-red-500", bg: "bg-red-50", btn: "bg-red-600 hover:bg-red-700" },
    warning: { icon: "text-amber-500", bg: "bg-amber-50", btn: "bg-amber-600 hover:bg-amber-700" },
    info: { icon: "text-blue-500", bg: "bg-blue-50", btn: "bg-blue-600 hover:bg-blue-700" },
  };

  const c = colors[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl border border-zinc-200 w-full max-w-md mx-4 p-6 animate-in zoom-in-95">
        <button onClick={onCancel} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${c.bg} ${c.icon}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
            <p className="text-sm text-zinc-500 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} disabled={loading} className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50">{cancelLabel}</button>
          <button onClick={handleConfirm} disabled={loading} className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${c.btn}`}>
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
