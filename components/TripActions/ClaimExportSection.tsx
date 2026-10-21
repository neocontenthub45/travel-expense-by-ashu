"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, CheckCircle, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";
import type { Expense, Trip } from "@/lib/types";

export default function ClaimExportSection({ trip, expenses }: { trip: Trip, expenses: Expense[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");

  // Export Function (CSV + Images in ZIP)
  async function handleExport() {
    setLoading(true);
    setAction("export");
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId: trip.id }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Base64 ko download link mein convert karo
      const link = document.createElement("a");
      link.href = `data:application/zip;base64,${data.zipBase64}`;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Database mein mark karo ki export ho gaya
      await supabase
        .from("expenses")
        .update({ claim_status: "exported", exported_at: new Date().toISOString() })
        .eq("trip_id", trip.id);

      showToast("Bills exported successfully!", "success");
      router.refresh();
    } catch (err: any) {
      showToast(err.message || "Export failed", "error");
    } finally {
      setLoading(false);
      setAction("");
    }
  }

  // Claim Mark karne ka function
  async function handleClaim() {
    setLoading(true);
    setAction("claim");
    try {
      const { error } = await supabase
        .from("trips")
        .update({ claim_status: "claimed" })
        .eq("id", trip.id);
      
      await supabase
        .from("expenses")
        .update({ claim_status: "claimed", claimed_at: new Date().toISOString() })
        .eq("trip_id", trip.id);

      if (error) throw error;
      showToast("Trip marked as claimed!", "success");
      router.refresh();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
      setAction("");
    }
  }

  // Delete Bills Function (Storage Free karne ke liye)
  async function handleDeleteBills() {
    if (!confirm("Are you sure? This will permanently delete all bill photos from storage. The expense amounts will remain in the list.")) return;
    
    setLoading(true);
    setAction("delete");
    try {
      // 1. Storage se files delete karo
      const paths = expenses.filter(e => e.receipt_url).map(e => e.receipt_url as string);
      if (paths.length > 0) {
        await supabase.storage.from("receipts").remove(paths);
      }

      // 2. Database mein update karo (receipt_url null, status deleted)
      await supabase
        .from("expenses")
        .update({ 
          receipt_url: null, 
          file_size: 0,
          claim_status: "deleted", 
          file_deleted_at: new Date().toISOString() 
        })
        .eq("trip_id", trip.id);

      showToast("Bills deleted from storage successfully.", "success");
      router.refresh();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
      setAction("");
    }
  }

  const allExported = expenses.every(e => e.claim_status === "exported" || e.claim_status === "deleted");
  const hasFiles = expenses.some(e => e.receipt_url);

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={loading || expenses.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 disabled:opacity-50 transition-colors"
      >
        {loading && action === "export" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Export ZIP
      </button>

      {/* Claim Button */}
      {trip.claim_status !== "claimed" && (
        <button
          onClick={handleClaim}
          disabled={loading || expenses.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 disabled:opacity-50 transition-colors"
        >
          {loading && action === "claim" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          Mark as Claimed
        </button>
      )}

      {/* Delete Bills Button (Sirf tab dikhega jab files hon) */}
      {hasFiles && (
        <button
          onClick={handleDeleteBills}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium hover:bg-rose-100 disabled:opacity-50 transition-colors"
        >
          {loading && action === "delete" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete Bills
        </button>
      )}
    </div>
  );
}