import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plane, Receipt, CheckCircle2, Clock, AlertCircle, Plus, ArrowRight, FolderOpen } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlobalExportButton from "@/components/Dashboard/GlobalExportButton";
import StorageBar from "@/components/Dashboard/StorageBar";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: trips } = await supabase.from("trips").select("*").order("start_date", { ascending: false });
  const { data: expenses } = await supabase.from("expenses").select("amount, claim_status, trip_id, file_size");

  const t = trips || [];
  const e = expenses || [];

  const totalTrips = t.length;
  const activeTrips = t.filter(trip => trip.claim_status === "ongoing").length;
  const totalSpent = e.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalClaimed = e.filter(exp => exp.claim_status === "claimed").reduce((acc, curr) => acc + Number(curr.amount), 0);
  
  // Trips pending for claim submission (status closed)
  const tripsPendingSubmission = t.filter(trip => trip.claim_status === "closed");
  const pendingSubmissionAmount = e.filter(exp => tripsPendingSubmission.some(trip => trip.id === exp.trip_id)).reduce((acc, curr) => acc + Number(curr.amount), 0);
  
  // Claim submitted, settlement pending (expenses with status submitted)
  const submittedPendingAmount = e.filter(exp => exp.claim_status === "submitted").reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header with Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 text-sm mt-1">Welcome back! Here is your overview.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/expenses/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm">
              <Plus className="w-4 h-4" /> Quick Expense
            </Link>
            <Link href="/trips/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50">
              New Trip
            </Link>
            <Link href="/trips" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800">
              <FolderOpen className="w-4 h-4" /> My Trips
            </Link>
          </div>
        </div>

        {/* Storage Bar */}
        <StorageBar expenses={e} />

        {/* Cards - 2 Column Layout */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/trips" className="block p-4 bg-white rounded-xl border hover:border-indigo-300 transition-all">
            <p className="text-xs font-medium text-slate-500">Total Trips</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{totalTrips}</p>
          </Link>
          <Link href="/trips?filter=ongoing" className="block p-4 bg-white rounded-xl border hover:border-indigo-300 transition-all">
            <p className="text-xs font-medium text-slate-500">Active Trips</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">{activeTrips}</p>
          </Link>
          <Link href="/dashboard" className="block p-4 bg-white rounded-xl border hover:border-indigo-300 transition-all">
            <p className="text-xs font-medium text-slate-500">Total Spent</p>
            <p className="text-xl font-bold text-slate-900 mt-1">₹{totalSpent.toFixed(2)}</p>
          </Link>
          <Link href="/dashboard" className="block p-4 bg-white rounded-xl border hover:border-indigo-300 transition-all">
            <p className="text-xs font-medium text-slate-500">Claimed / Settled</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">₹{totalClaimed.toFixed(2)}</p>
          </Link>
        </div>

        {/* Full Width Cards */}
        <Link href="/trips?filter=pending_submission" className="block p-4 bg-amber-50 rounded-xl border border-amber-200 hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-amber-700">No. of trips pending for claim submission</p>
              <p className="text-xl font-bold text-amber-900 mt-1">{tripsPendingSubmission.length}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </div>
        </Link>

        <Link href="/trips?filter=pending_submission" className="block p-4 bg-amber-50 rounded-xl border border-amber-200 hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-amber-700">Spent pending for claim submission</p>
              <p className="text-xl font-bold text-amber-900 mt-1">₹{pendingSubmissionAmount.toFixed(2)}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </div>
        </Link>

        <Link href="/trips?filter=submitted" className="block p-4 bg-rose-50 rounded-xl border border-rose-200 hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-rose-700">Claim submitted, Settlement pending</p>
              <p className="text-xl font-bold text-rose-900 mt-1">₹{submittedPendingAmount.toFixed(2)}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-rose-600" />
          </div>
        </Link>

        <GlobalExportButton />
      </div>
    </PageTransition>
  );
}