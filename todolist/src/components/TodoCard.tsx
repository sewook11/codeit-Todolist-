import React from "react";
import Checkbox from "./Checkbox";

export type TodoCardProps = {
  content: string;
  completed: boolean;
  onToggle: () => void;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export default function TodoCard({ content, completed, onToggle, onClick, className = "", disabled }: TodoCardProps) {
  return (
    <div
      className={`flex items-center px-6 py-3 rounded-full border-2 border-slate-900 shadow-[2px_2px_0_0_#0F172A] cursor-pointer transition-colors select-none font-nanum font-bold text-base mb-2 ${
        completed ? "bg-violet-100 text-slate-900" : "bg-white text-slate-900 hover:bg-slate-100"
      } ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      <Checkbox checked={completed} onChange={onToggle} className="mr-4" disabled={disabled} />
      <span className={`flex-1 truncate ${completed ? "line-through" : ""}`}>{content}</span>
    </div>
  );
} 