import Link from "next/link";
import { ArrowLeft, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PageTransition from "@/components/PageTransition";
import GlobalExportButton from "@/components/Dashboard/GlobalExportButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Saare expenses fetch karo total nikaalne ke liye
  const { data: expenses } = await supabase
    .from("expenses")
    .select("amount, currency, claim_status");

  const list = expenses || [];
  
  // Basic calculation (Multi-currency support baad mein)
  const totalSpent = list.reduce((acc, e) => acc + Number(e.amount), 0);
  const pendingAmount = list.filter(e => e.claim_status === "pending").reduce((acc, e) => acc + Number(e.amount), 0);
  const claimedAmount = list.filter(e => e.claim_status === "claimed" || e.claim_status === "exported").reduce((acc, e) => acc + Number(e.amount), 0);

  return (
    <PageTransition>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>
          <p className="text-slate-600 text-sm mt-1">Track your spending and claims globally.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Total Spent</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">₹ {totalSpent.toFixed(2)}</p>
          </div>
          
          <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 text-amber-700 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Pending Claim</span>
            </div>
            <p className="text-2xl font-bold text-amber-900">₹ {pendingAmount.toFixed(2)}</p>
          </div>

          <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Claimed / Settled</span>
            </div>
            <p className="text-2xl font-bold text-emerald-900">₹ {claimedAmount.toFixed(2)}</p>
          </div>
        </div>

        <GlobalExportButton />
      </div>
    </PageTransition>
  );
}