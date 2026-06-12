import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "brand" | "success" | "warning" | "destructive" | "default";
  className?: string;
}

const variants = {
  brand: "badge-brand",
  success: "badge-success",
  warning: "badge-warning",
  destructive: "badge-destructive",
  default: "bg-zinc-100 text-zinc-700 border border-zinc-200",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
