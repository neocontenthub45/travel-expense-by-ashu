"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { uploadReceipt } from "@/lib/storage";
import type { Trip } from "@/lib/types";
import { Loader2, Camera, Paperclip } from "lucide-react";
import { showToast } from "@/lib/toast";

const CATEGORIES = [
  "Food",
  "Taxi",
  "Hotel",
  "Flight",
  "Train",
  "Bus",
  "Fuel",
  "Shopping",
  "Other",
];

export default function ExpenseForm({ trip }: { trip: Trip }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [paymentType, setPaymentType] = useState<"online" | "offline">("offline");

  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("You must be logged in");

      const form = new FormData(e.currentTarget);

      let receiptPath: string | null = null;
      let fileSize = 0;

      if (file) {
        const uploaded = await uploadReceipt(file, trip.id, user.id);
        receiptPath = uploaded.path;
        fileSize = uploaded.size;
      }

      const payload = {
        trip_id: trip.id,
        user_id: user.id, // <--- IMPORTANT
        amount: Number(form.get("amount")),
        currency: trip.currency,
        category: (form.get("category") as string) || null,
        payment_type: paymentType,
        expense_date: form.get("expense_date") as string,
        notes: (form.get("notes") as string) || null,
        receipt_url: receiptPath,
        file_size: fileSize,
      };

      const { error: insertError } = await supabase
        .from("expenses")
        .insert(payload);

      if (insertError) throw insertError;

      showToast("Expense added successfully", "success");
      router.push(`/trips/${trip.id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Add Expense</h1>
      <p className="text-sm text-slate-600 mb-6">
        {trip.trip_name} · {trip.currency}
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              required
              placeholder="0.00"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="expense_date"
              required
              defaultValue={today}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            name="category"
            defaultValue="Food"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Payment Type
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPaymentType("offline")}
              className={`flex-1 py-2 rounded-lg text-sm border font-medium transition-colors ${
                paymentType === "offline"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
              }`}
            >
              💵 Offline (Cash)
            </button>
            <button
              type="button"
              onClick={() => setPaymentType("online")}
              className={`flex-1 py-2 rounded-lg text-sm border font-medium transition-colors ${
                paymentType === "online"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
              }`}
            >
              💳 Online (Card/UPI)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Bill / Receipt
          </label>
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm border border-slate-300 bg-white text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
              <Camera className="w-4 h-4" />
              Camera
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm border border-slate-300 bg-white text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
              <Paperclip className="w-4 h-4" />
              Upload
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          {file && (
            <p className="text-xs text-slate-600 mt-2 truncate">
              Selected: {file.name} ({(file.size / 1024).toFixed(0)} KB)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Notes
          </label>
          <input
            name="notes"
            placeholder="Optional details..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
          />
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-70 transition-colors mt-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Saving..." : "Save Expense"}
        </button>
      </form>
    </div>
  );
}