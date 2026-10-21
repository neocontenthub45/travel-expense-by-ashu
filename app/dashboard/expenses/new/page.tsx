import { createClient } from "@/lib/supabase/server";
import GlobalExpenseForm from "./GlobalExpenseForm";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";
import BackButton from "@/components/BackButton";

export const dynamic = "force-dynamic";

export default async function NewGlobalExpensePage() {
  const supabase = await createClient();
  const { data: trips } = await supabase
    .from("trips")
    .select("*")
    .eq("claim_status", "ongoing") // Sirf ongoing trips
    .order("created_at", { ascending: false });

  return (
    <PageTransition>
      <div className="max-w-md mx-auto">
        <BackButton label="Back to Dashboard" className="mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Add Expense</h1>
        <p className="text-sm text-slate-600 mb-6">Select an active trip and add your expense.</p>
        <GlobalExpenseForm activeTrips={trips || []} />
      </div>
    </PageTransition>
  );
}