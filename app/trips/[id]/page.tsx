"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Trip, Expense } from "@/lib/types";
import ViewBillButton from "@/components/ViewBillButton";
import ClaimExportSection from "@/components/TripActions/ClaimExportSection";
import ExpenseActions from "@/components/TripActions/ExpenseActions";
import { Edit3, Loader2, Receipt } from "lucide-react";
import BackButton from "@/components/BackButton";
import DeleteTripButton from "@/components/TripActions/DeleteTripButton";
import PageTransition from "@/components/PageTransition";

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supabase = createClient();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tripRes, expensesRes] = await Promise.all([
          supabase.from("trips").select("*").eq("id", id).single(),
          supabase.from("expenses").select("*").eq("trip_id", id).order("expense_date", { ascending: false })
        ]);
        if (tripRes.error) throw tripRes.error;
        if (expensesRes.error) throw expensesRes.error;
        setTrip(tripRes.data as Trip);
        setExpenses(expensesRes.data as Expense[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-24 bg-slate-200 rounded-full" />
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="h-8 w-64 bg-slate-200 rounded-lg mb-4" />
          <div className="flex gap-4">
            <div className="h-4 w-24 bg-slate-100 rounded" />
            <div className="h-4 w-24 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="h-24 bg-slate-200 rounded-2xl" />
          <div className="h-24 bg-slate-200 rounded-2xl" />
          <div className="h-24 bg-slate-200 rounded-2xl" />
        </div>
        <div className="h-16 bg-slate-200 rounded-xl" />
        <div className="space-y-3">
          <div className="h-24 bg-slate-200 rounded-xl" />
          <div className="h-24 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !trip) {
    notFound(); // Yeh Next.js ke not-found.tsx page pe bhej dega
  }

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const pendingTotal = expenses.filter((e) => e.claim_status === "pending" || e.claim_status === "submitted").reduce((s, e) => s + Number(e.amount), 0);

  return (
    <PageTransition>
      <div className="space-y-6">
        
        <div>
          <BackButton label="Back to Trips" className="mb-4" />
          
          {/* Boarding Pass Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden mt-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>{trip.trip_name}</h1>
                <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs">{trip.start_date}</span>
                  {trip.end_date && <><span className="text-slate-400">→</span> <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs">{trip.end_date}</span></>}
                  {trip.country && <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs">{trip.country}</span>}
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs">{trip.currency}</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/trips/${trip.id}/edit`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <Edit3 className="w-4 h-4" /> Edit
                  </Link>
                  <DeleteTripButton tripId={trip.id} tripName={trip.trip_name} />
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider ${
                  trip.claim_status === "ongoing" ? "bg-indigo-100 text-indigo-700" :
                  trip.claim_status === "closed" ? "bg-amber-100 text-amber-700" :
                  "bg-emerald-100 text-emerald-700"
                }`}>
                  {trip.claim_status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">Total Spent</p>
            <p className="text-xl font-bold text-slate-900 mt-1" style={{ fontFamily: 'var(--font-display)' }}>
              {trip.currency} {total.toFixed(2)}
            </p>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm">
            <p className="text-xs text-amber-700 font-medium">Pending Amount</p>
            <p className="text-xl font-bold text-amber-900 mt-1" style={{ fontFamily: 'var(--font-display)' }}>
              {trip.currency} {pendingTotal.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">Total Expenses</p>
            <p className="text-xl font-bold text-slate-900 mt-1" style={{ fontFamily: 'var(--font-display)' }}>{expenses.length}</p>
          </div>
        </div>

        <ClaimExportSection trip={trip} expenses={expenses} />

        <div className="flex items-center justify-between mt-6 border-b border-slate-200 pb-2">
          <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>Expense List</h2>
          {trip.claim_status === "ongoing" && (
            <Link
              href={`/trips/${trip.id}/expenses/new`}
              className="bg-gradient-to-br from-indigo-600 to-[#7B3FD6] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:-translate-y-0.5 shadow-md transition-all"
            >
              + Add Expense
            </Link>
          )}
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 font-medium">No expenses added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((e) => (
              <div key={e.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                      {e.category || "Uncategorized"}
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        e.payment_type === "online" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"
                      }`}>
                        {e.payment_type === "online" ? "Online" : "Cash"}
                      </span>
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {e.expense_date}
                      {e.notes ? ` · ${e.notes}` : ""}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      {e.receipt_url ? (
                        <ViewBillButton path={e.receipt_url} />
                      ) : (
                        <span className="text-xs text-slate-400">No bill</span>
                      )}
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full ${
                        e.claim_status === "pending" ? "bg-amber-100 text-amber-700" :
                        e.claim_status === "submitted" ? "bg-indigo-100 text-indigo-700" :
                        e.claim_status === "claimed" ? "bg-emerald-100 text-emerald-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {e.claim_status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="font-bold text-slate-900 whitespace-nowrap text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                      {e.currency} {Number(e.amount).toFixed(2)}
                    </p>
                    <ExpenseActions expenseId={e.id} tripId={trip.id} receiptUrl={e.receipt_url} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}