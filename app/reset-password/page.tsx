"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

function ResetRedirect() {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleRedirect() {
      // 1. URL se code nikaalo
      const code = searchParams.get("code");
      
      // 2. Agar code hai, toh session exchange karo (chupchap)
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      // 3. Ab check karo ki user logged in hai ya nahi
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        // User login hai, seedha Settings page pe bhejo
        router.replace("/settings");
      } else {
        // Agar login nahi hua (link expire ya galat hai), toh login page pe bhejo
        router.replace("/login?error=invalid_link");
      }
    }

    handleRedirect();
  }, [router, searchParams, supabase]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
      <p className="text-slate-500">Verifying your link...</p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500">Loading...</p>
      </div>
    }>
      <ResetRedirect />
    </Suspense>
  );
}
