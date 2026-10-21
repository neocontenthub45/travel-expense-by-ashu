"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";

export default function UserNav() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email ?? null);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    showToast("Logged out successfully", "info");
    router.push("/login");
    router.refresh();
  }

  if (!email) return null;

  return (
    <div className="flex items-center gap-3 border-l border-slate-200 pl-3 ml-1">
      <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
        <User className="w-4 h-4" />
        <span className="max-w-[120px] truncate">{email}</span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}