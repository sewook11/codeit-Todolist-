import React from "react";

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export default function Checkbox({ checked, onChange, disabled, className = "" }: CheckboxProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-checked={checked}
      className={`w-7 h-7 flex items-center justify-center transition-colors select-none ${className}`}
      onClick={() => !disabled && onChange(!checked)}
    >
      {checked ? (
        <img src="/img/checkbox-on.svg" alt="완료됨" className="w-7 h-7" />
      ) : (
        <img src="/img/checkbox-off.svg" alt="미완료" className="w-7 h-7" />
      )}
    </button>
  );
} 