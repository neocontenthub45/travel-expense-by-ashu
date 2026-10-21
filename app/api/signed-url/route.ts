import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
const { path } = await req.json();
  if (!path) {
    return NextResponse.json({ error: "path required" }, { status: 400 });
  }
  const { data, error } = await supabase.storage
    .from("receipts")
    .createSignedUrl(path, 60 * 60);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ url: data.signedUrl });
}