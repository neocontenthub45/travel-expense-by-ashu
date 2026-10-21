"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";
import { User, Mail, Lock, Loader2, LogOut, ArrowLeft, ShieldCheck } from "lucide-react";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? null);
        // Fetch profile name
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
        if (profile?.full_name) setFullName(profile.full_name);
      }
      setLoading(false);
    }
    getData();
  }, []);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase.from("profiles").upsert({ id: user.id, full_name: fullName });
      if (error) showToast(error.message, "error");
      else showToast("Name updated successfully!", "success");
    }
    setSavingName(false);
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) return showToast("Password must be at least 6 characters", "error");

    setUpdating(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) showToast(error.message, "error");
    else {
      showToast("Password updated successfully!", "success");
      setNewPassword("");
    }
    setUpdating(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    showToast("Logged out successfully", "info");
    router.push("/login");
    router.refresh();
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>;

  return (
    <PageTransition>
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <BackButton label="Back to Dashboard" className="mb-4" />
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
        </div>

        {/* Profile Info Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Your Profile</p>
              <p className="text-xs text-slate-500">Manage your personal details</p>
            </div>
          </div>
          <form onSubmit={handleSaveName} className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Display Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ashu"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <button type="submit" disabled={savingName} className="w-full bg-slate-900 text-white h-9 rounded-lg text-xs font-semibold hover:bg-slate-800 disabled:opacity-50">
              {savingName ? "Saving..." : "Save Name"}
            </button>
          </form>
          <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <Mail className="w-4 h-4 text-slate-400" />
            {email}
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Security</p>
              <p className="text-xs text-slate-500">Update your password</p>
            </div>
          </div>
          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <button type="submit" disabled={updating || !newPassword} className="w-full bg-slate-900 text-white h-10 rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors">
              {updating ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-700 h-12 rounded-2xl text-sm font-semibold hover:bg-rose-100 transition-colors border border-rose-100">
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </PageTransition>
  );
}