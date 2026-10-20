export type Trip = {
  id: string
  trip_name: string
  start_date: string
  end_date: string | null
  country: string | null
  currency: string
  claim_status: 'ongoing' | 'claimed' | 'closed'
  created_at: string
}

export type Expense = {
  id: string
  trip_id: string
  amount: number
  currency: string
  category: string | null
  payment_type: 'online' | 'offline' | null
  expense_date: string
  receipt_url: string | null
  file_size: number
  claim_status: 'pending' | 'claimed' | 'exported' | 'deleted'
  claimed_at: string | null
  exported_at: string | null
  file_deleted_at: string | null
  notes: string | null
  created_at: string
}