"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function GlobalExportButton() {
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());

  async function handleExport() {
    if (!year) return showToast("Please select a year", "error");
    
    setLoading(true);
    try {
      const res = await fetch("/api/export-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: month || null, year }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const link = document.createElement("a");
      link.href = `data:text/csv;base64,${data.csvBase64}`;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("Export downloaded!", "success");
    } catch (err: any) {
      showToast(err.message || "Export failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
      <span className="text-sm font-medium text-slate-700 mr-2">Export CSV:</span>
      
      <select 
        value={month} 
        onChange={(e) => setMonth(e.target.value)}
        className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm bg-white"
      >
        <option value="">Full Year</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
          <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'short' })}</option>
        ))}
      </select>

      <select 
        value={year} 
        onChange={(e) => setYear(e.target.value)}
        className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm bg-white"
      >
        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <button
        onClick={handleExport}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 ml-auto"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Download
      </button>
    </div>
  );
}