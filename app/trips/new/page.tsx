"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import BackButton from "@/components/BackButton";
import { createClient } from "@/lib/supabase/client"; // NAYA IMPORT
import { showToast } from "@/lib/toast";

export default function NewTripPage() {
  const router = useRouter();
  const supabase = createClient(); // NAYA CLIENT
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      trip_name: form.get("trip_name") as string,
      start_date: form.get("start_date") as string,
      end_date: (form.get("end_date") as string) || null,
      country: (form.get("country") as string) || null,
      currency: (form.get("currency") as string) || "INR",
    };

    const { error } = await supabase.from("trips").insert(payload);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    showToast("Trip created successfully!", "success");
    router.push("/trips");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto">
      <BackButton label="Cancel" className="mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>New Trip</h1>
      <p className="text-sm text-slate-600 mb-6">Create a new trip to start tracking expenses.</p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Trip Name *</label>
          <input
            name="trip_name"
            required
            placeholder="e.g. Mumbai Business Trip March 2026"
            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date *</label>
            <input
              type="date"
              name="start_date"
              required
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">End Date</label>
            <input
              type="date"
              name="end_date"
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Country</label>
            <input
              name="country"
              placeholder="e.g. India"
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Currency</label>
            <select
              name="currency"
              defaultValue="INR"
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="SGD">SGD</option>
              <option value="AED">AED</option>
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-rose-600 bg-rose-50 p-2 rounded-lg">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-indigo-600 to-[#7B3FD6] text-white py-3 rounded-xl text-sm font-semibold hover:-translate-y-0.5 shadow-md transition-all disabled:opacity-50 mt-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Creating..." : "Create Trip"}
        </button>
      </form>
    </div>
  );
}