"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Back", className = "" }: { label?: string, className?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-slate-500 bg-white border border-slate-200 shadow-sm hover:shadow hover:text-slate-900 hover:border-slate-300 transition-all ${className}`}
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      {label}
    </button>
  );
}