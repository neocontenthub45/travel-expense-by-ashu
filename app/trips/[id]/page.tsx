import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Trip, Expense } from "@/lib/types";
import ViewBillButton from "@/components/ViewBillButton";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single();

  if (!trip) notFound();

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("trip_id", id)
    .order("expense_date", { ascending: false });

  const t = trip as Trip;
  const list = (expenses || []) as Expense[];
  const total = list.reduce((s, e) => s + Number(e.amount), 0);
  const pendingTotal = list
    .filter((e) => e.claim_status === "pending")
    .reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/trips" className="text-sm text-gray-600 hover:text-black">
          ← Back to trips
        </Link>
        <div className="flex items-start justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.trip_name}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {t.start_date}
              {t.end_date ? ` → ${t.end_date}` : ""}
              {t.country ? ` · ${t.country}` : ""}
              {` · ${t.currency}`}
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {t.claim_status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600">Total Spent</p>
          <p className="text-xl font-bold text-gray-900">
            {t.currency} {total.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600">Pending Claim</p>
          <p className="text-xl font-bold text-yellow-700">
            {t.currency} {pendingTotal.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600">Expenses</p>
          <p className="text-xl font-bold text-gray-900">{list.length}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Expenses</h2>
        <Link
          href={`/trips/${t.id}/expenses/new`}
          className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
        >
          + Add Expense
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">Abhi koi expense nahi hai.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((e) => (
            <div
              key={e.id}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">
                    {e.category || "Uncategorized"}
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      {e.payment_type === "online" ? "💳 Online" : "💵 Offline"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {e.expense_date}
                    {e.notes ? ` · ${e.notes}` : ""}
                  </p>
                  <div className="mt-1 flex items-center gap-3">
                    {e.receipt_url ? (
                      <ViewBillButton path={e.receipt_url} />
                    ) : (
                      <span className="text-xs text-gray-400">No bill</span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        e.claim_status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : e.claim_status === "claimed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {e.claim_status}
                    </span>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 whitespace-nowrap">
                  {e.currency} {Number(e.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}