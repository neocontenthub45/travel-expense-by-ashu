"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";

export default function ExpenseActions({ expenseId, tripId, receiptUrl }: { expenseId: string, tripId: string, receiptUrl: string | null }) {
  const router = useRouter();
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    
    setIsDeleting(true);
    try {
      // Agar bill attached hai toh storage se pehle delete karo
      if (receiptUrl) {
        await supabase.storage.from("receipts").remove([receiptUrl]);
      }
      
      // Phir database se delete karo
      const { error } = await supabase.from("expenses").delete().eq("id", expenseId);
      if (error) throw error;

      showToast("Expense deleted", "success");
      router.refresh();
    } catch (err: any) {
      showToast(err.message, "error");
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/trips/${tripId}/expenses/${expenseId}/edit`}
        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
        title="Edit Expense"
      >
        <Edit2 className="w-4 h-4" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50"
        title="Delete Expense"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}