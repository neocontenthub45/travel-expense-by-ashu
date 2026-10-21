"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Receipt, Plane, Loader2, Search } from "lucide-react";
import BackButton from "@/components/BackButton";
import { createClient } from "@/lib/supabase/client";
import type { Trip } from "@/lib/types";
import PageTransition from "@/components/PageTransition";
import EmptyState from "@/components/EmptyState";

export default function TripsPage() {
  const supabase = createClient();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchTrips() {
      const { data, error } = await supabase
        .from("trips")
        .select("id, trip_name, start_date, end_date, country, currency, claim_status")
        .order("start_date", { ascending: false });

      if (error) setError(error.message);
      else setTrips(data as Trip[]);
      setLoading(false);
    }
    fetchTrips();
  }, []);

  // Filter trips based on search
  const filteredTrips = trips.filter(t => 
    t.trip_name.toLowerCase().includes(search.toLowerCase()) || 
    (t.country && t.country.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>;
  if (error) return <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm">Failed to load trips: {error}</div>;

  return (
    <PageTransition>
      <div className="space-y-6">
                <div>
          <BackButton label="Back to Dashboard" className="mb-4" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>My Trips</h1>
            <p className="text-sm text-slate-600 mt-1">{trips.length} {trips.length === 1 ? "trip" : "trips"} recorded</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
              />
            </div>
            <Link href="/trips/new" className="px-4 py-2 rounded-xl bg-gradient-to-br from-indigo-600 to-[#7B3FD6] text-white text-sm font-semibold hover:-translate-y-0.5 shadow-md transition-all whitespace-nowrap">
              + New Trip
            </Link>
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <EmptyState
            icon={<Plane className="w-6 h-6" />}
            title={search ? "No trips found" : "No trips yet"}
            description={search ? "Try a different search term." : "Start by creating your first trip to track expenses and bills."}
            action={
              !search && (
                <Link href="/trips/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors">
                  <Receipt className="w-4 h-4" /> Create your first trip
                </Link>
              )
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredTrips.map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}`} className="block p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-bold text-slate-900 truncate" style={{ fontFamily: 'var(--font-display)' }}>{trip.trip_name}</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {trip.start_date}{trip.end_date ? ` → ${trip.end_date}` : ""}
                      {trip.country ? ` · ${trip.country}` : ""}{` · ${trip.currency}`}
                    </p>
                  </div>
                                    {(() => {
                    let label = "Ongoing";
                    let color = "bg-indigo-50 text-indigo-700";
                    
                    if (trip.claim_status === "closed") {
                      label = "Claim Pending";
                      color = "bg-amber-50 text-amber-700";
                    } else if (trip.claim_status === "claimed") {
                      label = "Claim Submitted"; // List view mein humein expenses ka data nahi pata, isliye generic rakha hai
                      color = "bg-blue-50 text-blue-700";
                    }

                    return (
                      <span className={`shrink-0 text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg ${color}`}>
                        {label}
                      </span>
                    );
                  })()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}