import Link from "next/link";
import { Plane, Plus, Receipt, Wallet, BarChart3 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import StorageWarning from "@/components/StorageWarning";

export default function Home() {
  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, Dear 👋
          </h1>
          <p className="mt-2 text-slate-600">
          Manage your business trips, bills, and claims in one place.
        </p>
      </div>

      <StorageWarning />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/trips"
            className="group block p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <Receipt className="w-5 h-5" />
              </span>
              <h2 className="font-semibold text-slate-900">My Trips</h2>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              View all trips, track expenses, and manage claims.
            </p>
          </Link>

                    <Link
            href="/dashboard"
            className="group block p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h2 className="font-semibold text-slate-900">Financial Overview</h2>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              View total spending, pending claims, and export your data.
            </p>
          </Link>

          <Link
            href="/trips/new"
            className="group block p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Plus className="w-5 h-5" />
              </span>
              <h2 className="font-semibold text-slate-900">New Trip</h2>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Start a new trip and begin recording expenses.
            </p>
          </Link>
        </div>

        <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl text-white">
          <div className="flex items-start gap-3">
            <Wallet className="w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold">Keep your storage lean</h3>
              <p className="text-sm text-indigo-100 mt-1">
                After submitting claims, export bills and delete them from storage to free up space.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}