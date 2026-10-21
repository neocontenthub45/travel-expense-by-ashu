import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plane, Receipt, CheckCircle2, Clock, ArrowRight, FolderOpen, Plus, Lock } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlobalExportButton from "@/components/Dashboard/GlobalExportButton";
import StorageBar from "@/components/Dashboard/StorageBar";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Profile fetch
  let userName = "there";
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
    if (profile?.full_name) userName = profile.full_name;
  }

  const { data: trips } = await supabase.from("trips").select("*").order("start_date", { ascending: false });
  const { data: expenses } = await supabase.from("expenses").select("amount, claim_status, trip_id, file_size");

  const t = trips || [];
  const e = expenses || [];

  const totalTrips = t.length;
  const activeTrips = t.filter(trip => trip.claim_status === "ongoing");
  const totalSpent = e.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalClaimed = e.filter(exp => exp.claim_status === "claimed").reduce((acc, curr) => acc + Number(curr.amount), 0);
  
  const tripsPendingSubmission = t.filter(trip => trip.claim_status === "closed");
  const pendingSubmissionAmount = e.filter(exp => tripsPendingSubmission.some(trip => trip.id === exp.trip_id)).reduce((acc, curr) => acc + Number(curr.amount), 0);
  const submittedPendingAmount = e.filter(exp => exp.claim_status === "submitted").reduce((acc, curr) => acc + Number(curr.amount), 0);

  // NAYA: Ongoing trips ka total expense calculate karo
  const ongoingTripExpenses = e.filter(exp => activeTrips.some(trip => trip.id === exp.trip_id)).reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <PageTransition>
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>Welcome, {userName} 👋</h1>
            <p className="text-slate-500 text-sm mt-1">Here is your financial overview.</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link href="/dashboard/expenses/new" className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-gradient-to-br from-indigo-600 to-[#7B3FD6] text-white text-[13px] sm:text-sm font-semibold shadow-md hover:-translate-y-0.5 transition-all flex-1 sm:flex-none">
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Expense
            </Link>
            <Link href="/trips/new" className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-[13px] sm:text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all flex-1 sm:flex-none">
              New Trip
            </Link>
            <Link href="/trips" className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-slate-900 text-white text-[13px] sm:text-sm font-semibold shadow-md hover:-translate-y-0.5 transition-all flex-1 sm:flex-none">
              <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> My Trips
            </Link>
          </div>
        </div>

        <StorageBar expenses={e} />

        <div className="grid grid-cols-2 gap-3">
          <Link href="/trips" className="block p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Plane className="w-4 h-4" /> <p className="text-xs font-medium">Total Trips</p>
            </div>
            <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>{totalTrips}</p>
          </Link>
          
          <Link href="/trips?filter=ongoing" className="block p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <Clock className="w-4 h-4" /> <p className="text-xs font-medium">Active Trips</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600" style={{ fontFamily: 'var(--font-display)' }}>{activeTrips.length}</p>
          </Link>

          <Link href="/dashboard" className="block p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Receipt className="w-4 h-4" /> <p className="text-xs font-medium">Total Spent</p>
            </div>
            <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>₹{totalSpent.toFixed(2)}</p>
          </Link>

          <Link href="/dashboard" className="block p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <CheckCircle2 className="w-4 h-4" /> <p className="text-xs font-medium">Claimed</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600" style={{ fontFamily: 'var(--font-display)' }}>₹{totalClaimed.toFixed(2)}</p>
          </Link>
        </div>

        {/* NAYA CARD: Ongoing Trips Warning */}
        {activeTrips.length > 0 && (
          <Link href="/trips?filter=ongoing" className="block p-4 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl hover:border-indigo-400 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Ongoing Trips (Don't forget to close)</p>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xl font-bold text-indigo-900" style={{ fontFamily: 'var(--font-display)' }}>{activeTrips.length} Trips</p>
                  <p className="text-lg font-bold text-indigo-800" style={{ fontFamily: 'var(--font-display)' }}>₹{ongoingTripExpenses.toFixed(2)} Spent</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-indigo-500" />
            </div>
          </Link>
        )}

        <div className="space-y-3">
          <Link href="/trips?filter=pending_submission" className="block p-4 bg-white border-2 border-dashed border-amber-200 rounded-2xl hover:border-amber-400 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Trips pending claim submission</p>
                <p className="text-xl font-bold text-amber-900 mt-1" style={{ fontFamily: 'var(--font-display)' }}>{tripsPendingSubmission.length}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-500" />
            </div>
          </Link>
          <Link href="/trips?filter=pending_submission" className="block p-4 bg-white border-2 border-dashed border-amber-200 rounded-2xl hover:border-amber-400 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Spent pending for submission</p>
                <p className="text-xl font-bold text-amber-900 mt-1" style={{ fontFamily: 'var(--font-display)' }}>₹{pendingSubmissionAmount.toFixed(2)}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-500" />
            </div>
          </Link>
          <Link href="/trips?filter=submitted" className="block p-4 bg-white border-2 border-dashed border-rose-200 rounded-2xl hover:border-rose-400 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Submitted, Settlement pending</p>
                <p className="text-xl font-bold text-rose-900 mt-1" style={{ fontFamily: 'var(--font-display)' }}>₹{submittedPendingAmount.toFixed(2)}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-rose-500" />
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-6">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Recent Trips</h2>
          <Link href="/trips" className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">View all <ArrowRight className="w-4 h-4"/></Link>
        </div>
        
        {t.length === 0 ? (
           <div className="text-center p-8 bg-white rounded-xl border border-slate-200">No trips yet. Create one to get started.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {t.slice(0, 4).map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}`} className="block p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>{trip.trip_name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{trip.start_date} · {trip.country || 'India'}</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                    trip.claim_status === 'ongoing' ? 'bg-indigo-50 text-indigo-700' : 
                    trip.claim_status === 'closed' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>{trip.claim_status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <GlobalExportButton />
      </div>
    </PageTransition>
  );
}