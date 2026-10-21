"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";

export default function DeleteTripButton({ tripId, tripName }: { tripId: string, tripName: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirm1 = confirm(`Are you sure you want to delete "${tripName}"?`);
    if (!confirm1) return;

    const confirm2 = confirm("WARNING: This will permanently delete all expenses and bill images associated with this trip. This action cannot be undone. Proceed?");
    if (!confirm2) return;

    setLoading(true);

    try {
      // 1. Pehle expenses ki receipt_url nikaalo taaki storage se delete kar sakein
      const { data: expenses } = await supabase.from("expenses").select("receipt_url").eq("trip_id", tripId);
      
      const paths = (expenses || []).filter((e: { receipt_url: string | null }) => e.receipt_url).map((e: { receipt_url: string | null }) => e.receipt_url as string);
      
      // 2. Storage se bills delete karo
      if (paths.length > 0) {
        await supabase.storage.from("receipts").remove(paths);
      }

      // 3. Trip delete karo (Cascade delete se expenses bhi delete ho jayenge)
      const { error } = await supabase.from("trips").delete().eq("id", tripId);
      if (error) throw error;

      showToast("Trip deleted successfully", "success");
      router.push("/trips");
      router.refresh();
    } catch (err: any) {
      showToast(err.message, "error");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      Delete Trip
    </button>
  );
}