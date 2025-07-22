import React from "react";

export type SectionProps = {
  title: string;
  color: "lime" | "green";
  children: React.ReactNode;
  className?: string;
};

export default function Section({ title, color, children, className = "" }: SectionProps) {
  const colorClass =
    color === "lime"
      ? "bg-lime-300 text-slate-900"
      : "bg-green-700 text-white";
  return (
    <section className={`mb-8 ${className}`}>
      <div className={`inline-block px-6 py-1 rounded-full font-nanum font-bold text-base mb-4 shadow-[2px_2px_0_0_#0F172A] ${colorClass}`}>
        {title}
      </div>
      <div>{children}</div>
    </section>
  );
} 