import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import JSZip from "jszip";

export async function POST(req: NextRequest) {
  try {
    const { tripId } = await req.json();
    const supabase = await createClient();

    // 1. Trip ka data fetch karo
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .single();
    
    if (tripError || !trip) throw new Error("Trip not found");

    // 2. Trip ke saare expenses fetch karo
    const { data: expenses, error: expError } = await supabase
      .from("expenses")
      .select("*")
      .eq("trip_id", tripId);

    if (expError) throw expError;

    const zip = new JSZip();

    // 3. CSV Generate karo
    let csvContent = "Date,Category,Amount,Currency,Payment Type,Notes,Receipt File\n";
    expenses.forEach((e: any) => {
      const fileName = e.receipt_url ? e.receipt_url.split('/').pop() : "No file";
      // Basic CSV escaping
      const row = `"${e.expense_date}","${e.category || ''}","${e.amount}","${e.currency}","${e.payment_type || ''}","${e.notes || ''}","${fileName}"`;
      csvContent += row + "\n";
    });
    
    zip.file(`Expenses_Summary_${trip.trip_name}.csv`, csvContent);

    // 4. Bill Images download karke ZIP mein add karo
    const filesFolder = zip.folder("Receipts");
    
    if (expenses && expenses.length > 0) {
      for (const e of expenses) {
        if (e.receipt_url) {
          // Supabase Storage se file download karo
          const { data: fileData, error: downloadError } = await supabase.storage
            .from("receipts")
            .download(e.receipt_url);
            
          if (fileData && !downloadError) {
            const fileName = e.receipt_url.split('/').pop() || `bill_${e.id}.jpg`;
            filesFolder?.file(fileName, fileData);
          }
        }
      }
    }

    // 5. ZIP file generate karo (base64 format mein)
    const zipBlob = await zip.generateAsync({ type: "base64" });

    return NextResponse.json({ 
      zipBase64: zipBlob, 
      fileName: `Trip_Export_${trip.trip_name.replace(/\s+/g, '_')}.zip` 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}