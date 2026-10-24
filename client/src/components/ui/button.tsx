import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none rounded-full";

    const variantStyles = {
      primary: "bg-[#111111] hover:bg-[#262626] text-white shadow-xs hover:shadow-sm",
      secondary: "bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 hover:border-black/25 shadow-xs",
      outline: "border border-black/15 hover:border-black/35 text-neutral-800 bg-transparent hover:bg-black/[0.03]",
      ghost: "text-neutral-700 hover:text-black hover:bg-black/[0.05]",
      danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs",
    };

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3.5 text-base gap-2.5 font-semibold",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
