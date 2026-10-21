import Link from "next/link";
import { Plane, ArrowRight, ShieldCheck, Wallet, BarChart3, Receipt } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function LandingPage() {
  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Simplify your business travel
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl mb-6">
          Track expenses, manage bills, and claim effortlessly.
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mb-10">
          The only expense manager designed for frequent business travelers. Snap receipts, organize by trip, and export claims in one click.
        </p>
        
        <div className="flex items-center gap-4">
          <Link href="/signup" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Get Started for Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="px-6 py-3 rounded-xl bg-white text-slate-700 border border-slate-300 font-medium hover:bg-slate-50 transition-all">
            Log In
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full text-left">
          <div className="p-6 bg-white rounded-2xl border shadow-sm">
            <Receipt className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Snap & Store</h3>
            <p className="text-sm text-slate-600">Take photos of bills on the go. We compress and store them securely.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border shadow-sm">
            <BarChart3 className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Smart Dashboard</h3>
            <p className="text-sm text-slate-600">See exactly what is pending, submitted, and claimed at a glance.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border shadow-sm">
            <ShieldCheck className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Claim Ready</h3>
            <p className="text-sm text-slate-600">Export your trip data as a ZIP file with CSV and images ready for reimbursement.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}