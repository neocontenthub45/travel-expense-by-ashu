"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, CheckCircle, Trash2, Loader2, Send, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";
import type { Expense, Trip } from "@/lib/types";

export default function ClaimExportSection({ trip, expenses }: { trip: Trip, expenses: Expense[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");

  async function handleExport() {
    setLoading(true); setAction("export");
    try {
      const res = await fetch("/api/export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tripId: trip.id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const link = document.createElement("a");
      link.href = `data:application/zip;base64,${data.zipBase64}`;
      link.download = data.fileName;
      link.click();

      await supabase.from("expenses").update({ claim_status: "exported", exported_at: new Date().toISOString() }).eq("trip_id", trip.id);
      showToast("Exported successfully!", "success");
      router.refresh();
    } catch (err: any) { showToast(err.message, "error"); } finally { setLoading(false); }
  }

    async function handleTripStatus(newStatus: string, expenseStatus: string | null) {
    if (!confirm(`Are you sure you want to mark this trip as ${newStatus}?`)) return;
    setLoading(true); setAction(newStatus);
    try {
      await supabase.from("trips").update({ claim_status: newStatus }).eq("id", trip.id);
      if (expenseStatus) {
        await supabase.from("expenses").update({ claim_status: expenseStatus, claimed_at: new Date().toISOString() }).eq("trip_id", trip.id);
      }
      showToast(`Trip marked as ${newStatus}`, "success");
      router.refresh();
    } catch (err: any) { showToast(err.message, "error"); } finally { setLoading(false); }
  }

  async function handleDeleteBills() {
    if (!confirm("Delete all bill photos from storage? (Expense amounts will remain)")) return;
    setLoading(true); setAction("delete");
    try {
      const paths = expenses.filter(e => e.receipt_url).map(e => e.receipt_url as string);
      if (paths.length > 0) await supabase.storage.from("receipts").remove(paths);
      await supabase.from("expenses").update({ receipt_url: null, file_size: 0, claim_status: "deleted", file_deleted_at: new Date().toISOString() }).eq("trip_id", trip.id);
      showToast("Bills deleted from storage.", "success");
      router.refresh();
    } catch (err: any) { showToast(err.message, "error"); } finally { setLoading(false); }
  }

  const hasFiles = expenses.some(e => e.receipt_url);

  return (
    <div className="flex flex-wrap gap-2 mb-6 p-3 bg-white border rounded-xl shadow-sm">
      <button onClick={handleExport} disabled={loading || expenses.length === 0} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 disabled:opacity-50">
        {loading && action === "export" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Export ZIP
      </button>

      {trip.claim_status === "ongoing" && (
        <button onClick={() => handleTripStatus("closed", null)} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 disabled:opacity-50">
          {loading && action === "closed" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} Mark Trip Completed
        </button>
      )}

      {trip.claim_status === "closed" && (
        <button onClick={() => handleTripStatus("claimed", "claimed")} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 disabled:opacity-50">
          {loading && action === "claimed" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Mark as Claimed
        </button>
      )}

      {hasFiles && (
        <button onClick={handleDeleteBills} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium hover:bg-rose-100 disabled:opacity-50 ml-auto">
          {loading && action === "delete" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete Bills
        </button>
      )}
    </div>
  );
}