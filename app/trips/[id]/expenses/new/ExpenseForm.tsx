"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { uploadReceipt } from "@/lib/storage";
import type { Trip } from "@/lib/types";

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
  const [paymentType, setPaymentType] = useState<"online" | "offline">(
    "offline"
  );

  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = new FormData(e.currentTarget);

      let receiptPath: string | null = null;
      let fileSize = 0;

      if (file) {
        const uploaded = await uploadReceipt(file, trip.id);
        receiptPath = uploaded.path;
        fileSize = uploaded.size;
      }

      const payload = {
        trip_id: trip.id,
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

      router.push(`/trips/${trip.id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Expense</h1>
      <p className="text-sm text-gray-600 mb-4">
        {trip.trip_name} · {trip.currency}
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg border border-gray-200"
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              required
              placeholder="0.00"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="expense_date"
              required
              defaultValue={today}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            defaultValue="Food"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Type
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPaymentType("offline")}
              className={`flex-1 py-2 rounded-md text-sm border ${
                paymentType === "offline"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              💵 Offline (Cash)
            </button>
            <button
              type="button"
              onClick={() => setPaymentType("online")}
              className={`flex-1 py-2 rounded-md text-sm border ${
                paymentType === "online"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              💳 Online (Card/UPI)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bill / Receipt
          </label>
          <div className="flex gap-2">
            <label className="flex-1 text-center py-2 rounded-md text-sm border border-gray-300 bg-white text-gray-700 cursor-pointer hover:bg-gray-50">
              📷 Camera
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <label className="flex-1 text-center py-2 rounded-md text-sm border border-gray-300 bg-white text-gray-700 cursor-pointer hover:bg-gray-50">
              📎 Upload
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          {file && (
            <p className="text-xs text-gray-600 mt-2 truncate">
              Selected: {file.name} ({(file.size / 1024).toFixed(0)} KB)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <input
            name="notes"
            placeholder="Optional"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Expense"}
        </button>
      </form>
    </div>
  );
}