import Link from "next/link";
import { Plane, ArrowRight, ShieldCheck, Wallet, BarChart3, Receipt } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function LandingPage() {
  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight max-w-2xl mb-4">
          Track expenses, manage bills, and claim effortlessly.
        </h1>
        <p className="text-base text-slate-600 max-w-xl mb-8">
          The only expense manager designed for frequent business travelers. Snap receipts, organize by trip, and export claims in one click.
        </p>
        
        <div className="flex items-center gap-3">
          <Link href="/signup" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="px-5 py-2.5 rounded-lg bg-white text-slate-700 border border-slate-300 text-sm font-medium hover:bg-slate-50 transition-all">
            Log In
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-3xl w-full text-left">
          <div className="p-4 bg-white rounded-xl border shadow-sm">
            <Receipt className="w-6 h-6 text-indigo-600 mb-2" />
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Snap & Store</h3>
            <p className="text-xs text-slate-600">Take photos of bills on the go. We compress and store them securely.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border shadow-sm">
            <BarChart3 className="w-6 h-6 text-indigo-600 mb-2" />
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Smart Dashboard</h3>
            <p className="text-xs text-slate-600">See exactly what is pending, submitted, and claimed at a glance.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border shadow-sm">
            <ShieldCheck className="w-6 h-6 text-indigo-600 mb-2" />
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Claim Ready</h3>
            <p className="text-xs text-slate-600">Export trip data as ZIP with CSV and images ready for reimbursement.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}