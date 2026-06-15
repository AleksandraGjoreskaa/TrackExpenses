import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { useStatistics } from '../hooks/useStatistics';
import { useCurrencies } from '../hooks/useCurrencies';
import LoadingSpinner from '../components/LoadingSpinner';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default function ReportsPage() {
  const { overview, monthly, yearly, topCategories, loading } =
      useStatistics();

  const { getSymbol } = useCurrencies();

  const sym = getSymbol(
      localStorage.getItem('defaultCurrency') ?? 'USD'
  );

  const fmt = (value: number) =>
      `${sym}${Number(value).toFixed(2)}`;

  if (loading) {
    return <LoadingSpinner text="Loading reports..." />;
  }

  const monthlyChart = (monthly ?? []).map((m) => ({
    name: `${MONTH_NAMES[m.month - 1]} ${m.year}`,
    Income: m.totalIncome,
    Expenses: m.totalExpenses,
    Balance: m.balance,
  }));

  const yearlyChart = (yearly ?? []).map((y) => ({
    name: String(y.year),
    Income: y.totalIncome,
    Expenses: y.totalExpenses,
    Balance: y.balance,
  }));

  const pieData = (topCategories ?? []).map((c) => ({
    name: `${c.categoryIcon} ${c.categoryName}`,
    value: c.totalAmount,
    color: c.categoryColor,
  }));

  return (
      <div className="page">
        <div className="page-header">
          <h1>Reports & Analytics</h1>
        </div>

        {/* Overview */}

        <div className="stats-grid">
          {[
            {
              label: 'Total Income',
              value: fmt(overview?.totalIncome ?? 0),
              color: '#22c55e',
            },
            {
              label: 'Total Expenses',
              value: fmt(overview?.totalExpenses ?? 0),
              color: '#ef4444',
            },
            {
              label: 'Balance',
              value: fmt(overview?.currentBalance ?? 0),
              color: '#3b82f6',
            },
            {
              label: 'Avg/Month',
              value: fmt(
                  overview?.averageSpendingPerMonth ?? 0
              ),
              color: '#a855f7',
            },
            {
              label: 'Highest Expense',
              value: fmt(
                  overview?.highestExpenseAmount ?? 0
              ),
              color: '#f97316',
              sub: overview?.highestExpenseTitle ?? '-',
            },
            {
              label: 'Lowest Expense',
              value: fmt(
                  overview?.lowestExpenseAmount ?? 0
              ),
              color: '#06b6d4',
              sub: overview?.lowestExpenseTitle ?? '-',
            },
            {
              label: 'Transactions',
              value: String(
                  overview?.totalTransactions ?? 0
              ),
              color: '#eab308',
            },
          ].map((stat) => (
              <div
                  key={stat.label}
                  className="stat-chip card"
              >
                <p className="stat-chip-label">
                  {stat.label}
                </p>

                <p
                    className="stat-chip-value"
                    style={{ color: stat.color }}
                >
                  {stat.value}
                </p>

                {stat.sub && (
                    <p className="stat-chip-sub">
                      {stat.sub}
                    </p>
                )}
              </div>
          ))}
        </div>

        {/* Monthly trend */}

        <div className="chart-card card">
          <h3>Monthly Trend</h3>

          {monthlyChart.length === 0 ? (
              <p className="no-data">No data yet.</p>
          ) : (
              <ResponsiveContainer
                  width="100%"
                  height={300}
              >
                <LineChart
                    data={monthlyChart}
                    margin={{
                      top: 5,
                      right: 20,
                      left: 0,
                      bottom: 5,
                    }}
                >
                  <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                  />

                  <XAxis
                      dataKey="name"
                      tick={{
                        fill: 'var(--text-muted)',
                        fontSize: 11,
                      }}
                  />

                  <YAxis
                      tick={{
                        fill: 'var(--text-muted)',
                        fontSize: 11,
                      }}
                      tickFormatter={(v) =>
                          `${sym}${v}`
                      }
                  />

                  <Tooltip
                      formatter={(value) => [
                        fmt(Number(value)),
                      ]}
                  />

                  <Legend />

                  <Line
                      type="monotone"
                      dataKey="Income"
                      stroke="#4ade80"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                  />

                  <Line
                      type="monotone"
                      dataKey="Expenses"
                      stroke="#f87171"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                  />

                  <Line
                      type="monotone"
                      dataKey="Balance"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
          )}
        </div>

        <div className="charts-row">

          {/* Yearly summary */}

          <div className="chart-card card">
            <h3>Yearly Summary</h3>

            {yearlyChart.length === 0 ? (
                <p className="no-data">
                  No data yet.
                </p>
            ) : (
                <ResponsiveContainer
                    width="100%"
                    height={260}
                >
                  <BarChart data={yearlyChart}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                    />

                    <XAxis
                        dataKey="name"
                        tick={{
                          fill: 'var(--text-muted)',
                          fontSize: 11,
                        }}
                    />

                    <YAxis
                        tick={{
                          fill: 'var(--text-muted)',
                          fontSize: 11,
                        }}
                        tickFormatter={(v) =>
                            `${sym}${v}`
                        }
                    />

                    <Tooltip
                        formatter={(value) => [
                          fmt(Number(value)),
                        ]}
                    />

                    <Legend />

                    <Bar
                        dataKey="Income"
                        fill="#4ade80"
                        radius={[4, 4, 0, 0]}
                    />

                    <Bar
                        dataKey="Expenses"
                        fill="#f87171"
                        radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
            )}
          </div>

          {/* Pie chart */}

          <div className="chart-card card">
            <h3>Spending by Category</h3>

            {pieData.length === 0 ? (
                <p className="no-data">
                  No expense data yet.
                </p>
            ) : (
                <ResponsiveContainer
                    width="100%"
                    height={260}
                >
                  <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        label={({ percent }) =>
                            `${(
                                (percent ?? 0) * 100
                            ).toFixed(0)}%`
                        }
                        labelLine={false}
                    >
                      {pieData.map(
                          (entry, index) => (
                              <Cell
                                  key={index}
                                  fill={entry.color}
                              />
                          )
                      )}
                    </Pie>

                    <Tooltip
                        formatter={(value) => [
                          fmt(Number(value)),
                        ]}
                    />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top categories */}

        {topCategories?.length > 0 && (
            <div className="card">
              <h3>Top Spending Categories</h3>

              <table className="expense-table">
                <thead>
                <tr>
                  <th>Category</th>
                  <th>Transactions</th>
                  <th>Total Spent</th>
                  <th>Share</th>
                </tr>
                </thead>

                <tbody>
                {topCategories.map((c) => (
                    <tr key={c.categoryId}>
                      <td>
                    <span
                        className="category-chip"
                        style={{
                          background: `${c.categoryColor}22`,
                          color: c.categoryColor,
                        }}
                    >
                      {c.categoryIcon}{' '}
                      {c.categoryName}
                    </span>
                      </td>

                      <td>
                        {c.transactionCount}
                      </td>

                      <td className="amount-expense">
                        {fmt(c.totalAmount)}
                      </td>

                      <td>
                        <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                        >
                          <div
                              className="top-cat-bar-wrap"
                              style={{ width: 100 }}
                          >
                            <div
                                className="top-cat-bar"
                                style={{
                                  width: `${
                                      c.percentage ?? 0
                                  }%`,
                                  background:
                                  c.categoryColor,
                                }}
                            />
                          </div>

                          {c.percentage ?? 0}%
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
}