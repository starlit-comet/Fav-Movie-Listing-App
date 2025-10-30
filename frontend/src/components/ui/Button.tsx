import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
};

const sizes: Record<NonNullable<Props["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-indigo-400",
  secondary:
    "bg-white text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-50 active:bg-indigo-100 disabled:text-indigo-400",
  ghost:
    "bg-transparent text-indigo-700 hover:bg-indigo-50 active:bg-indigo-100 disabled:text-indigo-300",
};

export default function Button({
  className = "",
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  loading,
  children,
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {leftIcon}
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
      ) : (
        children
      )}
      {rightIcon}
    </button>
  );
}
