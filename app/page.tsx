import Link from "next/link";
import { Plane, ArrowRight, ShieldCheck, Wallet, BarChart3, Receipt, CheckCircle2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function LandingPage() {
  return (
    <PageTransition>
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 pt-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          New: Global Export Feature Added
        </div>
        
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mb-4 leading-tight">
          Track expenses, manage bills, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">claim effortlessly.</span>
        </h1>
        
        {/* Subheading */}
        <p className="text-base md:text-lg text-slate-600 max-w-2xl mb-8">
          The only expense manager designed for frequent business travelers. Snap receipts, organize by trip, and export claims in one click.
        </p>
        
        {/* Buttons */}
        <div className="flex items-center gap-3 mb-16">
          <Link href="/signup" className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5">
            Get Started for Free 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="px-6 py-3 rounded-xl bg-white text-slate-700 border border-slate-300 text-sm font-semibold hover:bg-slate-50 transition-all hover:-translate-y-0.5">
            Log In
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
          {/* Card 1 */}
          <div className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Snap & Store</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Take photos of bills on the go. We automatically compress and store them securely in the cloud.</p>
          </div>

          {/* Card 2 */}
          <div className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Smart Dashboard</h3>
            <p className="text-sm text-slate-600 leading-relaxed">See exactly what is pending, submitted, and claimed at a glance. Track your financial overview easily.</p>
          </div>

          {/* Card 3 */}
          <div className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Claim Ready</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Export your trip data as a ZIP file with CSV and images ready for reimbursement submission.</p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}