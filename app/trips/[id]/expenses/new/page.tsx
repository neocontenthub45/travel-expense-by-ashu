import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Trip } from "@/lib/types";
import ExpenseForm from "./ExpenseForm";

export default async function NewExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single();

  if (!trip) notFound();

  return <ExpenseForm trip={trip as Trip} />;
}