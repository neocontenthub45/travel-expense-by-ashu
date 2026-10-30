"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { showToast } from "@/lib/toast";
import Link from "next/link";

function ResetForm() {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [linkError, setLinkError] = useState(false);

  useEffect(() => {
    async function verifyCode() {
      // URL se code nikaalo
      const code = searchParams.get("code");
      
      if (code) {
        // Code ko session mein exchange karo
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("Reset error:", error.message);
          setLinkError(true);
        }
      } else {
        // Agar code nahi hai, toh dekho user already logged in hai kya (jaisa settings se aata hai)
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
          setLinkError(true);
        }
      }
      setVerifying(false);
    }
    verifyCode();
  }, [searchParams, supabase]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      showToast(error.message, "error");
    } else {
      setSuccess(true);
      showToast("Password updated successfully!", "success");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    }
    setLoading(false);
  }

  if (verifying) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500">Verifying your reset link...</p>
      </div>
    );
  }

  // Agar link invalid hai ya expire ho gaya
  if (linkError) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Link Expired or Invalid</h1>
        <p className="text-slate-500 mb-6 max-w-sm">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  // Agar password update ho gaya
  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Password Updated!</h1>
        <p className="text-slate-500 mb-6">Redirecting you to the dashboard...</p>
      </div>
    );
  }

  // Agar sab theek hai (code verified), toh naya password daalne ka form dikhao
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Set New Password
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white h-11 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-70 transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>}>
      <ResetForm />
    </Suspense>
  );
}
