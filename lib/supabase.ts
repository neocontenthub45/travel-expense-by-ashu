import { createClient } from "./supabase/client";

// Compatibility export for files that still use the old import
export const supabase = createClient();