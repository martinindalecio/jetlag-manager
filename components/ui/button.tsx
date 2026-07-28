import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-slate-900 text-slate-50 hover:bg-slate-700 disabled:bg-slate-300",
  outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100",
  ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-9 px-3 text-sm",
  lg: "h-11 px-8 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
