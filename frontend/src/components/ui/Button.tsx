import * as React from "react";

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const baseClasses =
  "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saleh-primary disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-saleh-primary text-black hover:bg-saleh-secondary",
  outline: "border border-saleh-border bg-transparent text-saleh-text hover:bg-saleh-card",
  ghost: "bg-transparent text-saleh-text hover:bg-saleh-card"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base"
};

export function Button({
  className = "",
  variant = "default",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return <button type={type} className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()} {...props} />;
}
