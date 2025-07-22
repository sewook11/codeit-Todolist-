import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "success" | "lime" | "icon";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

const base =
  "font-nanum font-bold flex items-center justify-center transition-colors select-none focus:outline-none border-2 border-slate-900 shadow-[2px_2px_0_0_#0F172A] disabled:opacity-50 disabled:cursor-not-allowed";
const variants = {
  primary: "bg-violet-600 text-white hover:bg-violet-700 border-violet-600",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-900",
  danger: "bg-rose-500 text-white hover:bg-rose-600 border-rose-500",
  success: "bg-slate-100 text-slate-900 border-slate-900 hover:bg-slate-200",
  lime: "bg-lime-300 text-slate-900 border-lime-300 hover:bg-lime-400",
  icon: "bg-slate-100 text-slate-900 border-slate-900 hover:bg-slate-200 p-0 w-10 h-10 rounded-full justify-center",
};
const sizes = {
  sm: "px-3 py-1 text-sm h-8",
  md: "px-5 py-2 text-base h-11",
  lg: "px-7 py-3 text-lg h-14",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-full ${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      {children}
    </button>
  );
} 