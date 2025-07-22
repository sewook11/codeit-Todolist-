import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-4 px-2 flex items-center justify-center">
      <Link href="/">
        <img src="/img/logo.svg" alt="do it 로고" className="h-12 select-none cursor-pointer" />
      </Link>
    </header>
  );
} 