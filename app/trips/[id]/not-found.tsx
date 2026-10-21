import Link from "next/link";
import { Plane, LayoutDashboard, List } from "lucide-react";

export default function TripNotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <Plane className="w-10 h-10 text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        Trip Not Found
      </h1>
      <p className="text-slate-500 mb-8 max-w-sm">
        This trip might have been deleted or does not exist. It's no longer in your records.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/trips"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
        >
          <List className="w-4 h-4" /> View All Trips
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <LayoutDashboard className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}