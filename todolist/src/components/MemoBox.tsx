import React from "react";

export type MemoBoxProps = {
  value: string;
  onChange?: (v: string) => void;
  editable?: boolean;
  className?: string;
};

export default function MemoBox({ value, onChange, editable = false, className = "" }: MemoBoxProps) {
  return (
    <div
      className={`relative rounded-xl min-h-[120px] w-full p-4 ${className}`}
      style={{
        backgroundImage: "url('/img/memo.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="font-nanum font-bold text-base text-center mb-2 text-amber-800">Memo</div>
      {editable ? (
        <textarea
          className="w-full bg-transparent font-nanum text-base text-slate-900 resize-none outline-none min-h-[80px]"
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder="메모를 입력하세요"
        />
      ) : (
        <div className="font-nanum text-base text-slate-900 whitespace-pre-line break-words min-h-[80px]">{value}</div>
      )}
    </div>
  );
} 