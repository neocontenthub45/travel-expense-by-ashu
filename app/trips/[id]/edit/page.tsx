"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";
import { Loader2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import type { Trip } from "@/lib/types";
import { use } from "react";

export default function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrip() {
      const { data, error } = await supabase.from("trips").select("*").eq("id", id).single();
      if (error) setError(error.message);
      else setTrip(data as Trip);
      setLoading(false);
    }
    fetchTrip();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const payload = {
        trip_name: formData.get("trip_name") as string,
        start_date: formData.get("start_date") as string,
        end_date: (formData.get("end_date") as string) || null,
        country: (formData.get("country") as string) || null,
        currency: formData.get("currency") as string,
      };

      const { error } = await supabase.from("trips").update(payload).eq("id", id);
      if (error) throw error;

      showToast("Trip updated successfully", "success");
      router.push(`/trips/${id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>;
  if (!trip) return <div className="p-10 text-center text-rose-600">Trip not found</div>;

  return (
    <PageTransition>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Trip</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Trip Name *</label>
            <input name="trip_name" required defaultValue={trip.trip_name} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date *</label>
              <input type="date" name="start_date" required defaultValue={trip.start_date} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input type="date" name="end_date" defaultValue={trip.end_date || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
              <input name="country" defaultValue={trip.country || ""} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
              <select name="currency" defaultValue={trip.currency} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600">
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="SGD">SGD</option>
                <option value="AED">AED</option>
              </select>
            </div>
          </div>
          {error && <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg">{error}</div>}
          <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 mt-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </PageTransition>
  );
}