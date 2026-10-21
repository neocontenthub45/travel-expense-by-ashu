import Link from "next/link";
import { Receipt, Plane } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Trip } from "@/lib/types";
import PageTransition from "@/components/PageTransition";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TripsPage() {
  const supabase = await createClient();
  const { data: trips, error } = await supabase
    .from("trips")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm">
        Failed to load trips: {error.message}
      </div>
    );
  }

  const list = (trips as Trip[]) || [];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Trips</h1>
            <p className="text-sm text-slate-600 mt-1">
              {list.length} {list.length === 1 ? "trip" : "trips"} recorded
            </p>
          </div>
          <Link
            href="/trips/new"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            + New Trip
          </Link>
        </div>

        {list.length === 0 ? (
          <EmptyState
            icon={<Plane className="w-6 h-6" />}
            title="No trips yet"
            description="Start by creating your first trip to track expenses and bills."
            action={
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors"
              >
                <Receipt className="w-4 h-4" />
                Create your first trip
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {list.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="block p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900 truncate">
                      {trip.trip_name}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      {trip.start_date}
                      {trip.end_date ? ` → ${trip.end_date}` : ""}
                      {trip.country ? ` · ${trip.country}` : ""}
                      {` · ${trip.currency}`}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${
                      trip.claim_status === "ongoing"
                        ? "bg-indigo-50 text-indigo-700"
                        : trip.claim_status === "claimed"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {trip.claim_status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}