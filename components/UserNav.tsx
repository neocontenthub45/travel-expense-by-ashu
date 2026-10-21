"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function UserNav() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: any } }) => {
      setIsLoggedIn(!!data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: any, session: any) => {
        setIsLoggedIn(!!session?.user);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!isLoggedIn) return null;

  return (
    <Link
      href="/settings"
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium text-sm"
    >
      <Settings className="w-4 h-4" />
      <span className="hidden sm:inline">Settings</span>
    </Link>
  );
}