import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plane, Receipt, CheckCircle2, Clock, AlertCircle, Plus, ArrowRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlobalExportButton from "@/components/Dashboard/GlobalExportButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: trips } = await supabase.from("trips").select("*").order("start_date", { ascending: false });
  const { data: expenses } = await supabase.from("expenses").select("amount, claim_status, trip_id");

  const t = trips || [];
  const e = expenses || [];

  const totalTrips = t.length;
  const activeTrips = t.filter(trip => trip.claim_status === "ongoing").length;
  const totalSpent = e.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalClaimed = e.filter(exp => exp.claim_status === "claimed").reduce((acc, curr) => acc + Number(curr.amount), 0);
  const pendingSubmission = e.filter(exp => exp.claim_status === "pending").reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalPendingClaim = e.filter(exp => exp.claim_status === "submitted").reduce((acc, curr) => acc + Number(curr.amount), 0);
  
  // Trips whose claim is pending
  const tripsPendingClaim = t.filter(trip => trip.claim_status === "closed").length;

  const cards = [
    { title: "Total Trips", value: totalTrips, icon: Plane, href: "/trips", color: "text-indigo-600 bg-indigo-50" },
    { title: "Active Trips", value: activeTrips, icon: Clock, href: "/trips", color: "text-emerald-600 bg-emerald-50" },
    { title: "Trips Pending Claim", value: tripsPendingClaim, icon: AlertCircle, href: "/trips?filter=pending_claim", color: "text-amber-600 bg-amber-50" },
    { title: "Total Spent", value: `₹${totalSpent.toFixed(2)}`, icon: Receipt, href: "/trips", color: "text-slate-800 bg-slate-100" },
    { title: "Pending Submission", value: `₹${pendingSubmission.toFixed(2)}`, icon: AlertCircle, href: "/trips?filter=pending_sub", color: "text-rose-600 bg-rose-50" },
    { title: "Submitted Claim", value: `₹${totalPendingClaim.toFixed(2)}`, icon: Clock, href: "/trips?filter=submitted", color: "text-amber-600 bg-amber-50" },
    { title: "Claimed / Settled", value: `₹${totalClaimed.toFixed(2)}`, icon: CheckCircle2, href: "/trips?filter=claimed", color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
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
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link key={i} href={card.href} className="block p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{card.value}</p>
              </Link>
            );
          })}
        </div>

        <GlobalExportButton />

        <div className="flex items-center justify-between mt-8">
          <h2 className="text-lg font-bold text-slate-900">Recent Trips</h2>
          <Link href="/trips" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-4 h-4"/></Link>
        </div>
        
        {t.length === 0 ? (
           <div className="text-center p-8 bg-white rounded-xl border border-slate-200">No trips yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {t.slice(0, 4).map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}`} className="block p-4 bg-white rounded-xl border hover:border-indigo-300 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-900">{trip.trip_name}</h3>
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
      </div>
    </PageTransition>
  );
}