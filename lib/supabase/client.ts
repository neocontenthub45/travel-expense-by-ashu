import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  // Browser mein ek hi baar client banega aur reuse hoga
  if (typeof window !== "undefined") {
    const win = window as any;
    if (!win.__supabase_client) {
      win.__supabase_client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    }
    return win.__supabase_client;
  }

  // Fallback (agar server pe call ho jaye accidentally)
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};