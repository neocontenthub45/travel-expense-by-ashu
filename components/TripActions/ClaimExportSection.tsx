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
  const [optimisticStatus, setOptimisticStatus] = useState(trip.claim_status);
  const [optimisticClaimed, setOptimisticClaimed] = useState(false); // NAYA STATE

  const hasSubmitted = expenses.some(e => e.claim_status === "submitted" || e.claim_status === "claimed");
  const allClaimed = expenses.length > 0 && expenses.every(e => e.claim_status === "claimed");
  const hasFiles = expenses.some(e => e.receipt_url);

  async function handleMarkCompleted() {
    if (!confirm("Mark this trip as completed? You won't be able to add new expenses.")) return;
    setLoading(true); setAction("completed");
    setOptimisticStatus("closed"); // UI turant update
    try {
      await supabase.from("trips").update({ claim_status: "closed" }).eq("id", trip.id);
      showToast("Trip marked as completed", "success");
      router.refresh();
    } catch (err: any) { 
      showToast(err.message, "error"); 
      setOptimisticStatus(trip.claim_status); // Revert on fail
    } finally { setLoading(false); setAction(""); }
  }

  async function handleSubmitClaim() {
    setLoading(true); setAction("submit");
    setOptimisticStatus("claimed"); // UI turant update
    try {
      await supabase.from("trips").update({ claim_status: "claimed" }).eq("id", trip.id);
      await supabase.from("expenses").update({ claim_status: "submitted", claimed_at: new Date().toISOString() }).eq("trip_id", trip.id);
      showToast("Claim submitted!", "success");
      router.refresh();
    } catch (err: any) { 
      showToast(err.message, "error"); 
      setOptimisticStatus(trip.claim_status);
    } finally { setLoading(false); setAction(""); }
  }

    async function handleMarkClaimed() {
    if (!confirm("Mark this claim as settled/claimed?")) return;
    setLoading(true); 
    setAction("claimed");
    setOptimisticClaimed(true); // Button ko turant hide/disable kar do
    
    try {
      await supabase.from("expenses").update({ claim_status: "claimed" }).eq("trip_id", trip.id);
      showToast("Claim settled!", "success");
      router.refresh();
    } catch (err: any) { 
      showToast(err.message, "error"); 
      setOptimisticClaimed(false); // Error aaye toh wapas dikha do
    } finally { 
      setLoading(false); 
      setAction(""); 
    }
    }

  // Delete bills function same rahega...
  async function handleDeleteBills() {
    if (!confirm("Delete all bill photos? Expense amounts will remain.")) return;
    setLoading(true); setAction("delete");
    try {
      const paths = expenses.filter(e => e.receipt_url).map(e => e.receipt_url as string);
      if (paths.length > 0) await supabase.storage.from("receipts").remove(paths);
      await supabase.from("expenses").update({ receipt_url: null, file_size: 0, file_deleted_at: new Date().toISOString() }).eq("trip_id", trip.id);
      showToast("Bills deleted.", "success");
      router.refresh();
    } catch (err: any) { showToast(err.message, "error"); } finally { setLoading(false); setAction(""); }
  }
  
  async function handleExport() {
    // ... export logic (same as before)
    setLoading(true); setAction("export");
    try {
      const res = await fetch("/api/export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tripId: trip.id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const link = document.createElement("a");
      link.href = `data:application/zip;base64,${data.zipBase64}`;
      link.download = data.fileName;
      link.click();
      showToast("Exported successfully!", "success");
    } catch (err: any) { showToast(err.message, "error"); } finally { setLoading(false); setAction(""); }
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6 p-3 bg-white border rounded-xl shadow-sm">
      <button onClick={handleExport} disabled={loading || expenses.length === 0} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 disabled:opacity-50">
        {loading && action === "export" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Export
      </button>

      {optimisticStatus === "ongoing" && (
        <button onClick={handleMarkCompleted} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100">
          {loading && action === "completed" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} Mark Completed
        </button>
      )}

      {optimisticStatus === "closed" && (
        <button onClick={handleSubmitClaim} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100">
          {loading && action === "submit" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Submit Claim
        </button>
      )}

            {optimisticStatus === "claimed" && !allClaimed && !optimisticClaimed && (
        <button onClick={handleMarkClaimed} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100">
          {loading && action === "claimed" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Mark as Claimed
        </button>
      )}
    </div>
  );
}