"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Loader2, ArrowRight, X } from "lucide-react";
import { showToast } from "@/lib/toast";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["700", "800"] });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

const notchMask =
  "radial-gradient(circle 10px at 0 calc(100% - 88px), #0000 98%, #000) left/51% 100% no-repeat, radial-gradient(circle 10px at 100% calc(100% - 88px), #0000 98%, #000) right/51% 100% no-repeat";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Forgot Password Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const isLogin = mode === "login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast("Welcome back!", "success");
        router.push("/dashboard");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showToast("Account created! You can now log in.", "success");
        router.push("/login");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) showToast(error.message, "error");
    else {
      showToast("Reset link sent to your email!", "success");
      setShowResetModal(false);
    }
    setResetLoading(false);
  }

  return (
    <>
      <div className={`${body.className} min-h-[calc(100vh-60px)] w-full relative overflow-hidden text-white rounded-2xl shadow-xl mt-2 bg-[radial-gradient(circle_at_85%_8%,rgba(255,214,102,.45)_0,rgba(255,214,102,0)_38%),radial-gradient(circle_at_50%_112%,#FFB36B_0,rgba(255,179,107,0)_52%),linear-gradient(172deg,#5E6BFF_0%,#8A63F5_40%,#E26FC0_76%,#FF9A7A_100%)]`}>
        
        <svg className="pointer-events-none absolute left-1/2 top-0 h-[30vh] w-full max-w-[460px] -translate-x-1/2 opacity-60" viewBox="0 0 460 260" fill="none" aria-hidden="true">
          <path d="M-10 230C90 60 280 20 470 110" stroke="#fff" strokeWidth="1.2" strokeDasharray="3 8" strokeLinecap="round" />
        </svg>

        <div className="relative mx-auto flex h-full max-w-[400px] flex-col justify-center px-5 py-8">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <img src="/logo-header.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <h1 className={`${display.className} text-2xl font-extrabold`}>
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm text-white/80 mt-1">
              {isLogin ? "Sign in to access your trips" : "Start tracking your business expenses"}
            </p>
          </div>

          <div
            className="flex flex-col rounded-[20px] bg-[#FFFBF4] text-[#17163F] shadow-[0_18px_40px_-12px_rgba(90,40,150,0.5)] pb-2"
            style={{ WebkitMask: notchMask, mask: notchMask }}
          >
            <form onSubmit={handleSubmit} className="px-5 pt-6 pb-2 space-y-4">
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
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                  {error}
                </div>
              )}

              <div className="pt-2 pb-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-[#7B3FD6] text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>

            {isLogin && (
              <div className="text-center pb-4 px-5">
                <button 
                  type="button"
                  onClick={() => setShowResetModal(true)} 
                  className="text-xs font-semibold text-indigo-600 hover:underline p-2"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-white/90">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <button onClick={() => router.push("/signup")} className="font-bold underline hover:text-white">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => router.push("/login")} className="font-bold underline hover:text-white">
                  Log in
                </button>
              </>
            )}
          </div>

          <div className="mt-8 text-center text-xs text-white/60">
            Powered By - Ashu
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>Reset Password</h2>
            <p className="text-sm text-slate-500 mb-4">Enter your email and we'll send you a reset link.</p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white h-11 rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-70"
              >
                {resetLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {resetLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
