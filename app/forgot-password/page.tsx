"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // User reset link pe click karega toh yahan aayega
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      showToast(error.message, "error");
    } else {
      setSent(true);
      showToast("Reset link sent to your email!", "success");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>

        <h1 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Reset Password
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {sent ? (
          <div className="p-4 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200">
            Check your inbox! We&apos;ve sent a password reset link to <strong>{email}</strong>.
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white h-11 rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-70 transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}