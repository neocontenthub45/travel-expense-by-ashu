import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Trip } from "@/lib/types";


export default async function TripsPage() {
  const { data: trips, error } = await supabase
    .from("trips")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    return <p className="text-red-600">Error loading trips: {error.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
        <Link
          href="/trips/new"
          className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
        >
          + New Trip
        </Link>
      </div>

      {!trips || trips.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">Abhi koi trip nahi hai.</p>
          <Link
            href="/trips/new"
            className="inline-block mt-3 text-black underline text-sm"
          >
            Pehli trip banao
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {(trips as Trip[]).map((trip) => (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-400 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">{trip.trip_name}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {trip.start_date}
                    {trip.end_date ? ` → ${trip.end_date}` : ""}
                    {trip.country ? ` · ${trip.country}` : ""}
                    {` · ${trip.currency}`}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    trip.claim_status === "ongoing"
                      ? "bg-blue-100 text-blue-700"
                      : trip.claim_status === "claimed"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
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
  );
}