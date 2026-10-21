"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { uploadReceipt } from "@/lib/storage";
import { Loader2, Camera, Paperclip } from "lucide-react";
import { showToast } from "@/lib/toast";
import type { Trip } from "@/lib/types";

const CATEGORIES = ["Food", "Taxi", "Hotel", "Flight", "Train", "Bus", "Fuel", "Shopping", "Other"];

export default function GlobalExpenseForm({ activeTrips }: { activeTrips: Trip[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [paymentType, setPaymentType] = useState<"online" | "offline">("offline");
  const [selectedTripId, setSelectedTripId] = useState(activeTrips[0]?.id || "");
  
  const today = new Date().toISOString().slice(0, 10);
  const selectedTrip = activeTrips.find(t => t.id === selectedTripId);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedTripId) return showToast("Please select a trip", "error");
    
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in");

      const formData = new FormData(e.currentTarget);
      let receiptPath = null;
      let fileSize = 0;

      if (file) {
        const uploaded = await uploadReceipt(file, selectedTripId, user.id);
        receiptPath = uploaded.path;
        fileSize = uploaded.size;
      }

      const payload = {
        trip_id: selectedTripId,
        user_id: user.id,
        amount: Number(formData.get("amount")),
        currency: selectedTrip?.currency || "INR",
        category: formData.get("category") as string,
        payment_type: paymentType,
        expense_date: formData.get("expense_date") as string,
        notes: (formData.get("notes") as string) || null,
        receipt_url: receiptPath,
        file_size: fileSize,
        claim_status: "pending",
      };

      const { error: insertError } = await supabase.from("expenses").insert(payload);
      if (insertError) throw insertError;

      showToast("Expense added successfully", "success");
      router.push(`/dashboard`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (activeTrips.length === 0) {
    return <div className="text-center p-6 bg-white rounded-xl border">No ongoing trips found. Please create a new trip first.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Select Trip *</label>
        <select 
          value={selectedTripId} 
          onChange={(e) => setSelectedTripId(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600"
        >
          {activeTrips.map(t => <option key={t.id} value={t.id}>{t.trip_name} ({t.currency})</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
          <input type="number" step="0.01" name="amount" required placeholder="0.00" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
          <input type="date" name="expense_date" required defaultValue={today} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <select name="category" defaultValue="Food" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Payment Type</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPaymentType("offline")} className={`flex-1 py-2 rounded-lg text-sm border ${paymentType === "offline" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-300"}`}>💵 Offline</button>
          <button type="button" onClick={() => setPaymentType("online")} className={`flex-1 py-2 rounded-lg text-sm border ${paymentType === "online" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-300"}`}>💳 Online</button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Bill / Receipt</label>
        <div className="flex gap-2">
          <label className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border bg-white cursor-pointer hover:bg-slate-50"><Camera className="w-4 h-4" /> Camera<input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} /></label>
          <label className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border bg-white cursor-pointer hover:bg-slate-50"><Paperclip className="w-4 h-4" /> Upload<input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} /></label>
        </div>
        {file && <p className="text-xs text-slate-500 mt-1">Selected: {file.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
        <input name="notes" placeholder="Optional..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
      </div>

      {error && <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg">{error}</div>}
      <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Expense"}
      </button>
    </form>
  );
}