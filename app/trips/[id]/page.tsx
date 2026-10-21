"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Trip, Expense } from "@/lib/types";
import ViewBillButton from "@/components/ViewBillButton";
import ClaimExportSection from "@/components/TripActions/ClaimExportSection";
import ExpenseActions from "@/components/TripActions/ExpenseActions";
import { ArrowLeft, Edit3, Loader2 } from "lucide-react";
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
        // Dono queries ek saath (parallel) chalao taaki speed badhe
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

  // Loading Skeleton
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500">Loading trip details...</p>
      </div>
    );
  }

  if (error || !trip) {
    return <div className="p-10 text-center text-rose-600">Trip not found. It may have been deleted.</div>;
  }

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const pendingTotal = expenses.filter((e) => e.claim_status === "pending" || e.claim_status === "submitted").reduce((s, e) => s + Number(e.amount), 0);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <Link href="/trips" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to trips
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mt-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{trip.trip_name}</h1>
              <p className="text-sm text-slate-600 mt-1">
                {trip.start_date}
                {trip.end_date ? ` → ${trip.end_date}` : ""}
                {trip.country ? ` · ${trip.country}` : ""}
                {` · ${trip.currency}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/trips/${trip.id}/edit`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </Link>
              <span className={`text-xs px-2.5 py-1.5 rounded-full font-medium ${
                trip.claim_status === "ongoing" ? "bg-indigo-50 text-indigo-700" :
                trip.claim_status === "closed" ? "bg-amber-50 text-amber-700" :
                "bg-emerald-50 text-emerald-700"
              }`}>
                {trip.claim_status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">Total Spent</p>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {trip.currency} {total.toFixed(2)}
            </p>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm">
            <p className="text-xs text-amber-700 font-medium">Pending Amount</p>
            <p className="text-xl font-bold text-amber-900 mt-1">
              {trip.currency} {pendingTotal.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">Total Expenses</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{expenses.length}</p>
          </div>
        </div>

        <ClaimExportSection trip={trip} expenses={expenses} />

        <div className="flex items-center justify-between mt-4">
          <h2 className="text-lg font-semibold text-slate-900">Expense List</h2>
          {trip.claim_status === "ongoing" && (
            <Link
              href={`/trips/${trip.id}/expenses/new`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
            >
              + Add Expense
            </Link>
          )}
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-600">No expenses added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((e) => (
              <div key={e.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 flex items-center gap-2">
                      {e.category || "Uncategorized"}
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        e.payment_type === "online" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"
                      }`}>
                        {e.payment_type === "online" ? "Online" : "Cash"}
                      </span>
                    </p>
                    <p className="text-sm text-slate-600 mt-0.5">
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
                    <p className="font-semibold text-slate-900 whitespace-nowrap">
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