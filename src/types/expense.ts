export interface Expense {
    id: string
    amount: number
    category: string
    notes?: string
    date: string
    type: 'debit' | 'credit'
    source: 'manual' | 'imported' | string
}
