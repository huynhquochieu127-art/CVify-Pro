import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "outline";
  children: React.ReactNode;
}

export const Badge = ({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) => {
  const variantStyles = {
    default: "bg-[#111111] text-white",
    secondary: "bg-neutral-100 text-neutral-800",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200/80",
    warning: "bg-amber-50 text-amber-800 border border-amber-200/80",
    danger: "bg-rose-50 text-rose-800 border border-rose-200/80",
    outline: "bg-transparent text-neutral-700 border border-black/15",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
