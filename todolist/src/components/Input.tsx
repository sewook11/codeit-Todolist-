import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block mb-1 text-sm font-bold text-slate-900 font-nanum">{label}</label>}
      <input
        className={`w-full font-nanum font-regular border-2 border-slate-900 rounded-full px-5 py-2 text-base bg-slate-100 focus:ring-2 focus:ring-violet-600 focus:border-violet-600 placeholder:text-slate-400 shadow-[2px_2px_0_0_#0F172A] ${error ? "border-rose-500" : "border-slate-900"} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-500 font-nanum">{error}</p>}
    </div>
  );
} 