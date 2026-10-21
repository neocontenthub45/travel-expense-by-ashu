"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";

export default function UserNav() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Check karo ki user logged in hai ya nahi
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });

    // Auth state change ko listen karo
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLoggedIn(!!session?.user);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    showToast("Logged out successfully", "info");
    router.push("/login");
    router.refresh();
  }

  // Jab tak check nahi hota, ya logged out ho, kuch mat dikhao
  if (!isLoggedIn) return null;

  return (
    <div className="flex items-center gap-3 border-l border-slate-200 pl-3 ml-1">
      <span className="hidden sm:inline text-sm text-slate-600 font-medium">
        Welcome
      </span>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}