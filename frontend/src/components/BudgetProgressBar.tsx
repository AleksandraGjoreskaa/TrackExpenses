interface BudgetProgressBarProps {
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  monthlyLimit: number;
  currentMonthSpent: number;
  percentageUsed: number;
  isExceeded: boolean;
  remainingAmount: number;
  sym?: string; // currency symbol, defaults to $
}

export default function BudgetProgressBar({
  categoryName,
  categoryIcon,
  categoryColor,
  monthlyLimit,
  currentMonthSpent,
  percentageUsed,
  isExceeded,
  remainingAmount,
  sym = '$',
}: BudgetProgressBarProps) {
  const clampedPct = Math.min(percentageUsed, 100);
  const barColor = isExceeded
    ? '#ef4444'
    : percentageUsed >= 80
    ? '#f97316'
    : categoryColor;

  return (
    <div className="budget-bar-item">
      <div className="budget-bar-header">
        <div className="budget-bar-label">
          <span className="budget-bar-icon">{categoryIcon}</span>
          <span className="budget-bar-name">{categoryName}</span>
          {isExceeded && <span className="budget-exceeded-badge">⚠️ Exceeded</span>}
        </div>
        <div className="budget-bar-amounts">
          <span className="budget-spent">{sym}{currentMonthSpent.toFixed(2)}</span>
          <span className="budget-limit"> / {sym}{monthlyLimit.toFixed(2)}</span>
        </div>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${clampedPct}%`, background: barColor }}
        />
      </div>
      <div className="budget-bar-footer">
        <span style={{ color: isExceeded ? '#ef4444' : 'var(--text-muted)' }}>
          {isExceeded
            ? `Over by ${sym}${Math.abs(remainingAmount).toFixed(2)}`
            : `${sym}${remainingAmount.toFixed(2)} remaining`}
        </span>
        <span style={{ color: barColor, fontWeight: 700 }}>
          {percentageUsed.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
