import Link from "next/link";
import { Plane, ArrowLeft } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function TripNotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <Plane className="w-8 h-8 text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        Trip Not Found
      </h1>
      <p className="text-slate-500 mb-8 max-w-sm">
        This trip might have been deleted or does not exist.
      </p>
      <div className="flex flex-col gap-3">
        <BackButton label="Go Back" />
        <Link
          href="/trips"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          View My Trips
        </Link>
      </div>
    </div>
  );
}