export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  currency: string; // Add currency field
}