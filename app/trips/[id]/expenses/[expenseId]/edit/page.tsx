import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Expense } from "@/lib/types";
import EditExpenseForm from "./EditExpenseForm";

export default async function EditExpensePage({ params }: { params: Promise<{ id: string, expenseId: string }> }) {
  const { id, expenseId } = await params;
  const supabase = await createClient();

  const { data: expense } = await supabase.from("expenses").select("*").eq("id", expenseId).single();
  if (!expense) notFound();

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Edit Expense</h1>
      <p className="text-sm text-slate-600 mb-6">Update the details of this expense.</p>
      <EditExpenseForm expense={expense as Expense} />
    </div>
  );
}