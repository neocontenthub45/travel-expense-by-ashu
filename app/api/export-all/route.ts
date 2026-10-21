import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { month, year } = await req.json();
    const supabase = await createClient();

    // Date range set karo
    let startDate = "";
    let endDate = "";
    
    if (month && year) {
      // Specific month
      const m = month.toString().padStart(2, '0');
      startDate = `${year}-${m}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      endDate = `${year}-${m}-${lastDay}`;
    } else if (year) {
      // Poora saal
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
    } else {
      return NextResponse.json({ error: "Year is required" }, { status: 400 });
    }

    const { data: expenses, error } = await supabase
      .from("expenses")
      .select(`
        expense_date,
        category,
        amount,
        currency,
        payment_type,
        notes,
        claim_status,
        trips ( trip_name )
      `)
      .gte("expense_date", startDate)
      .lte("expense_date", endDate)
      .order("expense_date", { ascending: true });

    if (error) throw error;

    // CSV Generate karo
    let csvContent = "Date,Trip Name,Category,Amount,Currency,Payment Type,Status,Notes\n";
    
    expenses.forEach((e: any) => {
      const tripName = e.trips?.trip_name || "Unknown Trip";
      const row = `"${e.expense_date}","${tripName}","${e.category || ''}","${e.amount}","${e.currency}","${e.payment_type || ''}","${e.claim_status}","${e.notes || ''}"`;
      csvContent += row + "\n";
    });

    return NextResponse.json({ 
      csvBase64: Buffer.from(csvContent).toString('base64'),
      fileName: `Expenses_${year}${month ? `_${month}` : ''}.csv`
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}