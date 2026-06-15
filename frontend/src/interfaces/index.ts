// ── Expense ───────────────────────────────────────────────────────────────────
export interface Expense {
  id: number;
  title: string;
  amount: number;
  categoryId?: number;
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
  date: string;
  type: 'Income' | 'Expense';
  notes?: string;
  currencyCode: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  title: string;
  amount: number;
  categoryId?: number;
  date: string;
  type: 'Income' | 'Expense';
  notes?: string;
  currencyCode: string;
}

export type UpdateExpenseDto = CreateExpenseDto;

export interface ExpenseFilter {
  search?: string;
  categoryId?: number;
  type?: 'Income' | 'Expense';
  startDate?: string;
  endDate?: string;
  isFavorite?: boolean;
  sortBy?: 'date' | 'amount' | 'title';
  descending?: boolean;
}

// ── Category ──────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface CreateCategoryDto {
  name: string;
  icon: string;
  color: string;
}

export type UpdateCategoryDto = CreateCategoryDto;

// ── Currency ──────────────────────────────────────────────────────────────────
export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  flag: string;
}

// ── Budget ────────────────────────────────────────────────────────────────────
export interface Budget {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  monthlyLimit: number;
  currentMonthSpent: number;
  isExceeded: boolean;
  remainingAmount: number;
  percentageUsed: number;
}

export interface CreateBudgetDto {
  categoryId: number;
  monthlyLimit: number;
}

export interface UpdateBudgetDto {
  monthlyLimit: number;
}

// ── Statistics ────────────────────────────────────────────────────────────────
export interface MonthlyTotal {
  year: number;
  month: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface YearlyTotal {
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface CategorySpending {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface OverallStatistics {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  averageSpendingPerMonth: number;
  highestExpenseAmount: number;
  highestExpenseTitle: string;
  lowestExpenseAmount: number;
  lowestExpenseTitle: string;
  totalTransactions: number;
}
