import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ className = "", children, ...props }: CardProps) => {
  return (
    <div
      className={`rounded-2xl border border-black/[0.08] bg-white p-6 shadow-xs transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className = "", children, ...props }: CardProps) => {
  return (
    <div className={`mb-4 flex flex-col space-y-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3
      className={`text-lg font-bold tracking-tight text-[#111111] ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p className={`text-xs text-neutral-500 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ className = "", children, ...props }: CardProps) => {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className = "", children, ...props }: CardProps) => {
  return (
    <div className={`mt-5 pt-3 border-t border-black/[0.06] flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
};
