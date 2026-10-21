"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";
import { Loader2 } from "lucide-react";
import type { Expense } from "@/lib/types";

const CATEGORIES = ["Food", "Taxi", "Hotel", "Flight", "Train", "Bus", "Fuel", "Shopping", "Other"];

export default function EditExpenseForm({ expense }: { expense: Expense }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const payload = {
        amount: Number(formData.get("amount")),
        category: formData.get("category") as string,
        payment_type: formData.get("payment_type") as "online" | "offline",
        expense_date: formData.get("expense_date") as string,
        notes: (formData.get("notes") as string) || null,
      };

      const { error } = await supabase.from("expenses").update(payload).eq("id", expense.id);
      if (error) throw error;

      showToast("Expense updated", "success");
      router.push(`/trips/${expense.trip_id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
          <input type="number" step="0.01" name="amount" required defaultValue={expense.amount} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
          <input type="date" name="expense_date" required defaultValue={expense.expense_date} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <select name="category" defaultValue={expense.category || "Other"} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Payment Type</label>
        <select name="payment_type" defaultValue={expense.payment_type || "offline"} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600">
          <option value="offline">Offline (Cash)</option>
          <option value="online">Online (Card/UPI)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
        <input name="notes" defaultValue={expense.notes || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600" />
      </div>
      {error && <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg">{error}</div>}
      <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}