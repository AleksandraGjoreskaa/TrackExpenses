import { Link } from 'react-router-dom';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useStatistics } from '../hooks/useStatistics';
import { useBudgets } from '../hooks/useBudgets';
import { useExpenses } from '../hooks/useExpenses';
import { useCurrencies } from '../hooks/useCurrencies';
import BudgetProgressBar from '../components/BudgetProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Dashboard() {
  const { overview, monthly, topCategories, loading: statsLoading } = useStatistics();
  const { budgets } = useBudgets();
  const { expenses: recent } = useExpenses();
  const { getSymbol } = useCurrencies();

  // Use the currency symbol set in Settings
  const sym = getSymbol(localStorage.getItem('defaultCurrency') ?? 'USD');

  const recentTransactions = recent.slice(0, 5);
  const exceededBudgets = budgets.filter(b => b.isExceeded);

  if (statsLoading) return <LoadingSpinner text="Loading dashboard..." />;

  const chartData = monthly.map(m => ({
    name: `${MONTH_NAMES[m.month - 1]} ${m.year}`,
    Income: m.totalIncome,
    Expenses: m.totalExpenses,
  }));

  const pieData = topCategories.map(c => ({
    name: c.categoryName,
    value: c.totalAmount,
    color: c.categoryColor,
    icon: c.categoryIcon,
  }));

  const fmt = (n: number) => `${sym}${n.toFixed(2)}`;

  return (
    <div className="page dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/add" className="btn btn-primary">+ Add Transaction</Link>
      </div>

      {/* Budget exceeded alert */}
      {exceededBudgets.length > 0 && (
        <div className="alert alert-warning">
          ⚠️ {exceededBudgets.length} budget{exceededBudgets.length > 1 ? 's' : ''} exceeded this month:{' '}
          {exceededBudgets.map(b => `${b.categoryIcon} ${b.categoryName}`).join(', ')}
        </div>
      )}

      {/* Summary cards */}
      <div className="summary-cards">
        <div className="card income-card">
          <div className="card-icon">💚</div>
          <div>
            <p className="card-label">Total Income</p>
            <p className="card-value">{fmt(overview?.totalIncome ?? 0)}</p>
          </div>
        </div>
        <div className="card expense-card">
          <div className="card-icon">❤️</div>
          <div>
            <p className="card-label">Total Expenses</p>
            <p className="card-value">{fmt(overview?.totalExpenses ?? 0)}</p>
          </div>
        </div>
        <div className={`card balance-card ${(overview?.currentBalance ?? 0) >= 0 ? 'positive' : 'negative'}`}>
          <div className="card-icon">💳</div>
          <div>
            <p className="card-label">Balance</p>
            <p className="card-value">{fmt(overview?.currentBalance ?? 0)}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="card-icon">📊</div>
          <div>
            <p className="card-label">Avg / Month</p>
            <p className="card-value">{fmt(overview?.averageSpendingPerMonth ?? 0)}</p>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Income vs Expenses</h3>
          {chartData.length === 0 ? (
            <p className="no-data">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={(v: number) => `${sym}${v}`} />
                <Tooltip formatter={(v: number) => [fmt(v)]} />
                <Legend />
                <Bar dataKey="Income" fill="#4ade80" radius={[4,4,0,0]} />
                <Bar dataKey="Expenses" fill="#f87171" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h3>Spending by Category</h3>
          {pieData.length === 0 ? (
            <p className="no-data">No expense data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [fmt(v)]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="dashboard-bottom">
        <div className="card budget-section">
          <div className="section-header">
            <h3>Budget Overview</h3>
            <Link to="/budgets" className="link-sm">Manage →</Link>
          </div>
          {budgets.length === 0 ? (
            <p className="no-data">No budgets set. <Link to="/budgets">Create one →</Link></p>
          ) : (
            <div className="budget-list">
              {budgets.slice(0, 4).map(b => <BudgetProgressBar key={b.id} {...b} sym={sym} />)}
            </div>
          )}
        </div>

        <div className="card recent-section">
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <Link to="/expenses" className="link-sm">View all →</Link>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="no-data">No transactions yet.</p>
          ) : (
            <ul className="recent-list">
              {recentTransactions.map(e => (
                <li key={e.id} className="recent-item">
                  <span className="recent-icon">{e.categoryIcon ?? '💰'}</span>
                  <div className="recent-info">
                    <span className="recent-title">{e.title}</span>
                    <span className="recent-meta">
                      {e.categoryName ?? 'Uncategorized'} · {new Date(e.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={e.type === 'Income' ? 'amount-income' : 'amount-expense'}>
                    {e.type === 'Income' ? '+' : '-'}{e.currencyCode} {e.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Top spending */}
      {topCategories.length > 0 && (
        <div className="card top-categories">
          <h3>Top Spending Categories</h3>
          <div className="top-cat-list">
            {topCategories.map((c, i) => (
              <div key={c.categoryId} className="top-cat-item">
                <span className="top-cat-rank">#{i + 1}</span>
                <span className="top-cat-icon">{c.categoryIcon}</span>
                <span className="top-cat-name">{c.categoryName}</span>
                <div className="top-cat-bar-wrap">
                  <div className="top-cat-bar" style={{ width: `${c.percentage}%`, background: c.categoryColor }} />
                </div>
                <span className="top-cat-amount">{fmt(c.totalAmount)}</span>
                <span className="top-cat-pct">{c.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
